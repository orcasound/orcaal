from abc import ABC, abstractmethod

class IDataHandler(ABC):

    @abstractmethod
    def list():
        raise NotImplementedError

    @abstractmethod
    def copy():
        raise NotImplementedError

    @abstractmethod
    def move():
        raise NotImplementedError

    @abstractmethod
    def delete():
        raise NotImplementedError
