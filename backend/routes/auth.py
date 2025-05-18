# routes/auth.py
from flask import Blueprint, request, jsonify
from models import db, bcrypt, User
from flask_jwt_extended import create_access_token

auth_bp = Blueprint('auth', __name__)



@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data['username']
    password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

    if User.query.filter_by(username=username).first():
        return jsonify({'msg': 'Username already exists'}), 409

    user = User(username=username, password=password)
    db.session.add(user)
    db.session.commit()
    return jsonify({'msg': 'Registered successfully'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()

    if user and bcrypt.check_password_hash(user.password, data['password']):
        token = create_access_token(identity=str(user.id))
        return jsonify({'token': token}), 200

    return jsonify({'msg': 'Invalid credentials'}), 401
