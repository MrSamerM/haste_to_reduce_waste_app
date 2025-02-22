import pandas as pd
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import CountVectorizer
import string
import nltk
nltk.download('punkt_tab')
nltk.download('stopwords')

# https://medium.com/@kelsklane/tokenization-with-nltk-52cd7b88c7d 17/02/2025
# https://medium.com/@lurkinguard30/how-to-build-a-simple-chatbot-with-python-and-nltk-c1b9fff5f3 17/02/2025

customData=pd.read_csv("chatbotDataset.csv")

customData=customData.head()

question_tokens=[]
stop_words=set(stopwords.words('english'))

for question in customData['Questions']:

    question =question.translate(str.maketrans('','',string.punctuation)) #This remove punctuations in the dataset
    word_tokens=word_tokenize(question.lower())  #This makes the corpus lowercase
    filtered_stop_word=[each_word for each_word in word_tokens if each_word not in stop_words]  #for each word in the token,keep those not in stop_words
    question_tokens.append(filtered_stop_word) #append the filtered sentence

customData['Question_Token']=question_tokens #adds another column into the dataset

#Transform, paraphrase each sentence 10 times for accurate result, questions and answers. Do it before tokenization
#Do not overwrite the old dataset, instead, make a new one, after testing it
#Vectorize to count the most important or used word, in each sentence
#Bag of words
#Use ML to train
#fine tune- optional
#Make the bot, only for python to test
#After testing integrate with react js

print(customData.head())

vectorizer=CountVectorizer()



