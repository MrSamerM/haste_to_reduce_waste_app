# Used chatgpt to integrate the model with the backend and frontend 16/01/2025 
# prompt -1
# prompt -2

from flask import Flask, request, jsonify
import tensorflow as tf
from PIL import Image
import numpy as np


app = Flask(__name__)

model=tf.keras.model.load_model('model.h5') #loads model

#this function deal with the image so its suitable to be put in he model
def process_image(file):
    image_height, image_width = 226, 226

    image=Image.open(file)
    image=image.resize((image_height, image_width))
    image=np.array(image)/255.0 #turns pixels into 0/1
    image=np.expand_dims(image, axis=0) #add batch dimension.

    return image


@app.route('/predict', methods=['POST'])
def predict():
    file = request.files['image']
    image = model.preprocess_image(file)
    prediction = model.predict(image)
    return jsonify(prediction)

if __name__ == '__main__':
    app.run(port=5000, debug=True)