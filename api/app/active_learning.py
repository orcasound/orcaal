import os

import requests
from app import db
from app.config import configs
from app.models import Accuracy, ConfusionMatrix, Model, Prediction

# Global
session = {
    "goal": configs.retrain_target,
    "cur_labels": 0,
    "training": False,
}

ml_endpoint_url = configs.ml_endpoint_url
model_path = configs.model_path
unlabeled_path = configs.unlabeled_path
labeled_path = configs.labeled_path
img_width = configs.img_width
img_height = configs.img_height
epochs = configs.epochs

labeled_folder = labeled_path.split("/")[-2]
s3_url = f'https://{labeled_path.split("/")[2]}.s3.amazonaws.com/{labeled_folder}'

model_name = os.path.basename(model_path)
model_name = "_".join(model_name.split("_")[:-1])


def train_and_predict():
    # Train
    print("Training...")
    session["training"] = True
    # Get latest model
    latest_model = (
        db.session.query(Model)
        .filter(Model.name == model_name)
        .order_by(Model.version.desc())
        .first()
    )
    if latest_model is None:
        latest_model = Model(model_name, 0, model_path, 0, 0, 0)

    url = (
        f"{ml_endpoint_url}/train?model_url={latest_model.url}"
        f"&labeled_url={labeled_path}&"
        f"img_width={img_width}&"
        f"img_height={img_height}&"
        f"epochs={epochs}"
    )

    r = requests.get(url).json()
    acc = r["acc"]
    val_acc = r["val_acc"]
    loss = r["loss"]
    val_loss = r["val_loss"]
    tn, fp, fn, tp = r["cm"]

    Accuracy.query.delete()
    db.session.add_all(
        [Accuracy(acc[i], val_acc[i], loss[i], val_loss[i]) for i in range(len(acc))]
    )

    ConfusionMatrix.query.delete()
    db.session.add(ConfusionMatrix(tn, fp, fn, tp))

    db.session.add(
        Model(
            latest_model.name,
            latest_model.version + 1,
            r["model_url"],
            r["model_acc"],
            r["model_loss"],
            r["labeled_files"],
        )
    )

    db.session.commit()
    session["training"] = False
    print("Finished training")

    # Predict
    print("Predicting...")
    url = (
        f"{ml_endpoint_url}/predict?model_url={latest_model.url}"
        f"&unlabeled_url={unlabeled_path}&img_width={img_width}"
        f"&img_height={img_height}"
    )

    predictions = requests.get(url).json()

    Prediction.query.delete()
    db.session.add_all(
        [
            Prediction(
                prediction["predicted_value"],
                prediction["audio_url"],
                prediction["location"],
                prediction["duration"],
                prediction["timestamp"],
            )
            for prediction in predictions
        ]
    )

    db.session.commit()
    print("Finished predicting")


def update_s3_dir(audio_url, orca, validation):
    calls_path = "calls" if orca else "nocalls"
    validation_path = "validation" if validation else "train"
    filename = audio_url.split("/")[-1].split(".")[0]
    configs.data_handler.move(
        f"{unlabeled_path}spectrograms/{filename}.png",
        f"{labeled_path}{validation_path}/{calls_path}/",
    )
    configs.data_handler.move(
        f"{unlabeled_path}mp3/{filename}.mp3", f"{labeled_path}mp3/{calls_path}/"
    )
    return f"{s3_url}/mp3/{calls_path}/{filename}.mp3"
