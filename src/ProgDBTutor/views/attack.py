from flask import Blueprint, render_template
from flask_login import login_required

from config import config_data

from models.user import User

attack_blueprint = Blueprint('attack', __name__, template_folder='templates')

@attack_blueprint.route('/visit_oppenents_world')
@login_required
def visit_opponent():
    """
    Renders the attack view. This will render the opponent's world.
    """
    # Example logic to choose an opponent
    opponent = choose_opponent_logic()  # This function needs to be implemented based on your app logic

    return render_template('attack/visit_opponents_world.html', opponent=opponent, app_data=config_data)

def choose_opponent_logic():
    # Placeholder function to select an opponent
    user = User('Bestie', 'password', 'email')
    return user

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