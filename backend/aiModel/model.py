# // For some images in NotContainer I used images from kaggle using data from the dataset from:
# // https://www.kaggle.com/datasets/utkarshsaxenadn/landscape-recognition-image-dataset-12k-images/data Use kaggle for scenary
# // https://www.kaggle.com/datasets/vikashrajluhaniwal/fashion-images Use kaggle for clothes and shoes
# // https://www.kaggle.com/datasets/vencerlanz09/plastic-and-paper-cups-synthetic-image-dataset use kaggle for cups
# // https://www.kaggle.com/datasets/boulahchichenadir/algerian-used-cars use kaggle for vehicles


# https://medium.com/@ilaslanduzgun/image-classification-with-tensorflow-a361c7b1eb05 for assistance
import matplotlib.pyplot as plt
import numpy as np
import PIL # this is pillow
import pathlib # this is to access files

# Ignore the underlines, vscode does not recognise it, but it works
import tensorflow as tf
from tensorflow import keras # this is to create and load dataset
from tensorflow.keras import layers
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense


# model = Sequential([
#     Dense(10, activation='relu', input_shape=(5,)),  # Input layer with 5 features
#     Dense(1, activation='sigmoid')                  # Output layer with 1 neuron
# ])

# # Print the model summary
# model.summary()

print("Hello agaibn")