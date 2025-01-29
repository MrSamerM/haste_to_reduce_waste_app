import easyocr

reader=easyocr.Reader(['en']) #specifies lanuage
result=reader.readtext('image6.jpg')

for(bbox,text,prob) in result:
    print(f'Text: {text}, Probability: {prob}')