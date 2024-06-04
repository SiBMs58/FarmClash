from flask import Blueprint, render_template, current_app, session
from flask_login import login_required, current_user
from config import config_data
from .api import user_stats

attack_blueprint = Blueprint('attack', __name__, template_folder='templates')


@attack_blueprint.route('/visit_opponents_world')
@login_required
def visit_opponent():
    """
    Renders the attack view to render the opponent's world.
    """
    opponent = choose_opponent_logic()
    if not opponent:
        session.pop('previously_searched', None)  # Clear session if no opponent found
        return render_template('attack/no_opponent.html', app_data=config_data)
    return render_template('attack/visit_opponents_world.html', opponent=opponent, app_data=config_data)


def choose_opponent_logic():
    """
    Selects an opponent based on specified criteria.
    """
    user_data_access = current_app.config.get('user_data_access')
    friendship_data_access = current_app.config.get('friendship_data_access')

    users = user_data_access.get_all_users()
    users = [user for user in users if user.username != 'admin']

    friends = friendship_data_access.get_friends(current_user)
    friends_usernames = {friend.user2 if friend.user1 == current_user.username else friend.user1 for friend in friends}

    previously_searched = set(session.get('previously_searched', []))
    scores = {user.username: user_stats(user.username)['attack' if user == current_user else 'defense'] for user in
              users}

    eligible_users = [user for user in users if
                      user.username not in previously_searched and user.username != current_user.username and user.username not in friends_usernames and abs(
                          scores[current_user.username] - scores[user.username]) < 1000]

    sorted_eligible_users = sorted(eligible_users, key=lambda user: scores[user.username], reverse=True)
    if sorted_eligible_users:
        session['previously_searched'] = list(previously_searched | {sorted_eligible_users[0].username})
        return sorted_eligible_users[0]
    return None


@attack_blueprint.route('/attack_animation')
@login_required
def attack_animation():
    """
    Renders the attack animation view.
    """
    return render_template('attack/attack_animation.html', app_data=config_data)


@attack_blueprint.route('/attack_result')
@login_required
def attack_result():
    """
    Renders the attack result view.
    """
    previously_searched = session.get('previously_searched', [])
    if previously_searched:
        opponent = previously_searched[-1]
        result, resources = choose_result_logic(user_stats(opponent)['defense'],
                                                user_stats(current_user.username)['attack'], opponent)

        resource_data_access = current_app.config.get('resource_data_access')
        for resource, amount in resources.items():
            resource_data_access.update_resource(current_user.username, resource, amount)
            resource_data_access.update_resource(opponent, resource, -amount)

        return render_template('attack/attack_result.html', result=result, resources=resources, app_data=config_data)
    return render_template('attack/no_opponent.html', app_data=config_data)


import random


def choose_result_logic(opponent_score, player_score, opponent):
    """
    Determines the outcome of an attack based on scores.
    """
    major_difference_threshold = 1000
    score_difference = opponent_score - player_score

    if score_difference > major_difference_threshold:
        outcome = 'Lose'
    elif score_difference < -major_difference_threshold:
        outcome = 'Win'
    else:
        outcome = 'Win' if random.choice([0, 1]) == 1 else 'Lose'

    resource_data_access = current_app.config.get('resource_data_access')
    opponent_resources = {resource.resource_type: resource.amount for resource in resource_data_access.get_resources(opponent)}
    resources = {}
    percentage = random.uniform(0.05, 0.10)

    for resource, quantity in opponent_resources.items():
        change_amount = int(quantity * percentage * (1.25 if outcome == 'Win' else -1))
        if change_amount != 0:
            resources[resource] = change_amount

    return (outcome, resources)
