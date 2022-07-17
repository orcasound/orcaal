import os

from easydict import EasyDict as eDict

from utils.DataHandlerConfig import DataHandlerConfig


def parse_env_configs():
    configs = eDict()
    configs.data_handler = DataHandlerConfig.get_datahandler(
        os.environ.get("DATA_SOURCE")
    )
    configs.retrain_target = int(os.environ.get("RETRAIN_TARGET"))
    configs.ml_endpoint_url = os.environ.get("ML_ENDPOINT_URL")
    configs.s3_model_path = os.environ.get("S3_MODEL_PATH")
    configs.s3_unlabeled_path = os.environ.get("S3_UNLABELED_PATH")
    configs.s3_labeled_path = os.environ.get("S3_LABELED_PATH")
    configs.img_width = os.environ.get("IMG_WIDTH")
    configs.img_height = os.environ.get("IMG_HEIGHT")
    configs.epochs = os.environ.get("EPOCHS")
    configs.database_url = os.environ.get("DATABASE_URL")
    return configs


configs = parse_env_configs()
