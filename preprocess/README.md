## Preprocess unlabeled data

preprocess_unlabeled.py is a python script that generates mp3 files and spectrograms, given a directory containing ts files.

To run the script:

-   Install [Python](https://www.python.org/) and [ffmpeg](https://ffmpeg.org/)
-   Create venv: `python -m venv venv`
-   Activate venv: `source venv/bin/activate` or `venv\Scripts\Activate.ps1` if you're using PS in windows
-   Install dependencies: `pip install -r requirements.txt`
-   Run script: `python preprocess_unlabeled.py [input_dir] [output_dir] [-d duration (default=3)] [-l location] [-s starting timestamp]`

For example, to run the script with test data:
Run `python preprocess_unlabeled.py testdata unlabeled_test -l orcasoundlab -s 1594150218` and the script would generate an `unlabeled_test` directory with three subdirectories: `mp3` containing the mp3 files,`spectrograms` containing the spectrograms of the mp3 files, and `embeddings` containing a tsv file per each audio_clip. It takes roughly 4 hours to run the script using a folder that contains 6 hours of data. 

Once you have the 3 folders, you have to run `python get_distances.py unlabeled_test` to concatenate all of the embeddings, compute the distances and information metrics. Then run  
`python ../train_and_predict/run_local.py unlabeled_test` to save the predictions on the unlabeled files as a tsv file.

Finally, if you want to publish the data in the embedding projector you have to run `python publish_projector.py unlabeled_test`, and the files required by the projector are generated inside `projector` folder

A testdata folder containing ts files has been provided to test the script.  
But the objective is to download the ts files from an s3 bucket. For that you would need to install [AWS CLI](https://aws.amazon.com/cli/) and configure it by entering your access keys after the following command `aws configure`. Then you can run `aws s3 sync [remote s3 directory] [local directory]`, e.g. `aws s3 sync s3://streaming-orcasound-net/rpi_orcasound_lab/hls/1594150218/ ts`  
The preprocessed unlabeled files can then be uploaded to s3 by running `aws s3 sync [local directory] [remote s3 directory]`, e.g. `aws s3 sync unlabeled s3://orcagsoc/unlabeled/`
