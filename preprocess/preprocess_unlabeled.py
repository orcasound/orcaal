"""Preprocess unlabeled data from a directory.

This module takes a directory containing ts audiofiles,
generates mp3 files of a specified duration.
Then for each audio, its mel spectrogram is computed,
and per-channel energy normalization and
wavelet denoising are applied to the spectrograms.

Example:
    $ python preprocess_unlabeled.py testdata

"""

import argparse
import os
import subprocess
from shutil import rmtree

import librosa
from util import select_spec_case


def main(input_dir, output_dir, trimmed_dur, location, starting_timestamp):
    # Write a file with the name of the ts files for ffmpeg
    ts_files = [
        f for f in os.listdir(input_dir) if os.path.isfile(os.path.join(input_dir, f))
    ]

    # Create temp folder to help with preprocessing
    if not os.path.exists("temp"):
        os.makedirs("temp")

    with open("temp/mylist.txt", "w") as output:
        for f in ts_files:
            if f[-2:] == "ts":
                output.write(f"file ../{input_dir}/{f} \n")

    # Concatenate them into a single file
    subprocess.run(
        [
            "ffmpeg",
            "-f",
            "concat",
            "-safe",
            "0",
            "-i",
            "temp/mylist.txt",
            "-c",
            "copy",
            "temp/all.ts",
        ]
    )

    # Convert concatenated ts file to mp3
    subprocess.run(
        [
            "ffmpeg",
            "-i",
            "temp/all.ts",
            "-c:v",
            "libx264",
            "-c:a",
            "copy",
            "-bsf:a",
            "aac_adtstoasc",
            "temp/output.mp4",
        ]
    )
    subprocess.run(["ffmpeg", "-i", "temp/output.mp4", "temp/output.mp3"])

    # Trim audio file to multiple files of duration timmed_dir
    # Store audios in directory [output_dir]/mp3
    audios_dir = "%s/mp3" % output_dir
    input_dur = int(librosa.get_duration(filename="temp/output.mp3"))

    if not os.path.exists(audios_dir):
        os.makedirs(audios_dir)

    for start_time in range(0, input_dur, trimmed_dur):
        subprocess.run(
            [
                "ffmpeg",
                "-ss",
                "%d" % start_time,
                "-t",
                "%d" % trimmed_dur,
                "-i",
                "temp/output.mp3",
                "%s/%s_%d.mp3"
                % (audios_dir, location, starting_timestamp + start_time),
            ]
        )

    # Generate spectrograms from audio files
    # Store spectrogram in directory [output_dir]/spectrograms
    specs_dir = "%s/spectrograms" % output_dir
    if not os.path.exists(specs_dir):
        os.makedirs(specs_dir)

    select_spec_case(
        plot_path=specs_dir, folder_path=audios_dir, pcen=True, wavelet=True
    )

    # Delete temporary directory
    rmtree("temp")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter
    )

    parser.add_argument(
        "input_dir",
        help="Name of the directory inside containing audios"
        "in transport stream (ts) format",
    )
    parser.add_argument(
        "output_dir",
        help="Name of the directory where the mp3 and spectrograms will be stored",
    )
    parser.add_argument(
        "-d",
        "--duration",
        default=3,
        type=int,
        help="Duration in seconds of the output mp3 files (default: %(default)s)",
    )
    parser.add_argument(
        "-l",
        "--location",
        default="",
        type=str,
        help='Place without spaces where the sounds where detected (default: "")',
    )
    parser.add_argument(
        "-s",
        "--starting_timestamp",
        default=0,
        type=int,
        help="Unix Timestamp that will be the name of the"
        "first file (default: %(default)s)",
    )

    args = parser.parse_args()

    main(
        args.input_dir,
        args.output_dir,
        args.duration,
        args.location,
        args.starting_timestamp,
    )
