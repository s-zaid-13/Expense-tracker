from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import *
from models import db, bcrypt
from routes.auth import auth_bp
from routes.expenses import expense_bp
from config import Config

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)


@app.route("/")
def home():
    return "Flask backend running"


CORS(app)
app.register_blueprint(auth_bp)
app.register_blueprint(expense_bp)

bcrypt.init_app(app)
jwt = JWTManager(app)

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
