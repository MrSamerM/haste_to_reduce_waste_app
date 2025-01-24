import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import pathlib # this is to access files
from tensorflow.keras.models import save_model




image_dir=pathlib.Path('backend/aiModel/Train')


# Define the model architecture
model = keras.Sequential([
    layers.Conv2D(32, (3, 3), activation='relu', input_shape=(150, 150, 3)),
    layers.MaxPooling2D((2, 2)),
    layers.Conv2D(64, (3, 3), activation='relu'),
    layers.MaxPooling2D((2, 2)),
    layers.Conv2D(128, (3, 3), activation='relu'),
    layers.MaxPooling2D((2, 2)),
    layers.Conv2D(128, (3, 3), activation='relu'),
    layers.MaxPooling2D((2, 2)),
    layers.Flatten(),
    layers.Dense(512, activation='relu'),
    layers.Dense(1, activation='sigmoid')
])

# Compile the model
model.compile(optimizer='rmsprop',
              loss='binary_crossentropy',
              metrics=['accuracy'])

# Data preprocessing
train_datagen = keras.preprocessing.image.ImageDataGenerator(rescale=1./255)
train_generator = train_datagen.flow_from_directory(
        image_dir,
        target_size=(150, 150),
        batch_size=20,
        class_mode='binary')

# Data Validation
validation_datagen = keras.preprocessing.image.ImageDataGenerator(rescale=1./255)
validation_generator = validation_datagen.flow_from_directory(
        image_dir,
        target_size=(150, 150),
        batch_size=20,
        class_mode='binary')

# Train the model
history = model.fit(
      train_generator,
      steps_per_epoch=100,
      epochs=10,
      validation_data=validation_generator,
      validation_steps=50)

import numpy as np
from tensorflow.keras.preprocessing import image

# Load the image to predict
img_path = 'backend/aiModel/Images/image.png'
img = image.load_img(img_path, target_size=(150, 150))
x = image.img_to_array(img)
x = np.expand_dims(x, axis=0)
x /= 255

# Make the prediction
prediction = model.predict(x)
if prediction < 0.5:
    print("The image is a Container.")
else:
    print("The image is Not a container.")

# Save the model

# Save the model in .keras format
save_model(model, 'container.keras')
