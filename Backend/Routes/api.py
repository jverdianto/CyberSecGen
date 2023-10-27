from flask import request, jsonify, Blueprint, Flask
import openai

app = Flask(__name__)

first_blueprint = Blueprint('first_blueprint', __name__, url_prefix="/api")
@first_blueprint.route('/streamdata', methods=['POST'])
def getStreamMessage():
    if request.json:
        chatRequest = request.get_json()['message']
        systemContent = "You are a cyber security assistant. As a cyber security assistant, you cannot answer things that are not related to cyber security, but you can only answer things that are directly related to cyber security"
        systemPrompt = {
            "role": "system",
            "content": systemContent
        }
        chatRequest.insert(0, systemPrompt)
        for chat in chatRequest[:]:
            if (chat["role"] == "system" and chat["content"] != systemContent):
                chatRequest.remove(chat)
        chatResponse = generateMessage(chatRequest, True)
        def streaming():
            for word in chatResponse:
                if (len(word['choices'][0]['delta']) != 0):
                    chunk = word['choices'][0]['delta']["content"]
                    yield(chunk)
        return app.response_class(streaming(), mimetype='text/event-stream')
    else:
        return jsonify({'message': 'No JSON data found in the request'})

def generateMessage(chatRequest, stream = True):
    chatResponse = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=chatRequest,
        stream= stream,
    )
    return chatResponse