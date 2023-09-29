from flask import request, jsonify, Blueprint
import g4f


async def generateMessageKeyword(message):
    prompt = "Please identify the three main terms or keywords, divided by comma, in the following sentence or paragraph: " + message
    keywordResponse = await g4f.ChatCompletion.create_async(
        model=g4f.models.gpt_4,
        messages=[{"role": "user", "content": prompt}],
        )
    while keywordResponse == "":
        keywordResponse = await g4f.ChatCompletion.create_async(
        model=g4f.models.gpt_4,
        messages=[{"role": "user", "content": prompt}],
    )
    return keywordResponse

def checkKeyword(keyword):
    print (keyword.split(','))