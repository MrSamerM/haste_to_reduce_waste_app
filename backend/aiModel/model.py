# // For some images in NotContainer I used images from kaggle using data from the dataset from:
# // https://www.kaggle.com/datasets/utkarshsaxenadn/landscape-recognition-image-dataset-12k-images/data Use kaggle for scenary
# // https://www.kaggle.com/datasets/vikashrajluhaniwal/fashion-images Use kaggle for clothes and shoes
# // https://www.kaggle.com/datasets/vencerlanz09/plastic-and-paper-cups-synthetic-image-dataset use kaggle for cups
# // https://www.kaggle.com/datasets/boulahchichenadir/algerian-used-cars use kaggle for vehicles


# https://medium.com/@ilaslanduzgun/image-classification-with-tensorflow-a361c7b1eb05 for assistance
import matplotlib.pyplot as plt
import numpy as np
import os
import PIL # this is pillow
import pathlib # this is to access files

# Ignore the underlines, vscode does not recognise it, but it works
import tensorflow as tf
from tensorflow import keras # this is to create and load dataset
from tensorflow.keras import layers
from tensorflow.keras.models import Sequential

image_dir=pathlib.Path('backend/aiModel/Train')
image_height=226
image_width=226
num_classes=2
batch_size=60

train_dataset=tf.keras.preprocessing.image_dataset_from_directory(
    image_dir,
    validation_split=0.1, #90 percent is training
    subset="training",
    seed=123,
    image_size=(image_height,image_width),
    batch_size=batch_size)

validation_dataset=tf.keras.preprocessing.image_dataset_from_directory(
    image_dir,
    validation_split=0.1, #10 percent is validation
    subset="validation",
    seed=123,
    image_size=(image_height,image_width),
    batch_size=batch_size)

class_names = train_dataset.class_names
plt.figure(figsize=(10, 10))
for images, labels in train_dataset.take(1):
    for i in range(9):
        ax = plt.subplot(3, 3, i + 1)
        plt.imshow(images[i].numpy().astype("uint8"))
        plt.title(class_names[labels[i]])
        plt.axis("off")

# print(train_dataset)
# print("Hello again")
