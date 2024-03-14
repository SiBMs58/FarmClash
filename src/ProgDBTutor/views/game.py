from flask import Blueprint, render_template, current_app
from flask_login import login_required, current_user

from config import config_data
from extensions import login_manager

game_blueprint = Blueprint('game', __name__, template_folder='templates')

@login_manager.user_loader
def load_user(user_id):
    user_data_access = current_app.config.get('user_data_access')
    return user_data_access.get_user(user_id)

@game_blueprint.route('/')
@login_required
def game():
    """
    Renders the game view.
    :return:
    """
    return render_template('game/game.html', app_data=config_data)