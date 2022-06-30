import json
import threading

from app import app, db
from app.models import Accuracy, ConfusionMatrix, LabeledFile, Model, Prediction
from flask import jsonify, request

from .active_learning import session, train_and_predict, update_s3_dir


@app.route("/")
def home():
    return "Active Learning API is running!"


# Get the next 5 predictions with most uncertainty
@app.route("/uncertainties", methods=["GET"])
def get_uncertainties():
    # return jsonify(list(itertools.islice(filenames, 5)))
    predictions = (
        db.session.query(Prediction)
        .order_by(db.func.abs(0.5 - Prediction.predicted_value))
        .filter(~Prediction.labeling)
        .limit(5)
        .all()
    )
    response = []
    for p in predictions:
        cur_p = {}
        p.labeling = True
        cur_p["id"] = p.id
        cur_p["audioUrl"] = p.audio_url
        cur_p["location"] = p.location
        cur_p["duration"] = p.duration
        cur_p["timestamp"] = p.timestamp
        if p.predicted_value >= 0.5:
            cur_p["confidence"] = 200 * p.predicted_value - 100
            cur_p["orca"] = False
        else:
            cur_p["confidence"] = -200 * p.predicted_value + 100
            cur_p["orca"] = True
        response.append(cur_p)
    db.session.commit()
    return jsonify(response)


def update_datasets(data):
    for cur_id in data["unlabeled"]:
        prediction = Prediction.query.get(cur_id)
        if prediction is not None:
            prediction.labeling = False

    for i, label in enumerate(data["labels"]):
        db.session.query(Prediction).filter(Prediction.id == label["id"]).delete()

        validation = i == 4
        updated_url = update_s3_dir(label["audioUrl"], label["orca"], validation)

        new_labeled_file = LabeledFile(
            updated_url, label["orca"], label["extraLabel"], data["expertiseLevel"]
        )
        db.session.add(new_labeled_file)

    db.session.commit()


# Add new labeled files
@app.route("/labeledfiles", methods=["POST"])
def post_labeledfiles():
    if request.headers["Content-Type"] == "text/plain;charset=UTF-8":
        data = json.loads(request.data.decode("utf-8"))
    elif request.headers["Content-Type"] == "application/json":
        data = request.json
    else:
        return jsonify({"error": "Unsupported Media Type"}), 415

    session["cur_labels"] += len(data["labels"])
    th = threading.Thread(target=update_datasets, args=[data])
    th.start()

    if not session["training"] and session["cur_labels"] >= session["goal"]:
        th = threading.Thread(target=train_and_predict)
        th.start()
        session["cur_labels"] = 0

    return {"success": True}, 201


# Get Confusion Matrix, Model Accuracy and Number of Labeled files over Time
@app.route("/statistics", methods=["GET"])
def get_statistics():
    model_accuracy_query = db.session.query(
        Model.accuracy, Model.labeled_files, Model.timestamp
    ).all()
    model_accuracies, labeled_files, timestamps = [], [], []
    for query in model_accuracy_query:
        model_accuracies.append(query[0])
        labeled_files.append(query[1])
        timestamps.append(query[2])

    accuracy = db.session.query(
        Accuracy.acc, Accuracy.val_acc, Accuracy.loss, Accuracy.val_loss
    ).all()
    train = []
    validation = []
    train_l = []
    validation_l = []
    for t in accuracy:
        train.append(t[0])
        validation.append(t[1])
        train_l.append(t[2])
        validation_l.append(t[3])

    [confusion_matrix] = db.session.query(
        ConfusionMatrix.tn, ConfusionMatrix.fp, ConfusionMatrix.fn, ConfusionMatrix.tp
    ).all()

    data = {
        "retrain": {"progress": session["cur_labels"], "goal": session["goal"]},
        "confusionMatrix": list(confusion_matrix),
        "accuracy": {"train": train, "validation": validation},
        "loss": {"train": train_l, "validation": validation_l},
        "accuracyVLabels": {
            "accuracies": model_accuracies,
            "labels": labeled_files,
            "dates": timestamps,
        },
        "training": session["training"],
    }
    return data
