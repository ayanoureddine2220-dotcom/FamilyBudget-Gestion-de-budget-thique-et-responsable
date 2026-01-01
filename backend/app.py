from flask import Flask, jsonify, request
from flask_cors import CORS
from models import db, User, Subscription, Goal
import os

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///familybudget.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'dev_secret_key'

db.init_app(app)

@app.route('/')
def hello():
    return jsonify({"message": "FamilyBudget Backend is running!"})

@app.route('/api/status', methods=['GET'])
def status():
    return jsonify({"status": "ok", "version": "1.0.0"})

# Example Endpoint: Get User Profile (Mock)
@app.route('/api/user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get(user_id)
    if user:
        return jsonify(user.to_dict())
    return jsonify({"error": "User not found"}), 404

# Init DB
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, port=5000)
 