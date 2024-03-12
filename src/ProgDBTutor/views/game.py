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
    user_data_access = current_app.config.get('user_data_access')
    currUser = user_data_access.get_user_by_username(current_user.username)
    if currUser.username == 'admin':
        return render_template('game/admin.html', app_data=config_data)
    first_map = user_data_access.get_maps_by_user(currUser.user_id, 1)
    map_data_access = current_app.config.get('map_data_access')
    terrain_tiles = map_data_access.get_terrain_tiles(first_map.map_id)
    first_map.set_terrain(terrain_tiles)
    first_map.to_json()
    return render_template('game/game.html', app_data=config_data)

@game_blueprint.route('/dashboard')
def dashboard():
    return render_template('game/dashboard.html', app_data=config_data)