import argparse
import numpy as np
import os
import pandas as pd
from tqdm import tqdm

#unlabeled_path = '/home/wetdog/orcaal/preprocess/unlabeled_test'

def main(unlabeled_path):
    """ Create a tsv file with the representativeness metric and embedding vector per each audio clip """

    embeddings_path = os.path.join(unlabeled_path, 'embeddings')
    embedding_files = [os.path.join(embeddings_path, file) for file in os.listdir(embeddings_path) if file.endswith('.tsv')]

    # concatenate tsv files
    df = pd.DataFrame()
    print('Joining all embeddings...')
    for file in tqdm(embedding_files):
        df_temp = pd.read_csv(file, sep='\t', header=None)
        df_temp['filename'] = str(os.path.basename(file))
        df = pd.concat([df, df_temp])

    df.dropna(axis=1,inplace=True)
    df_embedding = df.copy()
    df_embedding = df_embedding.drop(columns='filename')
    all_embeddings = df_embedding.values
    i_metric = []

    print('Computing distances...')
    for i, row in tqdm(df_embedding.iterrows()):
        embedding_example = row.values
        # compute distance of the example wrt to all the dataset
        distances = np.linalg.norm(embedding_example-all_embeddings,axis=1)
        # compute similarity
        similarity = 1 / (1 + distances)
        # representativeness
        representativeness = (1/len(distances))*np.sum(similarity)
        i_metric.append(representativeness)

    df['representativeness'] = i_metric
    # save concatenated file
    df.to_csv(os.path.basename(unlabeled_path) + '_embeddings.csv')

if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter)

    parser.add_argument(
        'unlabeled_path',
        help=
        'path of the directory that contains embeddings files'
    )

    args = parser.parse_args()
    main(args.unlabeled_path)
