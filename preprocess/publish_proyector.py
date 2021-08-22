import numpy as np
import os
import pandas as pd
from PIL import Image
import time


def main(unlabeled_path):
    """ Generate embeddings file, metadata file and sprite image from a unlabeled 
    folder in the format that the embedding projector expects"""

    img_path = f"{unlabeled_path}/spectrograms/"
    experiment_folder = f"{unlabeled_path}/projector/"

    if not(os.path.exists(experiment_folder)):
        os.mkdir(experiment_folder)

    folder_name = os.path.basename(unlabeled_path)

    # read csv file with embeddings 
    embeddings_file = os.path.join(unlabeled_path, folder_name + '_embeddings.csv')
    df = pd.read_csv(embeddings_file, index_col=0)
    df_embeddings = df.copy()
    # drop filename colum to save only embedding cols for projector
    df_embeddings.drop(columns='filename',inplace=True)
    df_embeddings.to_csv(os.path.join(experiment_folder, 'embeddings_' + folder_name + '.tsv'),sep='\t',index=False,header=False)


    filenames = df['filename'].values
    df_filenames = pd.DataFrame(df['filename'])
    df_filenames['filename'] = df_filenames.apply(lambda x: x['filename'][:-4],axis=1)
    df_metadata = pd.read_csv(f"{unlabeled_path}/metadata.tsv",sep='\t')
    df_metadata['filename'] = df_metadata.apply(lambda x: x['audio_path'].split('/')[-1][:-4],axis=1)

    # merge and sort metadata info in the same order as embeddings
    df_merged = df_filenames.merge(df_metadata, how='left',on='filename')
    df_merged.to_csv(os.path.join(experiment_folder, 'metadata_' + folder_name + '.tsv'),sep='\t',index=False)


    print('metadata done ...')
    time.sleep(2)
    # make sprite image
    img_dim = 70
    imglist = [os.path.join(img_path,filename[:-4]+'.png') for filename in filenames]
    images = [Image.open(filepath).resize((img_dim,img_dim)) for filepath in imglist]

    image_width, image_height = images[0].size
    one_square_size = int(np.ceil(np.sqrt(len(images))))
    master_width = (image_width * one_square_size) 
    master_height = image_height * one_square_size
    spriteimage = Image.new(
        mode='RGBA',
        size=(master_width, master_height),
        color=(0,0,0,0))  # fully transparent
    for count, image in enumerate(images):
        div, mod = divmod(count,one_square_size)
        h_loc = image_width*div
        w_loc = image_width*mod    
        spriteimage.paste(image.rotate(270),(w_loc,h_loc))

    spriteimage.convert("RGB").save(os.path.join(experiment_folder, 'sprite_' + folder_name + '.jpg'), transparency=0)


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

