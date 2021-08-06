import numpy as np
import os
import pandas as pd

unlabeled_path = '/home/wetdog/orcaal/preprocess/unlabeled_test'
embeddings_path = os.path.join(unlabeled_path, 'embeddings')

embedding_files = [os.path.join(embeddings_path, file) for file in os.listdir(embeddings_path) if file.endswith('.tsv')]


# concatenate tsv files
df = pd.DataFrame()

for file in embedding_files:
    df_temp = pd.read_csv(file, sep='\t', header=None)
    df_temp['filename'] = str(os.path.basename(file))
    df = pd.concat([df, df_temp])

df.dropna(axis=1,inplace=True)

df_embedding = df.copy()
df_embedding = df_embedding.drop(columns='filename')
all_embeddings = df_embedding.values
i_metric = []

for i, row in df_embedding.iterrows():
    
    embedding_example = row.values
    # compute distance of the example wrt to all the dataset
    distances = np.linalg.norm(embedding_example-all_embeddings,axis=1)
    # compute similarity
    similarity = 1 / (1 + distances)
    # representativeness
    representativeness = (1/len(distances)*np.sum(similarity))
    i_metric.append(representativeness)

df['representativeness'] = i_metric

print(df)
# save concatenated file
df.to_csv(os.path.basename(unlabeled_path) + '_embeddings.csv')
