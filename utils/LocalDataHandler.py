import os
import subprocess
from pathlib import Path

from utils.IDataHandler import IDataHandler


class LocalDataHandler(IDataHandler):
    """
    Implements Datahandler class for
    data existing in local directories
    """

    @staticmethod
    def list(path: Path) -> None:
        try:
            subprocess.run(["ls", path])
        except subprocess.CalledProcessError as e:
            print(e.output)

    @staticmethod
    def copy(src: Path, dst: Path) -> None:
        try:
            if os.path.isdir(src):
                subprocess.run(["cp", "-r", f"{src}", dst])
            else:
                subprocess.run(["cp", src, dst])
        except subprocess.CalledProcessError as e:
            print(e.output)

    @staticmethod
    def move(src: Path, dst: Path) -> None:
        try:
            subprocess.run(["mv", src, dst])
        except subprocess.CalledProcessError as e:
            print(e.output)

    @staticmethod
    def delete(file: Path) -> None:
        try:
            subprocess.run(["rm", file])
        except subprocess.CalledProcessError as e:
            print(e.output)
