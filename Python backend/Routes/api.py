from flask import request, jsonify, Blueprint
from Routes.checkMessage import generateMessageKeyword
import asyncio
import g4f

first_blueprint = Blueprint('first_blueprint', __name__, url_prefix="/api")
@first_blueprint.route('/data', methods=['POST'])
def getMessage():
    if request.json:
        chatRequest = request.get_json()['message']
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
        chatKeyword = asyncio.run(generateMessageKeyword(chatRequest))
        chatResponse = asyncio.run(generateMessage(chatRequest))
        
        data = {
        'message': chatResponse,
        'keyword': chatKeyword
        }
        return jsonify(data)
    else:
        return jsonify({'message': 'No JSON data found in the request'})

async def generateMessage(chatRequest):
    chatResponse = await g4f.ChatCompletion.create_async(
        model=g4f.models.gpt_4,
        messages=[{"role": "user", "content": chatRequest}],
    )
    while chatResponse == "":
        chatResponse = await g4f.ChatCompletion.create_async(
        model=g4f.models.gpt_4,
        messages=[{"role": "user", "content": chatRequest}],
    )
    return chatResponse