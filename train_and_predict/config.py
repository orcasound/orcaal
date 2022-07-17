import os

from easydict import EasyDict as eDict

from utils.DataHandlerConfig import DataHandlerConfig


def parse_env_configs():
    configs = eDict()
    configs.data_handler = DataHandlerConfig.get_datahandler(
        os.environ.get("DATA_SOURCE")
    )
    return configs


configs = parse_env_configs()
