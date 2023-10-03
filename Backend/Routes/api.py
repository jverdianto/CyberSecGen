from flask import request, jsonify, Blueprint
from Backend.Routes.checkMessage import generateMessageKeyword, checkKeyword
import g4f

first_blueprint = Blueprint('first_blueprint', __name__, url_prefix="/api")
@first_blueprint.route('/data', methods=['POST'])
def getMessage():
    if request.json:
        chatRequest = request.get_json()['message']
        chatKeyword = generateMessageKeyword(chatRequest)
        isValidKeyword = checkKeyword(chatKeyword)
        if isValidKeyword == True:
            chatResponse = generateMessage(chatRequest)
            data = {
            'message': chatResponse,
            'keyword': chatKeyword,
            }
        else:
            data = {
            'message': "Your question is not related to Cyber Security",
            'keyword': chatKeyword,
            }
        return jsonify(data)
    else:
        return jsonify({'message': 'No JSON data found in the request'})

def generateMessage(chatRequest):
    chatResponse = g4f.ChatCompletion.create(
        model=g4f.models.gpt_35_turbo_16k,
        messages=[{"role": "user", "content": chatRequest}],
    )
    while chatResponse == "":
        chatResponse = g4f.ChatCompletion.create(
        model=g4f.models.gpt_35_turbo_16k,
        messages=[{"role": "user", "content": chatRequest}],
    )
    return chatResponse