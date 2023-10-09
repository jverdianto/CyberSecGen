from flask import request, jsonify, Blueprint, Flask
from Backend.Routes.checkMessage import generateMessageKeyword, checkKeyword, verifyMessage
import g4f

app = Flask(__name__)

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
            chatVerify = verifyMessage(chatRequest)
            if chatVerify and ("yes" in chatVerify.lower() or "yes." in chatVerify.lower()):
                chatResponse = generateMessage(chatRequest)
                data = {
                'message': chatResponse,
                'keyword': chatKeyword,
                'verify': chatVerify
                }
            else:
                data = {
                'message': "I'm sorry, I cannot assist you with that.",
                'keyword': chatKeyword,
                'verify': chatVerify
                }
        return jsonify(data)
    else:
        return jsonify({'message': 'No JSON data found in the request'})

@first_blueprint.route('/streamdata', methods=['POST'])
def getStreamMessage():
    if request.json:
        chatRequest = request.get_json()['message']
        chatKeyword = generateMessageKeyword(chatRequest)
        isValidKeyword = checkKeyword(chatKeyword)
        if isValidKeyword == True:
            chatResponse = generateMessage(chatRequest, True)
            def streaming():
                for word in chatResponse:
                    yield f'{word}'
            return app.response_class(streaming(), mimetype='text/event-stream')
        else:
            chatVerify = verifyMessage(chatRequest)
            if chatVerify and ("yes" in chatVerify.lower() or "yes." in chatVerify.lower()):
                chatResponse = generateMessage(chatRequest, True)
                def streaming():
                    for word in chatResponse:
                        yield f'{word}'
                return app.response_class(streaming(), mimetype='text/event-stream')
            else:
                def streaming():
                    response = "I'm sorry, I cannot assist you with that."
                    for word in response:
                        yield f'{word}'
                return app.response_class(streaming(), mimetype='text/event-stream')
    else:
        return jsonify({'message': 'No JSON data found in the request'})

def generateMessage(chatRequest, stream = False):
    chatResponse = g4f.ChatCompletion.create(
        model=g4f.models.gpt_35_turbo,
        messages=[{"role": "user", "content": chatRequest}],
        stream= stream
    )
    return chatResponse