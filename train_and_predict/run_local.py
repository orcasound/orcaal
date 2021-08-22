from predict import get_predictions_local
import pandas as pd
import os
import argparse


def main(unlabeled_path):
    """" Get predictions using local preprocessed files to save the
    data that is passed to the predict API endpoint"""

    model_path = "/home/wetdog/orcaal/train_and_predict/models/srkw_5.h5"
    img_width = 607
    img_height = 617
    predictions = get_predictions_local(model_path, unlabeled_path, img_width, img_height)
    df = pd.DataFrame(predictions)
    df.to_csv(os.path.join(unlabeled_path,'metadata.tsv'), sep='\t',index=False)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter)

    parser.add_argument(
        'unlabeled_path',
        help=
        'path of the directory that contains preprocessed data created after preprocess_unlabeled run'
    )

    args = parser.parse_args()
    main(args.unlabeled_path)