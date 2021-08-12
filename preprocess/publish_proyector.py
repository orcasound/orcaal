import numpy as np
import os
import pandas as pd
from PIL import Image

unlabeled_path = "/home/wetdog/orcaal/preprocess/unlabeled_test_cpu/"
img_path = f"{unlabeled_path}/spectrograms/"
folder_name = os.path.basename(unlabeled_path[:-1])

# read csv file with embeddings 
embeddings_file = os.path.join(unlabeled_path, folder_name + '_embeddings.csv')
df = pd.read_csv(embeddings_file)
df_embeddings = df.copy()
df_embeddings.drop(columns='filename',inplace=True)
df_embeddings.to_csv('embeddings_' + folder_name + '.tsv',sep='\t',index=False,header=False)
filenames = df['filename'].values
df['filename'].to_csv('metadata_' + folder_name + '.tsv',sep='\t',index=False,header=False)

# make sprite image
imglist = [os.path.join(img_path,filename[:-4]+'.png') for filename in filenames]
images = [Image.open(filepath).resize((70,70)) for filepath in imglist]

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
spriteimage.convert("RGB").save('sprite_' + folder_name + '.jpg', transparency=0)

