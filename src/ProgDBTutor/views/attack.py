from flask import Blueprint, render_template, current_app, jsonify
from flask_login import login_required, current_user

from config import config_data

from models.user import User
from .api import user_stats

attack_blueprint = Blueprint('attack', __name__, template_folder='templates')

threshold = 2000

# Global dictionaries to hold user-specific data
user_specific_data = {}

def get_user_data(user_name):
    if user_name not in user_specific_data:
        # Initialize default values for new users
        user_specific_data[user_name] = {
            'previously_searched': [],
            'scores': {}
        }
    return user_specific_data[user_name]


@attack_blueprint.route('/visit_oppenents_world')
@login_required
def visit_opponent():
    """
    Renders the attack view. This will render the opponent's world.
    """
    # Example logic to choose an opponent
    opponent = choose_opponent_logic()  # This function needs to be implemented based on your app logic
    return jsonify(opponent.__dict__ if opponent else None)

    if not opponent:
        get_user_data(current_user.username)['previously_searched'].clear()
        # Print or log user-specific data for debugging
        user_data = get_user_data(current_user.username)
        return jsonify(user_data)
        return render_template('attack/no_opponent.html', app_data=config_data)

    return render_template('attack/visit_opponents_world.html', opponent=opponent, app_data=config_data)


def choose_opponent_logic():
    """
    Function to select an opponent. This checks all eligible users and selects one
    which has not been searched before, has a score difference less than 1000, and is not a friend.
    :return:
    """
    try:
        scores = get_user_data(current_user.username)['scores']
        previously_searched = get_user_data(current_user.username)['previously_searched']
        user_data_access = current_app.config.get('user_data_access')
        friendship_data_access = current_app.config.get('friendship_data_access')

        # Get all users and current user object
        users = user_data_access.get_all_users()
        # Filter out the admin user
        users = [user for user in users if user.username != 'admin']

        # Retrieve friends of the current user
        friends = friendship_data_access.get_friends(current_user)
        friends_usernames = {friend.user2 if friend.user1 == current_user.username else friend.user1 for friend in friends}

        # Calculate scores for all users
        for user in users:
            if current_user.username == user.username:
                user_score = user_stats(user.username)["attack"]
            else:
                user_score = user_stats(user.username)["defense"]
            scores[user.username] = user_score

        # Filter users based on the conditions
        eligible_users = []
        for user in users:
            if user.username not in previously_searched and user.username != current_user.username and user.username not in friends_usernames:
                difference_in_score = abs(scores[current_user.username] - scores[user.username])
                if difference_in_score < threshold:
                    eligible_users.append(user)

        # Sort eligible users by their scores in descending order
        sorted_eligible_users = sorted(eligible_users, key=lambda user: scores.get(user.username, 0), reverse=True)
        # Select the top eligible user if available
        if sorted_eligible_users:
            previously_searched.append(sorted_eligible_users[0].username)
            return sorted_eligible_users[0]
        else:
            return eligible_users
    except Exception as e:
        import traceback
        print("An error occurred: ", str(e), "\n", traceback.format_exc())
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
    opponent = get_user_data(current_user.username)['previously_searched'][-1]
    result, resources = choose_result_logic(get_user_data(current_user.username)['scores'][opponent], get_user_data(current_user.username)['scores'][current_user.username])  # Unpack the tuple returned by choose_result_logic

    # Update the resources in the database
    resource_data_access = current_app.config.get('resource_data_access')
    for resource, amount in resources.items():  # For the current user
        resource_data_access.update_resource(current_user.username, resource, amount)
    for resource, amount in resources.items():  # For the opponent
        resource_data_access.update_resource(opponent, resource, -amount)

    # Pass the result and resources to the template
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
    opponent_resources = {resource.resource_type: resource.amount for resource in
                          resource_data_access.get_resources(get_user_data(current_user.username)['previously_searched'][-1])}
    for resource in list(opponent_resources.keys()):
        if opponent_resources[resource] <= 0:
            opponent_resources.pop(resource)
        else:
            print(f'{resource}: {opponent_resources[resource]}')

    # Determine the percentage of resources to adjust based on the outcome
    percentage = random.uniform(0.05, 0.10)  # Random percentage between 5% and 10%

    # Calculate resource amounts based on the outcome and the opponent's resources
    resources = {}
    if outcome == 'Win':
        for resource, quantity in opponent_resources.items():
            resources[resource] = int(quantity * percentage * 1.25)
    elif outcome == 'Lose':
        for resource, quantity in opponent_resources.items():
            resources[resource] = -int(quantity * percentage)
    resources = {resource: amount for resource, amount in resources.items() if not amount == 0}

    return (outcome, resources)