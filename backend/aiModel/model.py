# For some images in NotContainer I used images from kaggle using data from the dataset below:

#1. Saxena, U. (2023) Landscape Recognition | Image Dataset | 12k Images. Available at:
# https://www.kaggle.com/datasets/utkarshsaxenadn/landscape-recognition-image-dataset-12k-images/data (Accessed: 7 January 2025)

#2. Luhaniwal, V. (2021) E-commerce Product Images. Available at:
# https://www.kaggle.com/datasets/vikashrajluhaniwal/fashion-images (Accessed: 7 January 2025)

#3. Nadir, B. (2022) cars classification dataset. Available at:
# https://www.kaggle.com/datasets/boulahchichenadir/algerian-used-cars (Accessed: 7 January 2025)

# Assitance with image detection

#1. İlaslan, D. (2023) Image Classification with TensorFlow. Available at:
# https://medium.com/@ilaslanduzgun/image-classification-with-tensorflow-a361c7b1eb05 (Accessed: 10 January 2025) 

#2. Wijetunga, C. (2021) Building an image classifier with TensorFlow. Available at:
# https://medium.com/nerd-for-tech/building-an-image-classifier-with-tensorflow-3e12c1d5d3a2 (Accessed: 10 January 2025)

#3. Bhattacharya, P. (2023) Integration & Deployment of ML model with React & Flask. Available at:
# https://medium.com/@pooranjoyb/integration-deployment-of-ml-model-with-react-flask-3033dd6034b3 (Accessed: 24 January 2025)

#4. Tensorflow. (n.d) Module: tf.keras.layers. Available at: 
# https://www.tensorflow.org/api_docs/python/tf/keras/layers/ (Accessed: 24 January 2025)

#5. Tensorflow. (n.d-b) tf.keras.layers.Conv2D . Available at: 
# https://www.tensorflow.org/api_docs/python/tf/keras/layers/Conv2D (Accessed: 24 January 2025)

#6 Tensorflow. (n.d-c) tf.keras.layers.MaxPool2D  . Available at: 
# https://www.tensorflow.org/api_docs/python/tf/keras/layers/MaxPool2D (Accessed: 24 January 2025)

#7 Tensorflow. (n.d-c) tf.keras.layers.Flatten  . Available at: 
# https://www.tensorflow.org/api_docs/python/tf/keras/layers/Flatten (Accessed: 24 January 2025)

#8 Tensorflow. (n.d-c) tf.keras.layers.Dense. Available at: 
# https://www.tensorflow.org/api_docs/python/tf/keras/layers/Dense (Accessed: 24 January 2025)


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
    layers.RandomFlip("horizontal",input_shape=(image_height,image_width,3)),
    layers.RandomRotation(0.1),
    layers.RandomContrast(0.2),
], name="data_augmentation")


train_datagen = keras.preprocessing.image.ImageDataGenerator(
    rescale=1./255,
    validation_split=0.2
)
train_dataset = train_datagen.flow_from_directory(
    image_dir,
    target_size=(image_height, image_width),
    batch_size=batch_size,
    class_mode='binary',
    seed=123
)

validation_dataset = train_datagen.flow_from_directory(
    image_dir,
    target_size=(image_height, image_width),
    batch_size=batch_size,
    class_mode='binary',
    seed=123
)


    # OpenAI. (2025). ChatGPT (24 January Version) [Large Language Model]. Available at: https://chatgpt.com/ (Accessed: 24 January 2025).
    #used for layers.InputLayer() method for expectations of this data.

