import os

from easydict import EasyDict as eDict

from utils.DataHandlerConfig import DataHandlerConfig


def parse_env_configs():
    configs = eDict()
    configs.data_source = os.environ.get("DATA_SOURCE").lower()
    configs.data_handler = DataHandlerConfig.get_datahandler(configs.data_source)
    return configs


configs = parse_env_configs()
