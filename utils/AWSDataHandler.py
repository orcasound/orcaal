import subprocess
from pathlib import Path

from utils.IDataHandler import IDataHandler


class AWSDataHandler(IDataHandler):
    """
    Implements Datahandler class for
    data existing in AWS S3
    """

    @staticmethod
    def list(path: Path, *args) -> None:
        try:
            subprocess.run(["aws", "s3", "ls", path, *args])
        except subprocess.CalledProcessError as e:
            print(e.output)

    @staticmethod
    def copy(src: Path, dst: Path, *args) -> None:
        try:
            subprocess.run(["aws", "s3", "cp", src, dst, *args])
        except subprocess.CalledProcessError as e:
            print(e.output)

    @staticmethod
    def move(src: Path, dst: Path, *args) -> None:
        try:
            subprocess.run(["aws", "s3", "mv", src, dst, *args])
        except subprocess.CalledProcessError as e:
            print(e.output)

    @staticmethod
    def delete(file: Path, *args) -> None:
        try:
            subprocess.run(["aws", "s3", "rm", file, *args])
        except subprocess.CalledProcessError as e:
            print(e.output)

    @staticmethod
    def sync(src: Path, dst: Path, *args) -> None:
        try:
            subprocess.run(["aws", "s3", "sync", src, dst, *args])
        except subprocess.CalledProcessError as e:
            print(e.output)
