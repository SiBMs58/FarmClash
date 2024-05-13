from flask import Blueprint, render_template, current_app
from flask_login import login_required, current_user

from config import config_data

from models.user import User

attack_blueprint = Blueprint('attack', __name__, template_folder='templates')

previously_searched = ['admin']

@attack_blueprint.route('/visit_oppenents_world')
@login_required
def visit_opponent():
    """
    Renders the attack view. This will render the opponent's world.
    """
    # Example logic to choose an opponent
    opponent = choose_opponent_logic()  # This function needs to be implemented based on your app logic

    if not opponent:
        previously_searched.clear()
        previously_searched.append('admin')
        return render_template('attack/no_opponent.html', app_data=config_data)

    return render_template('attack/visit_opponents_world.html', opponent=opponent, app_data=config_data)

def choose_opponent_logic():
    """
    Placeholder function to select an opponent. This checks on al the edigible users and selects one which has not been searched before and has a score difference less than 1000.
    :return:
    """
    # Placeholder function to select an opponent
    user_data_access = current_app.config.get('user_data_access')
    resource_data_access = current_app.config.get('resource_data_access')

    users = user_data_access.get_all_users()
    scores = {}
    for user in users:
        recources = resource_data_access.get_resources(user.username)
        user_score = sum([resource.amount for resource in recources])
        scores[user.username] = user_score
    # Filter users based on whether they have been searched before and their scores
    eligible_users = []
    for user in users:
        if user.username not in previously_searched and user.username != current_user.username:
            difference_in_score = scores[current_user.username] - scores[user.username]  # Assuming current_user is the username
            if difference_in_score < 1000:
                eligible_users.append(user)
    sorted_eligible_users = sorted(eligible_users, key=lambda user: scores[user.username], reverse=True)
    if sorted_eligible_users:
        previously_searched.append(sorted_eligible_users[0].username)
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
    Renders the attack result view. This will show the result of the attack.
    """
    return render_template('attack/attack_result.html', app_data=config_data)