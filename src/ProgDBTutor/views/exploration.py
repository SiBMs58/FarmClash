from flask import Blueprint, redirect, url_for, render_template, request, jsonify, current_app
from flask_login import login_required, current_user

from config import config_data
from models.exploration import Exploration

exploration_blueprint = Blueprint('exploration', __name__, template_folder='templates')


@exploration_blueprint.route('/')
@login_required
def exploration():
    """
    Renders the EXPLORATION  view.
    """
    if current_user.username == 'admin':
        return redirect(url_for('admin'))
    return render_template('exploration/exploration.html', app_data=config_data)


@exploration_blueprint.route('/get-exploration')
@login_required
def get_explorations():
    """
    Handles GET requests for explorations. This will return a list of all explorations, for the current user
    :return: explorations, in json format
    """
    try:
        exploration_data_access = current_app.config.get('exploration_data_access')
        exploration = exploration_data_access.get_exploration(current_user.username)
        if exploration:
            exploration_dict = exploration.to_dict()
            exploration_dict["ongoing"] = True
            return jsonify(exploration_dict)
        else:
            return jsonify({"ongoing": False})

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@exploration_blueprint.route('/start-exploration', methods=['POST'])
@login_required
def start_exploration():
    """
    Handles POST requests for starting an exploration
    """
    exploration_data_access = current_app.config.get('exploration_data_access')
    data = request.get_json()
    chickens = int(data['chickens'])
    goats = int(data['goats'])
    pigs = int(data['pigs'])
    cows = int(data['cows'])
    level = 1  ##TODO fetch exploration building level from DATABASE
    augment = 0  ##TODO fetch augment building level from DATABASE
    duration = data['duration']

    if exploration_data_access.start_exploration(
            Exploration(current_user.username, chickens, goats, pigs, cows, level, augment, duration)):
        return jsonify({'status': 'success', 'message': 'Exploration started successfully.'})
    else:
        return jsonify({'status': 'error', 'message': 'Failed to start exploration.'}), 500


@exploration_blueprint.route('/stop-exploration', methods=['POST'])
@login_required
def stop_exploration():
    """
    Handles POST requests for stopping an exploration
    """
    exploration_data_access = current_app.config.get('exploration_data_access')

    # Remove the exploration from the database
    if exploration_data_access.stop_exploration(current_user.username):
        return jsonify({'status': 'success', 'message': 'Exploration stopped successfully.'})
    else:
        return jsonify({'status': 'error', 'message': 'Failed to stop exploration.'}), 500