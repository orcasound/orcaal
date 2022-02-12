import logging
import os
import threading
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine, inspect

basedir = os.path.abspath(os.path.dirname(__name__))

# Init app
app = Flask(__name__)
CORS(app)

# Database
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get(
    "DATABASE_URL"
) or "sqlite:///" + os.path.join(basedir, "app.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Heroku logs to stdout
app.config["LOG_TO_STDOUT"] = os.environ.get("LOG_TO_STDOUT")
if app.config["LOG_TO_STDOUT"]:
    stream_handler = logging.StreamHandler()
    stream_handler.setLevel(logging.INFO)
    app.logger.addHandler(stream_handler)

# Init db
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# from app import routes, models
from app.models import (  # noqa: E402
    Accuracy,
    ConfusionMatrix,
    LabeledFile,
    Model,
    Prediction,
)

# Handle circular imports
from .active_learning import train_and_predict  # noqa: E402

if not app.debug or os.environ.get("WERKZEUG_RUN_MAIN") == "true":
    # The app is not in debug mode or we are in the reloaded process
    # Start training if the tables generated after each training round
    # are empty
    engine = create_engine(app.config["SQLALCHEMY_DATABASE_URI"])
    if inspect(engine).has_table(
       "accuracy") and db.session.query(Accuracy).first() is None:
        th = threading.Thread(target=train_and_predict)
        th.start()


# Load the database instance and models to flask shell
@app.shell_context_processor
def make_shell_context():
    return {
        "db": db,
        "LabeledFile": LabeledFile,
        "Model": Model,
        "Prediction": Prediction,
        "ConfusionMatrix": ConfusionMatrix,
        "Accuracy": Accuracy,
    }
