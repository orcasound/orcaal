from predict import get_predictions_local


model_path = "/home/wetdog/orcaal/train_and_predict/models/srkw_5.h5"
unlabeled_path = "/home/wetdog/orcaal/preprocess/unlabeled_test"
img_width = 607
img_height = 617

predictions = get_predictions_local(model_path, unlabeled_path, img_width, img_height)

print(predictions)
