from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from tensorflow.keras.preprocessing import image
import numpy as np
from tensorflow.keras.models import load_model

app = Flask(__name__)

# https://medium.com/@pooranjoyb/integration-deployment-of-ml-model-with-react-flask-3033dd6034b3 24/01/2025

CORS(app, resources={r"/*": {"origins": "http://localhost:3000", "supports_credentials": True}})

# @app.route("/")
# def home():
#     return {"message": "Hello from backend"}

@app.route("/upload", methods=['POST'])
def upload():
    file = request.files['file']
    file.save('uploads/' + file.filename)

    # Load image
    img_path = f"./uploads/{file.filename}"
    img = image.load_img(img_path, target_size=(226, 226))
    x = image.img_to_array(img)
    x = np.expand_dims(x, axis=0)
    x /= 255

    loaded_model = load_model('container_model.keras')

    # For percentage go from ChatGPT: Prompt: (Image of my code) I want to also send the percentage. How can I do this 24/01/2025
    prediction = loaded_model.predict(x)[0][0]  

    if os.path.exists(f"./uploads/{file.filename}"):
        os.remove(f"uploads/{file.filename}")

    # For percentage go from ChatGPT: Prompt: (Image of my code) I want to also send the percentage. How can I do this 24/01/2025
    percentage = float(prediction * 100)  # Convert prediction to percentage

    # Determine the label
    if prediction < 0.5:
        return jsonify({"message": "a Container", "confidence": round(100 - percentage, 2)})
    else:
        return jsonify({"message": "Not a Container", "confidence": round(percentage, 2)})


if __name__ == '__main__':
    app.run(debug=True)
