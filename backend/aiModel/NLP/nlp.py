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

def genResponse(input):
    preprocessed_input = process_text(input)
    input_vector = vectorizer.transform([preprocessed_input])

    # 5 lines below received by chatGPT. where cosin similarity is used to find the index with the similar questions. 03/03/2025
    # Prompt: the response I get depends on the label. But how about if I want accurate results. For example the difference between saying hi and hello is a different response. Both with the same label
  
    question_vectors = vectorizer.transform(customData['Question_Token'])
    similarities = cosine_similarity(input_vector, question_vectors).flatten() #compares input with all questions in dataset. .flatten changes dataset to 1d
    best_match_idx = np.argmax(similarities) #find the index with the highest similarity
    best_response = customData.iloc[best_match_idx]['Response'] #the response is the row with the best closest index, from response column
    return best_response

    
while True:
    user_input = input("You: ")
    if user_input.lower() == "exit":
        break
    print("Bot:", genResponse(user_input))
