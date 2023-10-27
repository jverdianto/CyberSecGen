from flask import Flask, render_template
from flask_cors import CORS
from Backend.Routes.api import first_blueprint
import os
from dotenv import load_dotenv
load_dotenv()


# Create a Flask web application instance
app = Flask(__name__)
app.register_blueprint(first_blueprint)
path = os.getcwd()

CORS(app, resources={r"/*": {"origins": "*"}})

# Define a route and a function to handle requests
@app.route('/')
def main_page():
    return render_template('index.html')
# Run the Flask application
if __name__ == '__main__':
    app.run(port = 5000, debug=True)