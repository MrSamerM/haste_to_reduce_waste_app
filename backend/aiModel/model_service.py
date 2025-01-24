from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from tensorflow.keras.preprocessing import image  # <-- Add this import
import numpy as np
from tensorflow.keras.models import load_model

app = Flask(__name__)

# https://medium.com/@pooranjoyb/integration-deployment-of-ml-model-with-react-flask-3033dd6034b3 24/01/2025

CORS(app, resources={r"/*": {"origins": "http://localhost:3000", "supports_credentials": True}})

@app.route("/")
def home():
    return {"message": "Hello from backend"}

@app.route("/upload", methods=['POST'])
def upload():
    file = request.files['file']
    file.save('uploads/' + file.filename)

    # Load the image to predict
    img_path = f"./uploads/{file.filename}"
    img = image.load_img(img_path, target_size=(226, 226))
    x = image.img_to_array(img)
    x = np.expand_dims(x, axis=0)
    x /= 255

    loaded_model = load_model('container_model.keras')

    # Make the prediction
    prediction = loaded_model.predict(x)
    if os.path.exists(f"./uploads/{file.filename}"):
        os.remove(f"uploads/{file.filename}")
    
    if prediction < 0.5:
        return jsonify({"message": "Container"})
    else:
        return jsonify({"message": "NotContainer"})

if __name__ == '__main__':
    app.run(debug=True)
