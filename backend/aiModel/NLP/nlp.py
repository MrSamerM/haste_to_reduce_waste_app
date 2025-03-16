import pandas as pd
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics.pairwise import cosine_similarity
import string
import random
import numpy as np
import os
import nltk
import requests
from dotenv import load_dotenv

load_dotenv()

EDAMAM_APP_ID = os.getenv("EDAMAM_APP_ID")
EDAMAM_API_KEY = os.getenv("EDAMAM_API_KEY")
EDAMAM_USER_ID= os.getenv("EDAMAM_USER_ID")

EDAMAM_APP_ID_SECOND = os.getenv("EDAMAM_APP_ID_SECOND")
EDAMAM_API_KEY_SECOND = os.getenv("EDAMAM_API_KEY_SECOND")

headers = {
    "Edamam-Account-User": EDAMAM_USER_ID
}

nltk.download('punkt_tab')
nltk.download('stopwords')

# https://medium.com/@kelsklane/tokenization-with-nltk-52cd7b88c7d 17/02/2025
# https://medium.com/@lurkinguard30/how-to-build-a-simple-chatbot-with-python-and-nltk-c1b9fff5f3 17/02/2025
# https://kantschants.com/paraphrasing-with-transformer-t5-bart-pegasus#heading-2-t5-text-to-text-transfer-transformer 28/02/2025
# https://www.eatingwell.com/article/286048/the-best-way-to-store-fruits-and-veggies/ data from here

# chatGPT to change the way to read the csv file from an external python file
# prompt:import sys sys.path.append("./NLP")from nlp import * would this code be correct based on the image (Screen shot), if my file is in NLP, and the file is called nlp.py 03/03/2025

script_dir = os.path.dirname(os.path.abspath(__file__))
dataset_path = os.path.join(script_dir, "chatbotDataset.csv")
customData = pd.read_csv(dataset_path)

question_tokens=[]
response_tokens=[]
stop_words=set(stopwords.words('english'))
stop_words=[word for word in stop_words if word not in("where","you")]


for question in customData['Questions']:

    question =question.translate(str.maketrans('','',string.punctuation)) #This remove punctuations in the dataset
    word_tokens=word_tokenize(question.lower())  #This makes the corpus lowercase
    filtered_stop_wordQ=[each_word for each_word in word_tokens if each_word not in stop_words]
    question_tokens.append(filtered_stop_wordQ) #append the filtered sentence

customData['Question_Token']=question_tokens

# used chatgpt to make a corpus 
#prompt 1: what does this mean corpus = [movie_reviews.raw(fileid) for fileid in movie_reviews.fileids()]
#prompt 2: but what about for me, I have a csv dataset with questions, label and response. what should I do

customData['Question_Token'] = customData['Question_Token'].apply(lambda tokens: " ".join(tokens))

corpus = [(questions, labels) for questions, labels in zip(customData['Question_Token'], customData['Labels'])]
random.shuffle(corpus)
questions, labels =zip(*corpus)

vectorizer = CountVectorizer()
vectorizer_fit=vectorizer.fit_transform(questions)
clf = LogisticRegression(max_iter=500)
clf.fit(vectorizer_fit, labels)

def process_text(input):
    input =input.translate(str.maketrans('','',string.punctuation))
    word_tokens=word_tokenize(input.lower())
    filtered_stop_word=[each_word for each_word in word_tokens if each_word not in stop_words]
    return " ".join(filtered_stop_word)


list_of_cook_words=['cook','prepare','make','recipe','recipes','dish','meal']

def genResponse(input):
    preprocessed_input = process_text(input)
    input_vector = vectorizer.transform([preprocessed_input])

    # 3 lines below, and two at the end received by chatGPT. where cosin similarity is used to find the index with the similar questions. 03/03/2025
    # Prompt: the response I get depends on the label. But how about if I want accurate results. For example the difference between saying hi and hello is a different response. Both with the same label
  
    question_vectors = vectorizer.transform(customData['Question_Token'])
    similarities = cosine_similarity(input_vector, question_vectors).flatten() #compares input with all questions in dataset. .flatten changes dataset to 1d
    best_match_idx = np.argmax(similarities) #find the index with the highest similarity
    
    confidence_level=max(similarities)

    new_list=[]
         
# received asistance from chatGPT for splitting the input to array, undertstanding response data for second get request
# including hits, and converting to json file

# main prompt 1: (my code) but would it not be a array when pre processed
# main prompt 2: what does this mean (trace back error)
# main prompt 3: this gives me a lot of random labels, but I want the name of recipe

    if any(word in preprocessed_input.split() for word in list_of_cook_words):
        for i in preprocessed_input.split():
            s = requests.get(f"https://api.edamam.com/api/food-database/v2/parser?ingr={i}&app_id={EDAMAM_APP_ID_SECOND}&app_key={EDAMAM_API_KEY_SECOND}")
                
            if s.json().get('parsed'):
                new_list.append(i)

        if len(new_list)==0:
            return "The items are not food products"
        else:
            query_string = ','.join(new_list)
            print(query_string)
            r = requests.get(f'https://api.edamam.com/api/recipes/v2?type=public&q={query_string}&app_id={EDAMAM_APP_ID}&app_key={EDAMAM_API_KEY}',headers=headers)  
            response_data = r.json()

            if 'hits' in response_data and response_data['hits']:
                recipe_name=response_data['hits'][0]['recipe']['label']
                recipe_url=response_data['hits'][0]['recipe']['url']
                recipe_ingredients=response_data['hits'][0]['recipe']['ingredientLines']
                return (f"\nRecipe:{recipe_name}\n Ingredients:{recipe_ingredients}\n URL:{recipe_url}")
            else:
                return "No recipes found."
    
    elif confidence_level<0.85:
        return "I am sorry you have to be more specific"
    
    else:
    
        best_response = customData.iloc[best_match_idx]['Response'] #the response is the row with the best closest index, from response column
        return best_response


while True:
    user_input = input("You: ")
    if user_input.lower() == "exit":
        break
    print("Bot:", genResponse(user_input))
