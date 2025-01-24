# // For some images in NotContainer I used images from kaggle using data from the dataset from:
# // https://www.kaggle.com/datasets/utkarshsaxenadn/landscape-recognition-image-dataset-12k-images/data Use kaggle for scenary
# // https://www.kaggle.com/datasets/vikashrajluhaniwal/fashion-images Use kaggle for clothes and shoes
# // https://www.kaggle.com/datasets/vencerlanz09/plastic-and-paper-cups-synthetic-image-dataset use kaggle for cups
# // https://www.kaggle.com/datasets/boulahchichenadir/algerian-used-cars use kaggle for vehicles


# https://medium.com/@ilaslanduzgun/image-classification-with-tensorflow-a361c7b1eb05 for assistance
# https://medium.com/nerd-for-tech/building-an-image-classifier-with-tensorflow-3e12c1d5d3a2 for assistance as well
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import pathlib  # this is to access files
from tensorflow.keras.models import save_model
from tensorflow.keras.preprocessing import image

# Path to training data
image_dir = pathlib.Path('backend/aiModel/Train')
image_height = 226
image_width = 226
batch_size = 32

# Data augmentation for training only
data_augmentation = keras.Sequential([
    layers.RandomFlip("horizontal",
                      input_shape=(image_height,
                                  image_width,
                                  3)),
    layers.RandomRotation(0.1),
    layers.RandomZoom(0.1),
], name="data_augmentation")




# Data preparation with validation split
train_datagen = keras.preprocessing.image.ImageDataGenerator(
    rescale=1./255
)
train_dataset = train_datagen.flow_from_directory(
    image_dir,
    target_size=(image_height, image_width),
    batch_size=batch_size,
    class_mode='binary',
    seed=123
)

validation_datagen = keras.preprocessing.image.ImageDataGenerator(
    rescale=1./255
)
validation_dataset = validation_datagen.flow_from_directory(
    image_dir,
    target_size=(image_height, image_width),
    batch_size=batch_size,
    class_mode='binary',
    seed=123
)

# Model architecture
# Add the input shape to the first Conv2D layer
model = keras.Sequential([
    layers.InputLayer(input_shape=(image_height, image_width, 3)),  # Explicitly define the input layer
    data_augmentation,
    layers.Conv2D(16, 3, padding='same', activation='relu'),
    layers.MaxPooling2D(),
    layers.Conv2D(32, 3, padding='same', activation='relu'),
    layers.MaxPooling2D(),
    layers.Conv2D(64, 3, padding='same', activation='relu'),
    layers.MaxPooling2D(),
    layers.Dropout(0.2),
    layers.Flatten(),
    layers.Dense(128, activation='relu'),
    layers.Dense(1, activation='sigmoid')
])


# Compile the model
model.compile(
    optimizer='adam',
    loss='binary_crossentropy',
    metrics=['accuracy']
)

model.summary()

# Train the model
epochs = 25
history = model.fit(
    train_dataset,
    steps_per_epoch=100,
    epochs=epochs,
    validation_data=validation_dataset,
    validation_steps=50
)

# Load and preprocess the image for prediction
img_path = 'backend/aiModel/Images/image.png'
img = image.load_img(img_path, target_size=(image_height, image_width))
x = image.img_to_array(img)
x = np.expand_dims(x, axis=0)
x /= 255

# Make the prediction
prediction = model.predict(x)
threshold = 0.5  # Adjustable threshold
if prediction < threshold:
    print("The image is a Container.")
else:
    print("The image is Not a container.")

# Save the model in Keras format
model.save('container_model.keras')





