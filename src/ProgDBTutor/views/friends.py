from flask import Blueprint, redirect, url_for, render_template, request, jsonify, current_app
from flask_login import login_required, current_user

from config import config_data

from models.friendship import Friendship
from models.chatmessage import ChatMessage


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

@friends_blueprint.route('/search_friends')
@login_required
def search_friends():
    """
    Renders the search friends view, for a user.
    """
    query = request.args.get('query', '')
    if query:
        user_data_access = current_app.config.get('user_data_access')
        matching_users = user_data_access.search_users(query)
        matching_users_not_friends = []
        for user in matching_users:
            friendship_data_access = current_app.config.get('friendship_data_access')
            if not friendship_data_access.get_friendship(current_user, user):
                matching_users_not_friends.append(user)
    else:
        matching_users_not_friends = []
    return render_template('friends/friends_search_results.html', users=matching_users_not_friends, app_data=config_data)


@friends_blueprint.route('/add_friend/<string:friend_name>', methods=['POST'])
@login_required
def add_friend(friend_name):
    """
    Handles POST requests for adding a friend
    :param friend_name: The name of the friend
    :return: Redenders the dashboard view
    """
    user_data_access = current_app.config.get('user_data_access')
    user_1 = user_data_access.get_user(current_user.username)
    user_2 = user_data_access.get_user(friend_name)
    friendship_data_access = current_app.config.get('friendship_data_access')
    friendship_data_access.add_friendship(Friendship(user_1, user_2))

    return render_template('friends/dashboard.html',  app_data=config_data)

@friends_blueprint.route('/add_message', methods=['POST'])
@login_required
def add_message():
    """
    Handles POST requests for adding a message
    """
    chatmessage_data_access = current_app.config.get('chatmessage_data_access')
    data = request.get_json()
    sender = current_user.username
    receiver = data['receiver']
    message = data['message']
    # Assuming the add_message method returns a boolean indicating success
    if chatmessage_data_access.add_message(ChatMessage(sender, receiver, message)):
        return jsonify({'status': 'success', 'message': 'Message sent successfully.'})
    else:
        return jsonify({'status': 'error', 'message': 'Failed to send message.'}), 500

