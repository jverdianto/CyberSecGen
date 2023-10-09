import g4f

def generateMessageKeyword(message):
    prompt = "Please identify the main terms or keywords, divided by comma if more than one, in the following sentence or paragraph: " + message
    keywordResponse = g4f.ChatCompletion.create(
        model=g4f.models.gpt_4,
        messages=[{"role": "user", "content": prompt}]
        )
    return keywordResponse

def checkKeyword(keywordResponse):
    from run import WORDLISTS
    keywordLists = keywordResponse.split(', ')
    for keyword in keywordLists:
        if keyword.lower() in (data.lower() for data in WORDLISTS):
            return True
    return False

def verifyMessage(message):
    prompt = 'Is this sentence related to cyber security? Respond with yes or no: ' + message
    verifyResponse = g4f.ChatCompletion.create(
        model=g4f.models.gpt_4,
        messages=[{"role": "user", "content": prompt}]
        )
    return verifyResponse