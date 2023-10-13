from flask import request, jsonify, Blueprint, Flask
from Backend.Routes.checkMessage import generateMessageKeyword, checkKeyword, verifyMessage
import g4f

app = Flask(__name__)
messagesPrompt=[{"role": "system", "content": "You are a cyber security assistant. As a cyber security assistant, you can only answer things that are related to cyber security, you cannot answer things that are not related to cyber security even if you know that."}]

first_blueprint = Blueprint('first_blueprint', __name__, url_prefix="/api")
@first_blueprint.route('/streamdata', methods=['POST'])
def getStreamMessage():
    global messagesPrompt
    if request.json:
        chatRequest = request.get_json()['message']
        chatResponse = generateMessage(chatRequest, True)
        def streaming():
            tempMessage = ""
            for word in chatResponse:
                tempMessage = tempMessage + word
                yield f'{word}'
            messagesPrompt.append({"role": "assistant", "content": tempMessage})    
        return app.response_class(streaming(), mimetype='text/event-stream')
    else:
        return jsonify({'message': 'No JSON data found in the request'})

def generateMessage(chatRequest, stream = True):
    global messagesPrompt
    messagesPrompt.append({"role": "user", "content": chatRequest})
    print(messagesPrompt)
    chatResponse = g4f.ChatCompletion.create(
        model=g4f.models.gpt_35_turbo_16k,
        messages=messagesPrompt,    
        stream= stream
    )
    return chatResponse

def appendMessages(messageResponse):
    global messagesPrompt
    messagesPrompt.append({"role": "user", "content": messageResponse})