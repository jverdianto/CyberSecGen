from flask import request, jsonify, Blueprint
from Backend.Routes.checkMessage import generateMessageKeyword, checkKeyword, verifyMessage
import g4f

first_blueprint = Blueprint('first_blueprint', __name__, url_prefix="/api")
@first_blueprint.route('/data', methods=['POST'])
def getMessage():
    if request.json:
        chatRequest = request.get_json()['message']
        # chatKeyword = generateMessageKeyword(chatRequest)
        # isValidKeyword = checkKeyword(chatKeyword)
        # if isValidKeyword == True:
        #     chatResponse = generateMessage(chatRequest)
        #     data = {
        #     'message': chatResponse,
        #     'keyword': chatKeyword,
        #     }
        # else:
        chatVerify = verifyMessage(chatRequest)
        if chatVerify and ("yes" in chatVerify.lower() or "yes." in chatVerify.lower()):
            chatResponse = generateMessage(chatRequest)
            data = {
                'message': chatResponse,
                # 'keyword': chatKeyword,
                'verify': chatVerify
            }
        else:
            data = {
                'message': "I'm sorry, I cannot assist you with that.",
                # 'keyword': chatKeyword,
                'verify': chatVerify
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