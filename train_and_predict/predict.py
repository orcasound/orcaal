import os
from datetime import datetime

from config import configs
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import ImageDataGenerator

locations = {"orcasoundlab": "Haro Strait"}


def get_predictions_on_unlabeled(model_path, unlabeled_path, img_width, img_height):
    local_unlabeled_path = unlabeled_path.split("/")[-2]
    if configs.data_source == "aws":
        db_url = f'https://{unlabeled_path.split("/")[2]}.s3.amazonaws.com/'
        f"{local_unlabeled_path}"
        # Sync data from s3 to `unlabeled` directory
        configs.data_handler.sync(
            f"{unlabeled_path}spectrograms/", local_unlabeled_path, "--delete"
        )
    else:
        db_url = unlabeled_path
        configs.data_handler.copy(f"{unlabeled_path}", ".")

    local_model_path = os.path.basename(model_path)
    if not os.path.isfile(local_model_path):
        configs.data_handler.copy(model_path, ".")
    model = load_model(local_model_path)

    image_generator = ImageDataGenerator(rescale=1.0 / 255)
    data_generator = image_generator.flow_from_directory(
        ".",
        # only read images from `unlabeled` directory
        classes=[local_unlabeled_path],
        # don't generate labels
        class_mode=None,
        # don't shuffle
        shuffle=False,
        # use same size as in training
        target_size=(img_width, img_height),
        batch_size=64,
    )

    predictions = model.predict(data_generator).tolist()

    predictions_list = []
    for i in range(len(predictions)):
        cur_prediction = {}
        cur_prediction["predicted_value"] = predictions[i][0]
        cur_file = os.path.split(data_generator.filenames[i])[1].split(".")[0]
        cur_prediction["audio_url"] = f"{db_url}/mp3/{cur_file}.mp3"
        location, timestamp = cur_file.split("_")
        cur_prediction["location"] = locations[location]
        cur_prediction["duration"] = 3
        cur_prediction["timestamp"] = datetime.fromtimestamp(int(timestamp))
        predictions_list.append(cur_prediction)

    return predictions_list
