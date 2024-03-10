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
    map_data_access = current_app.config.get('map_data_access')
    map_json = map_data_access.map_data_to_json(current_user.user_id, 1)
    return render_template('game/game.html', app_data=config_data)

@game_blueprint.route('/dashboard')
def dashboard():
    return render_template('game/dashboard.html', app_data=config_data)