import pandas as pd
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import CountVectorizer
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import string
import nltk
nltk.download('punkt_tab')
nltk.download('stopwords')

# https://medium.com/@kelsklane/tokenization-with-nltk-52cd7b88c7d 17/02/2025
# https://medium.com/@lurkinguard30/how-to-build-a-simple-chatbot-with-python-and-nltk-c1b9fff5f3 17/02/2025
# https://kantschants.com/paraphrasing-with-transformer-t5-bart-pegasus#heading-2-t5-text-to-text-transfer-transformer 28/02/2025

# chatGPT to formulate the for loop to itterate throgh all of the header and appending to the csv
# prompt:I want it to append a new row with paraphased question, and response, and the label should be the label is parpahsed from. The thing is this code only paraphaes question, and does not append what can I do 02/03/2025

customData=pd.read_csv("chatbotDataset.csv")

customData=customData.head(14)

question_tokens=[]
response_tokens=[]
stop_words=set(stopwords.words('english'))

tokenizer = AutoTokenizer.from_pretrained("Vamsi/T5_Paraphrase_Paws")
model = AutoModelForSeq2SeqLM.from_pretrained("Vamsi/T5_Paraphrase_Paws")

paraphrased_data = pd.DataFrame(columns=['Questions', 'Labels', 'Response'])

for index, row in customData.iterrows():
    question = row['Questions']
    label = row['Labels']
    response = row['Response']


    # for questions
    input_ids=tokenizer.encode(question, return_tensors='pt') 
    paraphrase_ids=model.generate(input_ids, num_beams=5, max_length=100, early_stopping=True)
    paraphrased_question=tokenizer.decode(paraphrase_ids[0], skip_special_tokens=True)

    # for responses 
    input_ids_r = tokenizer.encode(response, return_tensors='pt')
    paraphrase_ids_r = model.generate(input_ids_r, num_beams=5, max_length=100, early_stopping=True)
    paraphrased_response = tokenizer.decode(paraphrase_ids_r[0], skip_special_tokens=True)


    new_row = pd.DataFrame({'Questions': [paraphrased_question], 'Labels':[label],'Response': [paraphrased_response]})
    paraphrased_data = pd.concat([paraphrased_data, new_row], ignore_index=True)


paraphrased_data.to_csv("chatbotDataset.csv", mode='a', header=False,index=False, quoting=1)

print(customData.head(28))


for question in customData['Questions']:

    question =question.translate(str.maketrans('','',string.punctuation)) #This remove punctuations in the dataset
    word_tokens=word_tokenize(question.lower())  #This makes the corpus lowercase
    filtered_stop_word=[each_word for each_word in word_tokens if each_word not in stop_words]  #for each word in the token,keep those not in stop_words
    question_tokens.append(filtered_stop_word) #append the filtered sentence

customData['Question_Token']=question_tokens #adds another column into the dataset

for question in customData['Response']:

    question =question.translate(str.maketrans('','',string.punctuation)) #This remove punctuations in the dataset
    word_tokens=word_tokenize(question.lower())  #This makes the corpus lowercase
    filtered_stop_word=[each_word for each_word in word_tokens if each_word not in stop_words]  #for each word in the token,keep those not in stop_words
    response_tokens.append(filtered_stop_word) #append the filtered sentence

customData['Response_Token']=question_tokens #adds another column into the dataset

#Vectorize to count the most important or used word, in each sentence
#Bag of words
#Use ML to train
#fine tune- optional
#Make the bot, only for python to test
#After testing integrate with react js

print(customData.head())
vectorizer=CountVectorizer()



