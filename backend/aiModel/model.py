# // For some images in NotContainer I used images from kaggle using data from the dataset from:
# // https://www.kaggle.com/datasets/utkarshsaxenadn/landscape-recognition-image-dataset-12k-images/data Use kaggle for scenary
# // https://www.kaggle.com/datasets/vikashrajluhaniwal/fashion-images Use kaggle for clothes and shoes
# // https://www.kaggle.com/datasets/vencerlanz09/plastic-and-paper-cups-synthetic-image-dataset use kaggle for cups
# // https://www.kaggle.com/datasets/boulahchichenadir/algerian-used-cars use kaggle for vehicles


# https://medium.com/@ilaslanduzgun/image-classification-with-tensorflow-a361c7b1eb05 for assistance
# https://medium.com/nerd-for-tech/building-an-image-classifier-with-tensorflow-3e12c1d5d3a2 for assistance as well
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
batch_size=31

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

num_classes=len(class_names)

# https://www.tensorflow.org/api_docs/python/tf/keras/layers/ explanation from tensorflow

#this is to edit / change the dataset even further by making changes so thaty new images are made and patterns are found

data_change=keras.Sequential(
    [
        layers.RandomFlip("horizontal",input_shape=(image_height, image_width, 3)),
        layers.RandomRotation(0.1),
        layers.RandomZoom(0.1),
        layers.RandomContrast(0.3)    
        ]
)

model=Sequential([ #This groups layers sequentially
    data_change,
    layers.Rescaling(1./255),#this rescales the images
    layers.Conv2D(16, 3, padding='same', activation='relu'),#Conv2D is used for images,16 is number of filter (dimention of output space), 3 is the size of the kernal (specifying size of convolution window) padding same (resulting in even padding all sides of image).relu helps network find complex patterns
    layers.MaxPooling2D(),#Downsamples the inputs height and width
    layers.Conv2D(32, 3, padding='same', activation='relu'),
    layers.MaxPooling2D(),
    layers.Conv2D(64, 3, padding='same', activation='relu'),
    layers.MaxPooling2D(),
    layers.Dropout(0.2),
    layers.Flatten(),#flatterns the inputs, does not affect batch size
    layers.Dense(128, activation='relu'),
    layers.Dense(num_classes, name="outputs") #this is the 2 classes to predict
])
model.compile(optimizer='adam',
              loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),
              metrics=['accuracy'])

model.summary()

epochs=10

history=model.fit( #this method is used to train the model
    train_dataset,
    validation_data=validation_dataset, #this evaluates loss after iteration
    epochs=epochs #iteration over data (image) provided
)

# model.save('model.h5')

imageTest_dir=pathlib.Path('backend/aiModel/Images')


for image_file in imageTest_dir.iterdir():
    if image_file.suffix.lower() in ['.png', '.jpg', '.jpeg']:  # Filter for image files
        images = tf.keras.utils.load_img(image_file, target_size=(image_height, image_width))
        img_array = tf.keras.utils.img_to_array(images)
        img_array = tf.expand_dims(img_array, 0)  # Create a batch
        
        # Make prediction
        predictions = model.predict(img_array)
        score = tf.nn.softmax(predictions[0])

        print("This image most likely belongs to {} with a {:.2f} percent confidence."
              .format(class_names[np.argmax(score)], 100 * np.max(score)))

