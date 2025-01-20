# Used chatgpt to integrate the model with the backend and frontend 16/01/2025 
# main Prompt  is this correct (image of my code)

from flask import Flask, request, jsonify
import tensorflow as tf
from PIL import Image
import numpy as np



app = Flask(__name__)

model=tf.keras.models.load_model('model.keras') #loads model

#this function deal with the image so its suitable to be put in he model
def process_image(file):
    image_height, image_width = 226, 226

    image=Image.open(file)
    if image.mode != "RGB":
        image = image.convert("RGB")
    image=image.resize((image_height, image_width))
    image=np.array(image)/255.0 #turns pixels into 0/1
    image=np.expand_dims(image, axis=0) #add batch dimension.

    return image


@app.route('/predict', methods=['POST'])
def predict():
    file = request.files['image']
    image = process_image(file)
    prediction = model.predict(image)
    prediction_list = prediction.tolist()
    return jsonify({'prediction': prediction_list})

if __name__ == '__main__':
    app.run(port=5000, debug=True)