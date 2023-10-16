from flask import request, jsonify, Blueprint, Flask
from Backend.Routes.checkMessage import generateMessageKeyword, checkKeyword, verifyMessage
import g4f

app = Flask(__name__)

first_blueprint = Blueprint('first_blueprint', __name__, url_prefix="/api")
@first_blueprint.route('/streamdata', methods=['POST'])
def getStreamMessage():
    if request.json:
        chatRequest = request.get_json()['message']
        chatResponse = generateMessage(chatRequest, True)
        def streaming():
            for word in chatResponse:
                yield word
        return app.response_class(streaming(), mimetype='text/event-stream')
    else:
        return jsonify({'message': 'No JSON data found in the request'})

def generateMessage(chatRequest, stream = True):
    chatResponse = g4f.ChatCompletion.create(
        model=g4f.models.gpt_35_turbo_16k,
        messages=chatRequest,
        stream= stream
    )
    return chatResponse