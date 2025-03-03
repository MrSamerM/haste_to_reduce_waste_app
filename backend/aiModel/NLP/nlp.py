import pandas as pd
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics.pairwise import cosine_similarity
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from parrot import Parrot
import torch
import string
import random
import numpy as np
import nltk
nltk.download('punkt_tab')
nltk.download('stopwords')

# https://medium.com/@kelsklane/tokenization-with-nltk-52cd7b88c7d 17/02/2025
# https://medium.com/@lurkinguard30/how-to-build-a-simple-chatbot-with-python-and-nltk-c1b9fff5f3 17/02/2025
# https://kantschants.com/paraphrasing-with-transformer-t5-bart-pegasus#heading-2-t5-text-to-text-transfer-transformer 28/02/2025
# https://www.eatingwell.com/article/286048/the-best-way-to-store-fruits-and-veggies/ data from here

# chatGPT to formulate the for loop to itterate throgh all of the header and appending to the csv
# prompt:I want it to append a new row with paraphased question, and response, and the label should be the label is parpahsed from. The thing is this code only paraphaes question, and does not append what can I do 02/03/2025

customData=pd.read_csv("chatbotDataset.csv")

question_tokens=[]
response_tokens=[]
stop_words=set(stopwords.words('english'))

for question in customData['Questions']:

    question =question.translate(str.maketrans('','',string.punctuation)) #This remove punctuations in the dataset
    word_tokens=word_tokenize(question.lower())  #This makes the corpus lowercase
    question_tokens.append(word_tokens) #append the filtered sentence

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
    return " ".join(word_tokens)

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
