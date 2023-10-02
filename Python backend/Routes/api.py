from flask import request, jsonify, Blueprint
from Routes.checkMessage import generateMessageKeyword
import asyncio
import g4f

first_blueprint = Blueprint('first_blueprint', __name__, url_prefix="/api")
@first_blueprint.route('/data', methods=['POST'])
def getMessage():
    if request.json:
        chatRequest = request.get_json()['message']
        asyncio.set_event_loop(asyncio.new_event_loop())
        chatResponse = generateMessage(chatRequest)
        chatKeyword = generateMessageKeyword(chatRequest)
        data = {
        'message': chatResponse,
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