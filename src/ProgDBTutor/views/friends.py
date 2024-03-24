from flask import Blueprint, redirect, url_for, render_template, request, jsonify, current_app
from flask_login import login_required, current_user

from config import config_data

from models.friendship import Friendship


friends_blueprint = Blueprint('friends', __name__, template_folder='templates')


@friends_blueprint.route('/dashboard')
@login_required
def dashboard():
    """
    Renders the dashboard view, for a user.
    """
    if current_user.username == 'admin':
        return redirect(url_for('admin'))
    return render_template('friends/dashboard.html', app_data=config_data)

@friends_blueprint.route('/add_friend', methods=['POST'])
@login_required
def add_friend():
    user_data_access = current_app.config.get('user_data_access')
    user_1 = user_data_access.get_user(current_user.username)
    user_2_username = "SIBMS"# TODO get the username of the user you want to add as a friend
    user_2 = user_data_access.get_user(user_2_username)
    friendship_data_access = current_app.config.get('friendship_data_access')
    friendship_data_access.add_friendship(Friendship(user_1, user_2))

    return jsonify({'message': 'Friend added successfully!'})

@friends_blueprint.route('/send_message', methods=['POST'])
@login_required
def send_message():
    pass

@friends_blueprint.route('/get_messages', methods=['GET'])
def get_messages():
    pass