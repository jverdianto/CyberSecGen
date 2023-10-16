from flask import request, jsonify, Blueprint, Flask
import g4f
import json

app = Flask(__name__)

first_blueprint = Blueprint('first_blueprint', __name__, url_prefix="/api")
@first_blueprint.route('/streamdata', methods=['POST'])
def getStreamMessage():
    if request.json:
        chatRequest = request.get_json()['message']
        systemContent = "You are a cyber security assistant. As a cyber security assistant, you can only answer things that are related to cyber security, you cannot answer things that are not related to cyber security even if you know that."
        systemPrompt = {
            "role": "system",
            "content": systemContent
        }
        chatRequest.append(systemPrompt)
        for chat in chatRequest[:]:
            if (chat["role"] == "system" and chat["content"] != systemContent):
                chatRequest.remove(chat)
        chatResponse = generateMessage(chatRequest, True)
        def streaming():
            for word in chatResponse:
                yield f'{word}'
        return app.response_class(streaming(), mimetype='text/event-stream')
    else:
        return jsonify({'message': 'No JSON data found in the request'})

def generateMessage(chatRequest, stream = True):
    chatResponse = g4f.ChatCompletion.create(
        model=g4f.models.gpt_35_turbo,
        messages=chatRequest,
        stream= stream
    )
    return chatResponse