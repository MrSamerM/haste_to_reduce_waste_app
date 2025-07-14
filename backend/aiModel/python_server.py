from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from tensorflow.keras.preprocessing import image
import numpy as np
from tensorflow.keras.models import load_model
import easyocr
import cv2
from NLP.nlp import genResponse

app = Flask(__name__)


CORS(app, resources={r"/*": {"origins": "http://localhost:3000", "supports_credentials": True}})

# @app.route("/")
# def home():
#     return {"message": "Hello from backend"}

# Fix this


@app.route("/response", methods=['POST'])
def response():


# received asistance from chatGPT to get the input  to python for the chatbot
# OpenAI. (2025). ChatGPT (10 March Version) [Large Language Model]. Available at: https://chatgpt.com/ (Accessed: 10 March 2025).
# prompt 1: (frontend function) this is the frontend, but how do I get the input from python (python function)

    data = request.get_json()
    user_input = data.get("input", "")


    response_to_question=genResponse(user_input)
    return jsonify({"response":response_to_question})

# Recieved assistance on how to use easyOCR
# Mahajan, A. (2023) EasyOCR: A Comprehensive Guide. Available at:
# https://medium.com/@adityamahajan.work/easyocr-a-comprehensive-guide-5ff1cb850168 (Accessed: 29 Janaury 2025) 

# ChatGPT helped to handle the image using cv2.
# OpenAI. (2025). ChatGPT (29 January Version) [Large Language Model]. Available at: https://chatgpt.com/ (Accessed: 29 January 2025).
# prompt 1: why is this wrong (the route for text)

@app.route("/text", methods=['POST'])
def text():

    file = request.files['file']
    file.save('texts/' + file.filename)

    img_path = f"./texts/{file.filename}"

    img = cv2.imread(img_path)

    reader=easyocr.Reader(['en']) #specifies lanuage
    result=reader.readtext(img)

    if os.path.exists(f"./texts/{file.filename}"):
        os.remove(f"texts/{file.filename}")


    string=[]

    for(bbox,text,prob) in result:
        print(f'Text: {text}, Probability: {prob}')
        string.append(text)

    return jsonify({"text":string})

# Bhattacharya, P. (2023) Integration & Deployment of ML model with React & Flask. Available at:
# https://medium.com/@pooranjoyb/integration-deployment-of-ml-model-with-react-flask-3033dd6034b3 (Accessed: 24 Janaury 2025) 

@app.route("/upload", methods=['POST'])
def upload():
    file = request.files['file']
    file.save('uploads/' + file.filename)
    img_path = f"./uploads/{file.filename}"
    img = image.load_img(img_path, target_size=(226, 226))
    x = image.img_to_array(img)
    x = np.expand_dims(x, axis=0)
    x /= 255

    loaded_model = load_model('container_model.keras')

    # To get percentage from ChatGPT:
    # OpenAI. (2025). ChatGPT (24 January Version) [Large Language Model]. Available at: https://chatgpt.com/ (Accessed: 24 January 2025).
    # Prompt: (Image of my code) I want to also send the percentage. How can I do this 24/01/2025
    
    prediction = loaded_model.predict(x)[0][0]  

    if os.path.exists(f"./uploads/{file.filename}"):
        os.remove(f"uploads/{file.filename}")

    percentage = float(prediction * 100)  # Convert prediction to percentage

    # Determine the label
    if prediction < 0.5:
        return jsonify({"message": "a Container", "confidence": round(100 - percentage, 2)})
    else:
        return jsonify({"message": "Not a Container", "confidence": round(percentage, 2)})


if __name__ == '__main__':
    app.run(debug=True)
