from flask import Flask
from flask_cors import CORS
from Routes.api import first_blueprint
from Routes.checkMessage import checkKeyword
import os
import csv

# Create a Flask web application instance
app = Flask(__name__)
app.register_blueprint(first_blueprint)

CORS(app)

# Define a route and a function to handle requests
@app.route('/')
def hello_world():
    return 'Hello, World!'

#Function for load wordlist from file the first time
def loadWordLists():
    WORDLISTS = []
    absolute_path = os.path.dirname(__file__)
    relative_path = "wordlist.csv"
    full_path = os.path.join(absolute_path, relative_path)
    with open(full_path, 'r') as f:
        reader = csv.reader(f)
        for row in reader:
            for item in row:
                WORDLISTS.append(item)
    return WORDLISTS

WORDLISTS = loadWordLists() 

# Run the Flask application
if __name__ == '__main__':
    app.run(host = '0.0.0.0')    