model = keras.Sequential([ #This groups layers sequentially
    
    layers.InputLayer(input_shape=(image_height, image_width, 3)),
    data_augmentation,
    layers.Conv2D(16, 3, padding='same', activation='relu'),#Conv2D is used for images,16 is number of filter (dimention of output space), 3 is the size of the kernal (specifying size of convolution window) padding same (resulting in even padding all sides of image).relu helps network find complex patterns
    layers.MaxPooling2D(),#Downsamples the inputs height and width
    layers.Conv2D(32, 3, padding='same', activation='relu'),
    layers.MaxPooling2D(),
    layers.Conv2D(64, 3, padding='same', activation='relu'),
    layers.MaxPooling2D(),
    layers.Flatten(),#flatterns the inputs, does not affect batch size
    layers.Dense(128, activation='relu'),
    layers.Dense(1, activation='sigmoid')#this is the classes to predict
])

# Compile the model
model.compile(
    optimizer='adam',
    loss='binary_crossentropy',
    metrics=['accuracy']
)

model.summary()

# Train the model
epochs = 10
history = model.fit(#this method is used to train the model
    train_dataset,
    steps_per_epoch=100,
    epochs=epochs,#iteration over data (image) provided
    validation_data=validation_dataset,#this evaluates loss after iteration
    validation_steps=50
)

# Load and preprocess the image for prediction
img_path = 'backend/aiModel/TestingImages/NotContainer1.jpg'
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


img_path2 = 'backend/aiModel/TestingImages/NotContainer2.jpg'
img2 = image.load_img(img_path2, target_size=(image_height, image_width))
y = image.img_to_array(img2)
y = np.expand_dims(y, axis=0)
y /= 255

# Make the prediction
prediction = model.predict(y)
threshold = 0.5  # Adjustable threshold
if prediction < threshold:
    print("The image is a Container.")
else:
    print("The image is Not a container.")


# Load and preprocess the image for prediction
# img_path3 = 'backend/aiModel/Images/notContainer3.png'
# img3 = image.load_img(img_path3, target_size=(image_height, image_width))
# a = image.img_to_array(img3)
# a = np.expand_dims(a, axis=0)
# a /= 255

# # Make the prediction
# prediction = model.predict(a)
# threshold = 0.5  # Adjustable threshold
# if prediction < threshold:
#     print("The image is a Container.")
# else:
#     print("The image is Not a container.")


img_path4 = 'backend/aiModel/TestingImages/SuitableContainer1.jpg'
img4 = image.load_img(img_path4, target_size=(image_height, image_width))
b = image.img_to_array(img4)
b = np.expand_dims(b, axis=0)
b /= 255

# Make the prediction
prediction = model.predict(b)
threshold = 0.5  # Adjustable threshold
if prediction < threshold:
    print("The image is a Container.")
else:
    print("The image is Not a container.")

img_path5 = 'backend/aiModel/TestingImages/SuitableContainer2.jpg'
img5 = image.load_img(img_path5, target_size=(image_height, image_width))
c = image.img_to_array(img5)
c = np.expand_dims(c, axis=0)
c /= 255

# Make the prediction
prediction = model.predict(c)
threshold = 0.5  # Adjustable threshold
if prediction < threshold:
    print("The image is a Container.")
else:
    print("The image is Not a container.")


img_path6 = 'backend/aiModel/TestingImages/SuitableContainer3.jpg'
img6 = image.load_img(img_path6, target_size=(image_height, image_width))
d = image.img_to_array(img6)
d = np.expand_dims(d, axis=0)
d /= 255

# Make the prediction
prediction = model.predict(d)
threshold = 0.5  # Adjustable threshold
if prediction < threshold:
    print("The image is a Container.")
else:
    print("The image is Not a container.")

img_path7 = 'backend/aiModel/TestingImages/SuitableContainer4.jpg'
img7 = image.load_img(img_path7, target_size=(image_height, image_width))
e = image.img_to_array(img7)
e = np.expand_dims(e, axis=0)
e /= 255

# Make the prediction
prediction = model.predict(e)
threshold = 0.5  # Adjustable threshold
if prediction < threshold:
    print("The image is a Container.")
else:
    print("The image is Not a container.")

# Save the model in Keras format
model.save('container_model.keras')





