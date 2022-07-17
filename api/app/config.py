import os

from easydict import EasyDict as eDict

from utils.AWSDataHandler import AWSDataHandler
from utils.IDataHandler import IDataHandler
from utils.LocalDataHandler import LocalDataHandler


class DataHandlerConfig:
    def get_datahandler(self, handler_type: str) -> IDataHandler:
        try:
            handler_type = handler_type.lower()
        except AttributeError as e:
            print(e.output)
        if handler_type == "AWS":
            return AWSDataHandler
        elif handler_type == "local":
            return LocalDataHandler
        else:
            raise ValueError(f"Handler type {handler_type} input is invalid")


def parse_env_configs():
    configs = eDict()
    configs.data_handler = DataHandlerConfig(os.environ.get("DATA_HANDLER"))
    return configs


configs = parse_env_configs()
