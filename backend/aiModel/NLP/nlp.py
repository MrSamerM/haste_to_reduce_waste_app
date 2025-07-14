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

# Where I understood how chatbots functioned

#1. Lane, K. (2021) Tokenization with NLTK. Available at:
# https://medium.com/@kelsklane/tokenization-with-nltk-52cd7b88c7d (Accessed: 17 February 2025)

#2. Excell. (2023) How to build a Simple Chatbot with Python and NLTK. Available at:
# https://medium.com/@lurkinguard30/how-to-build-a-simple-chatbot-with-python-and-nltk-c1b9fff5f3 (Accessed: 17 February 2025) 


# Where dataset data was found:

#1 Meyer, H. (2022) The Best Way to Store Fruits and Veggies. Available at:
# https://www.eatingwell.com/article/286048/the-best-way-to-store-fruits-and-veggies/ (Accessed: 10 March 2025)

#2 Lang, A. (2021) Does Rice Go Bad? Shelf Life, Expiration Dates, and More. Available at:
# https://www.healthline.com/nutrition/does-rice-go-bad (Accessed: 10 March 2025)

#3 Flavour Network. (2024) Foods You Can Still Eat After the Expiry Date. Available at:
# https://www.flavournetwork.ca/article/10-foods-you-can-eat-after-the-expiry-date/ (Accessed: 10 March 2025)

#4 FoodSafety.gov. (2023) Cold Food Storage Chart. Available at:
# https://www.foodsafety.gov/food-safety-charts/cold-food-storage-charts (Accessed: 10 March 2025)

#5 Shippee, A. (2023) How can I freeze my bread? (And defrost it, too!). Available at:
# https://www.kingarthurbaking.com/blog/2023/12/20/freeze-bread (Accessed: 10 March 2025)

#6 Shippee, A. (2023) How Long Do Dried Lentils Last? Essential Storage Tips. Available at:
# https://thewonderfulworldofsprouts.com/how-long-do-dried-lentils-last/ (Accessed: 10 March 2025)



# chatGPT to change the way to read the csv file from an external python file
# OpenAI. (2025). ChatGPT (3 March Version) [Large Language Model]. Available at: https://chatgpt.com/ (Accessed: 3 March 2025).
# prompt:import sys sys.path.append("./NLP")from nlp import * would this code be correct based on the image (Screen shot), if my file is in NLP, and the file is called nlp.py

script_dir = os.path.dirname(os.path.abspath(__file__))
dataset_path = os.path.join(script_dir, "chatbotDataset.csv")
customData = pd.read_csv(dataset_path)

question_tokens=[]
response_tokens=[]
stop_words=set(stopwords.words('english'))

for question in customData['Questions']:

    question =question.translate(str.maketrans('','',string.punctuation)) #This remove punctuations in the dataset
    word_tokens=word_tokenize(question.lower())  #This makes the corpus lowercase
    filtered_stop_wordQ=[each_word for each_word in word_tokens if each_word not in stop_words]
    question_tokens.append(filtered_stop_wordQ) #append the filtered sentence

customData['Question_Token']=question_tokens

#Used chatGPT to make a corpus from a csv file
#OpenAI. (2025). ChatGPT (7 March Version) [Large Language Model].Available at: https://chatgpt.com/ (Accessed: 7 March 2025).
#prompt 1: what does this mean corpus = [movie_reviews.raw(fileid) for fileid in movie_reviews.fileids()]
#prompt 2: but what about for me, I have a csv dataset with questions, label and response. what should I do

customData['Question_Token'] = customData['Question_Token'].apply(lambda tokens: " ".join(tokens))

corpus = [(questions, labels) for questions, labels in zip(customData['Question_Token'], customData['Labels'])]
random.shuffle(corpus)
questions, labels =zip(*corpus)

vectorizer = CountVectorizer()
vectorizer_fit=vectorizer.fit_transform(questions)

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
    #/* OpenAI. (2025). ChatGPT (3 March Version) [Large Language Model]. Available at: https://chatgpt.com/ (Accessed: 3 March 2025).
    # Prompt: the response I get depends on the label. But how about if I want accurate results. For example the difference between saying hi and hello is a different response. Both with the same label
    question_vectors = vectorizer.transform(customData['Question_Token'])
    similarities = cosine_similarity(input_vector, question_vectors).flatten() #compares input with all questions in dataset. .flatten changes dataset to 1d
    best_match_idx = np.argmax(similarities) #find the index with the highest similarity
    confidence_level=max(similarities)
    new_list=[]
         
# received asistance from chatGPT for splitting the input to array, undertstanding response data for second get request including hits, and converting to json file
# OpenAI. (2025). ChatGPT (15 March Version) [Large Language Model]. Available at: https://chatgpt.com/ (Accessed: 15 March 2025).
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
                return (f"\nRecipe: {recipe_name}\n Ingredients: {recipe_ingredients}\n URL: {recipe_url}")
            else:
                return "No recipes found."
    
    elif confidence_level<0.5:
        return "I am sorry you have to be more specific"
    else:
        best_response = customData.iloc[best_match_idx]['Response'] #the response is the row with the best closest index, from response column
        return best_response


# while True:
#     user_input = input("You: ")
#     if user_input.lower() == "exit":
#         break
#     print("Bot:", genResponse(user_input))
