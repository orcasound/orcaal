from app.models import LabeledFile, Model, Prediction, ConfusionMatrix, Accuracy
from datetime import datetime


def test_new_labeled_file():
    """
    GIVEN a LabeledFile model
    WHEN a new LabeledFile is created
    THEN check the audio_url, orca, extra_label, and expertise_level fields
    are defined correctly
    """
    new_labeled_file = LabeledFile('test.mp3', True, '', 'Beginner')
    assert new_labeled_file.audio_url == 'test.mp3'
    assert new_labeled_file.orca
    assert not new_labeled_file.extra_label
    assert new_labeled_file.expertise_level == 'Beginner'


def test_new_model():
    """
    GIVEN a Model model
    WHEN a new model is added
    THEN check the model is defined correctly
    """
    new_model = Model('srkw_cnn', 0, 'srkw_cnn_0.h5', 0.82, 0.07, 120)
    assert new_model.name == 'srkw_cnn'
    assert new_model.version == 0
    assert new_model.url == 'srkw_cnn_0.h5'
    assert new_model.accuracy == 0.82
    assert new_model.loss == 0.07
    assert new_model.labeled_files == 120


def test_new_prediction():
    """
    GIVEN a Prediction model
    WHEN a new prediction is added
    THEN check the prediction is defined correctly
    """
    new_prediction = Prediction(0.6, 'test.mp3', 'Haro Strait', 3,
                                'Tue, 07 Jul 2020 15:36:27 GMT')
    assert new_prediction.predicted_value == 0.6
    assert new_prediction.audio_url == 'test.mp3'
    assert new_prediction.location == 'Haro Strait'
    assert new_prediction.duration == 3
    assert new_prediction.timestamp == 'Tue, 07 Jul 2020 15:36:27 GMT'
    assert not new_prediction.labeling


def test_new_confusion_matrix():
    """
    GIVEN a ConfusionMatrix model
    WHEN a new confusion matrix is added
    THEN check the confusion matrix is defined correctly
    """
    new_confusion_matrix = ConfusionMatrix(10, 20, 30, 40)
    assert new_confusion_matrix.tn == 10
    assert new_confusion_matrix.fp == 20
    assert new_confusion_matrix.fn == 30
    assert new_confusion_matrix.tp == 40


def test_new_accuracy():
    """
    GIVEN a Accuracy model
    WHEN a new accuracy is added
    THEN check the accuracy is defined correctly
    """
    new_accuracy = Accuracy(0.82, 0.8, 0.07, 0.08)
    assert new_accuracy.acc == 0.82
    assert new_accuracy.val_acc == 0.8
    assert new_accuracy.loss == 0.07
    assert new_accuracy.val_loss == 0.08