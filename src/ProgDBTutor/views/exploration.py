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


@exploration_blueprint.route('/start-exploration', methods=['POST'])
@login_required
def start_exploration():
    """
    Handles POST requests for starting an exploration
    """
    exploration_data_access = current_app.config.get('exploration_data_access')
    data = request.get_json()

    if exploration_data_access.start_exploration(
            Exploration(current_user.username, data['chickens'], data['goats'], data['pigs'], data['cows'], data['exploration_level'], data['augment_level'], data['remaining_time'])):
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
