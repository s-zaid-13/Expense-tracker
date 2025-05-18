# routes/expense.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Expense

expense_bp = Blueprint('expense', __name__)

@expense_bp.route('/expenses', methods=['GET'])
@jwt_required()
def get_expenses():
    user_id = get_jwt_identity()
    expenses = Expense.query.filter_by(user_id=user_id).all()
    return jsonify([{
        'id': e.id,
        'title': e.title,
        'amount': e.amount,
        'date': e.date,
        'category':e.category
    } for e in expenses]), 200

@expense_bp.route('/expenses', methods=['POST'])
@jwt_required()
def add_expense():
    data = request.get_json()
    user_id = get_jwt_identity()
    expense = Expense(
        title=data['title'],
        amount=data['amount'],
        category=data.get('category', 'Uncategorized'),
        date=data['date'],
        user_id=user_id
    )
    db.session.add(expense)
    db.session.commit()
    return jsonify({'msg': 'Expense added'}), 201

@expense_bp.route('/expenses/<int:id>',methods=['PUT'])
@jwt_required()
def update_expense(id):
    user_id=int(get_jwt_identity())
    expense=Expense.query.get_or_404(id)
    if expense.user_id!=user_id:
        return jsonify({'msg': 'Unauthorized'}), 403
    data=request.get_json()
    expense.title = data['title']
    expense.amount = data['amount']
    expense.category = data.get('category', expense.category)
    expense.date = data['date']
    db.session.commit()
    return jsonify({'msg': 'Expense updated'}), 200


@expense_bp.route('/expenses/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_expense(id):
    user_id = int(get_jwt_identity())
    expense = Expense.query.get_or_404(id)
    if expense.user_id != user_id:
        return jsonify({'msg': 'Unauthorized'}), 403
    db.session.delete(expense)
    db.session.commit()
    return jsonify({'msg': 'Expense deleted'}), 200
