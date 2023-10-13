from flask import Flask, render_template
from flask_cors import CORS
from Backend.Routes.api import first_blueprint
import os
import csv

# Create a Flask web application instance
app = Flask(__name__)
app.register_blueprint(first_blueprint)
path = os.getcwd()

CORS(app, resources={r"/*": {"origins": "http://localhost"}})

# Define a route and a function to handle requests
@app.route('/')
def main_page():
    return render_template('index.html')

#Function for load wordlist from file the first time
def loadWordLists():
    WORDLISTS = []
    absolute_path = path
    relative_path = "Backend/wordlist.csv"
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
    app.run(port = 5000)