from flask import Blueprint, render_template, current_app, session
from flask_login import login_required, current_user

from config import config_data

from models.user import User
from .api import user_stats

attack_blueprint = Blueprint('attack', __name__, template_folder='templates')

threshold = 2000


@attack_blueprint.route('/visit_oppenents_world')
@login_required
def visit_opponent():
    """
    Renders the attack view. This will render the opponent's world.
    """
    # Initialize session variables if not already set
    if 'previously_searched' not in session:
        session['previously_searched'] = []
    if 'scores' not in session:
        session['scores'] = {}

    opponent = choose_opponent_logic()

    if not opponent:
        session['previously_searched'].clear()
        session['scores'].clear()
        return render_template('attack/no_opponent.html', app_data=config_data)

    return render_template('attack/visit_opponents_world.html', opponent=opponent, app_data=config_data)


def choose_opponent_logic():
    """
    Function to select an opponent. This checks all eligible users and selects one
    which has not been searched before, has a score difference less than 1000, and is not a friend.
    :return:
    """
    # Ensure session variables are initialized
    if 'scores' not in session:
        session['scores'] = {}

    # Access data sources configured in the current_app
    user_data_access = current_app.config.get('user_data_access')
    friendship_data_access = current_app.config.get('friendship_data_access')

    users = user_data_access.get_all_users()
    users = [user for user in users if user.username != 'admin']
    current_user_object = user_data_access.get_user(current_user.username)

    friends = friendship_data_access.get_friends(current_user_object)
    friends_usernames = {friend.user2 if friend.user1 == current_user.username else friend.user1 for friend in
                         friends}

    for user in users:
        if current_user_object == user:
            user_score = user_stats(user.username)["attack"]
        else:
            user_score = user_stats(user.username)["defense"]
        session['scores'][user.username] = user_score

    eligible_users = [user for user in users if user.username not in session[
        'previously_searched'] and user.username != current_user.username and user.username not in friends_usernames and abs(
        session['scores'][current_user.username] - session['scores'][user.username]) < threshold]

    sorted_eligible_users = sorted(eligible_users, key=lambda user: session['scores'][user.username], reverse=True)

    if sorted_eligible_users:
        session['previously_searched'].append(sorted_eligible_users[0].username)
        return sorted_eligible_users[0]
    else:
        return None


@attack_blueprint.route('/attack_animation')
@login_required
def attack_animation():
    """
    Renders the attack animation view. This will show the attack animation.
    """
    return render_template('attack/attack_animation.html', app_data=config_data)


@attack_blueprint.route('/attack_result')
@login_required
def attack_result():
    """
    Renders the attack result view.
    """
    if 'previously_searched' not in session or not session['previously_searched']:
        return render_template('attack/no_opponent.html', app_data=config_data)

    opponent = session['previously_searched'][-1]
    result, resources = choose_result_logic(session['scores'][opponent], session['scores'][current_user.username])

    resource_data_access = current_app.config.get('resource_data_access')
    for resource, amount in resources.items():
        resource_data_access.update_resource(current_user.username, resource, amount)
        resource_data_access.update_resource(opponent, resource, -amount)

    return render_template('attack/attack_result.html', result=result, resources=resources, app_data=config_data)

import random


def choose_result_logic(player_score, opponent_score):
    """
    Function to determine the result of the attack based on the player's and opponent's scores.
    :param player_score: int - the score of the player
    :param opponent_score: int - the score of the opponent
    :return: tuple (str, dict) - ('Win'/'Lose', {Resource: Amount})
    """
    # Define a major difference threshold
    major_difference_threshold = 1000  # Adjust this value as needed

    # Calculate the difference
    score_difference = opponent_score - player_score

    # Determine the outcome based on score difference
    if score_difference > major_difference_threshold:
        outcome = 'Lose'
    elif score_difference < -major_difference_threshold:
        outcome = 'Win'
    else:
        # Let the fate decide if the scores are close
        outcome = 'Win' if random.choice([0, 1]) == 1 else 'Lose'

    # Get the opponent's resources
    resource_data_access = current_app.config.get('resource_data_access')
    opponent_username = session['previously_searched'][-1]
    opponent_resources = {resource.resource_type: resource.amount for resource in
                          resource_data_access.get_resources(opponent_username)}

    # Cleanup resources that are zero or negative
    valid_resources = {res: amt for res, amt in opponent_resources.items() if amt > 0}

    # Determine the percentage of resources to adjust based on the outcome
    percentage = random.uniform(0.05, 0.10)  # Random percentage between 5% and 10%

    # Calculate resource amounts based on the outcome
    resources = {}
    for resource, quantity in valid_resources.items():
        if outcome == 'Win':
            resources[resource] = int(quantity * percentage * 1.25)
        else:  # 'Lose' condition
            resources[resource] = -int(quantity * percentage)

    # Ensure no zero-amount adjustments are made
    final_resources = {res: amt for res, amt in resources.items() if amt != 0}

    return (outcome, final_resources)
