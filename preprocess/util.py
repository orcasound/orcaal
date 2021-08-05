import librosa
import matplotlib.pyplot as plt
from skimage.restoration import denoise_wavelet
import os

import numpy as np
import tensorflow as tf
import tensorflow_hub as hub
import tensorflow_io as tfio


def apply_per_channel_energy_norm(spectrogram):
    """Apply PCEN.

    This function normalizes a time-frequency representation S by
    performing automatic gain control, followed by nonlinear compression:

    P[f, t] = (S / (eps + M[f, t])**gain + bias)**power - bias**power
    PCEN is a computationally efficient frontend for robust detection
    and classification of acoustic events in heterogeneous environments.

    This can be used to perform automatic gain control on signals that
    cross or span multiple frequency bans, which may be desirable
    for spectrograms with high frequency resolution.

    Args:
        spectrograms: The data from the audio file used to create spectrograms.
        sampling_rate: The sampling rate of the audio files.

    Returns:
        PCEN applied spectrogram data.
    """

    pcen_spectrogram = librosa.core.pcen(spectrogram)
    return pcen_spectrogram


def wavelet_denoising(spectrogram):
    """In this step we would apply Wavelet-denoising.

    Wavelet denoising is an effective method for SNR improvement
    in environments with wide range of noise types competing for the
    same subspace.

    Wavelet denoising relies on the wavelet representation of
    the image. Gaussian noise tends to be represented by small values in the
    wavelet domain and can be removed by setting coefficients below
    a given threshold to zero (hard thresholding) or
    shrinking all coefficients toward zero by a given
    amount (soft thresholding).

    Args:
        data:Spectrogram data in the form of numpy array.

    Returns:
        Denoised spectrogram data in the form of numpy array.
    """
    im_bayes = denoise_wavelet(spectrogram,
                               multichannel=False,
                               convert2ycbcr=False,
                               method="BayesShrink",
                               mode="soft")
    return im_bayes


def spec_plot_and_save(denoised_data, f_name, output_dir):
    """Generate the spectrogram and save them.

    Args:
        denoised_data: The spectrogram data that is generated either by
        PCEN or Wavelet-denoising.
        f_name: The name of the output file.
        output_dir: The path to the output directory.

    Returns:
        none.
    """
    fig, ax = plt.subplots()
    i = 0
    ax.imshow(denoised_data)
    ax.get_xaxis().set_visible(False)
    ax.get_yaxis().set_visible(False)
    fig.set_size_inches(10, 10)
    # os.chdir(plotPath)
    fig.savefig(os.path.join(output_dir, f"{f_name[:-4]}.png"),
                dpi=80,
                bbox_inches="tight",
                quality=95,
                pad_inches=0.0)
    fig.canvas.draw()
    fig.canvas.flush_events()
    i += 1
    plt.close(fig)




def select_spec_case(plot_path, folder_path, pcen=False, wavelet=False):
    """Selects the preprocessing steps to be applied to the spectrogram.

    Depending upon the choices entered by the user this function would
    select the necessary preprocessing stages and call their respective
    functions.

    Args:
        plot_path: The output path where we want to plot the spectrograms.
        folder: The input_path which contains the audio that would
            be used to generate spectrograms.
        pcen: Could be set to True if we want to apply PCEN to spectrograms.
        wavelet:Could be set to true if we want to apply Wavelet denoising
            to the spectrograms.

    Returns:
        None.
    """
    onlyfiles = [
        f for f in os.listdir(folder_path)
        if os.path.isfile(os.path.join(folder_path, f))
    ]
    for id, file in enumerate(onlyfiles):
        fpath = os.path.join(folder_path, file)
        data, sr = librosa.core.load(fpath, res_type="kaiser_best")
        f_name = os.path.basename(file)

        spectrogram_data = librosa.feature.melspectrogram(data, sr=sr, power=1)
        if pcen and not wavelet:
            pcen_spec = apply_per_channel_energy_norm(spectrogram_data)
        elif pcen and wavelet:
            pcen_spec = apply_per_channel_energy_norm(spectrogram_data)
            spectrogram_data = wavelet_denoising(pcen_spec)
        spec_plot_and_save(spectrogram_data, f_name, plot_path)


def extract_embedding_from_signal(waveform,model):
    "Assumes the waveform has the correct sample rate"

    if model == 'vggish':
        embedding = vggish_model(waveform)
    if model == 'yamnet':
        scores, embedding, log_mel_spectrogram = yamnet_model(waveform)
    if model == 'humpback':
        
        waveform = tf.Variable(waveform.reshape([-1,1]),dtype=tf.float32)
        waveform = tf.expand_dims(waveform, 0)  # makes a batch of size 1
        pcen_spectrogram = humpback_model.front_end(waveform)
        
        # zero pad if lenght not a multiple of 128
        w_size = 128 # 3.84 seconds context window
        
        if pcen_spectrogram.shape[1] % w_size != 0:
            even_n = w_size - pcen_spectrogram.shape[1] % w_size
            pcen_spectrogram = tf.concat([pcen_spectrogram,tf.zeros([1,even_n,64])], axis=1)

        n_frames = int(pcen_spectrogram.shape[1]/w_size)

        batch_pcen_spectrogram = tf.reshape(pcen_spectrogram,shape=(n_frames,w_size,64)) 
        embedding = humpback_model.features(batch_pcen_spectrogram)
    
    return embedding

def save_embedding(mean_embedding, f_name, output_dir):
    """" Save embedding as tsv file """
    embedding_file = os.path.join(output_dir, f"{f_name[:-4]}.tsv")
    with open(embedding_file, 'a') as f:
        for val in mean_embedding:
            f.write('{0:.4f}\t'.format(val))


def select_spec_case_embedding(plot_path, folder_path, pcen=False, wavelet=False,model='yamnet'):
    """Selects the preprocessing steps to be applied to the spectrogram.

    Depending upon the choices entered by the user this function would
    select the necessary preprocessing stages and call their respective
    functions.

    Args:
        plot_path: The output path where we want to plot the spectrograms.
        folder: The input_path which contains the audio that would
            be used to generate spectrograms.
        pcen: Could be set to True if we want to apply PCEN to spectrograms.
        wavelet:Could be set to true if we want to apply Wavelet denoising
            to the spectrograms.
        model: The model to use to extract the embeddings, options are 'vggish',
        'yamnet', and 'humpback'

    Returns:
        None.
    """
    onlyfiles = [
        f for f in os.listdir(folder_path)
        if os.path.isfile(os.path.join(folder_path, f))
    ]
    for id, file in enumerate(onlyfiles):
        fpath = os.path.join(folder_path, file)
        data, sr = librosa.core.load(fpath, res_type="kaiser_best")
        f_name = os.path.basename(file)

        spectrogram_data = librosa.feature.melspectrogram(data, sr=sr, power=1)
        # compute embedding
        embedding = extract_embedding_from_signal(data,model)
        # aggregate data
        mean_embedding = tf.reduce_mean(embedding,axis=0)
        # save embedding tsv
        save_embedding(mean_embedding,f_name,plot_path)

        if pcen and not wavelet:
            pcen_spec = apply_per_channel_energy_norm(spectrogram_data)
        elif pcen and wavelet:
            pcen_spec = apply_per_channel_energy_norm(spectrogram_data)
            spectrogram_data = wavelet_denoising(pcen_spec)
        spec_plot_and_save(spectrogram_data, f_name, plot_path)