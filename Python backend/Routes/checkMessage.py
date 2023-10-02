from flask import request, jsonify, Blueprint
import g4f

def generateMessageKeyword(message):
    prompt = "Please identify the three main terms or keywords, divided by comma, in the following sentence or paragraph: " + message
    keywordResponse = g4f.ChatCompletion.create(
        model=g4f.models.gpt_35_turbo_16k,
        messages=[{"role": "user", "content": prompt}],
        )
    while keywordResponse == "":
        keywordResponse = g4f.ChatCompletion.create(
        model=g4f.models.gpt_4,
        messages=[{"role": "user", "content": prompt}],
    )
    return keywordResponse

def checkKeyword(keywordResponse):
    from run import WORDLISTS
    keywordLists = keywordResponse.split(', ')
    print (keywordLists)
    for keyword in keywordLists:
        print (keyword)
        if keyword.lower() in (data.lower() for data in WORDLISTS):
            return True
    return False