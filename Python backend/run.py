from flask import Flask
from flask_cors import CORS
from Routes.api import first_blueprint

# Create a Flask web application instance
app = Flask(__name__)
app.register_blueprint(first_blueprint)
CORS(app)

# Define a route and a function to handle requests
@app.route('/')
def hello_world():
    return 'Hello, World!'

# Run the Flask application
if __name__ == '__main__':
    app.run(host = '0.0.0.0', debug=True)