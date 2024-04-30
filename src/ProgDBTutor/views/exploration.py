from flask import Blueprint, redirect, url_for, render_template, request, jsonify, current_app
from flask_login import login_required, current_user

from config import config_data
from models.explorations import Exploration

exploration_blueprint = Blueprint('explorations', __name__, template_folder='templates')


@exploration_blueprint.route('/start_exploration', methods=['POST'])
@login_required
def start_exploration():
    """
    Handles POST requests for starting an exploration
    """
    exploration_data_access = current_app.config.get('exploration_data_access')
    data = request.get_json()
    chickens = data['chickens']
    goats = data['goats']
    pigs = data['pigs']
    cows = data['cows']
    level = data['level']  ##TODO fetch exploration building level from DATABASE
    augment = data['augment']  ##TODO fetch augment building level from DATABASE
    duration = data['duration']

    if exploration_data_access.start_exploration(
            Exploration(current_user.username, chickens, goats, pigs, cows, level, augment, duration)):
        return jsonify({'status': 'success', 'message': 'Exploration started successfully.'})
    else:
        return jsonify({'status': 'error', 'message': 'Failed to start exploration.'}), 500


@exploration_blueprint.route('/stop_exploration', methods=['POST'])
@login_required
def remove_exploration():
    """
    Handles POST requests for stopping an exploration
    """
    exploration_data_access = current_app.config.get('exploration_data_access')

    # Remove the exploration from the database
    if exploration_data_access.stop_exploration(current_user.username):
        return jsonify({'status': 'success', 'message': 'Exploration stopped successfully.'})
    else:
        return jsonify({'status': 'error', 'message': 'Failed to stop exploration.'}), 500
