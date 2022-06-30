import os
import sys

import pytest
from dotenv import load_dotenv

load_dotenv()
basedir = os.path.abspath(os.path.dirname(__file__))
rootdir = os.path.dirname(basedir)
sys.path.append(rootdir)
from app import app, db  # noqa: E402


@pytest.fixture(scope="module")
def test_client():
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(
        basedir, "test.db"
    )
    app.config["TESTING"] = True

    # Flask provides a way to test your application by exposing the Werkzeug
    # test Client and handling the context locals for you.
    testing_client = app.test_client()

    # Establish an application context before running the tests.
    ctx = app.app_context()
    ctx.push()

    yield testing_client  # this is where the testing happens!

    ctx.pop()


@pytest.fixture(scope="module")
def init_database():
    # Create the database and the database table
    db.create_all()

    # Insert user data

    # Commit the changes for the users
    db.session.commit()

    yield db  # this is where the testing happens!

    db.drop_all()
