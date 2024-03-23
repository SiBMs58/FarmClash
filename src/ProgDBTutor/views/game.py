from flask import Blueprint, render_template, current_app, request, jsonify
from flask_login import login_required, current_user


from config import config_data

game_blueprint = Blueprint('game', __name__, template_folder='templates')

@game_blueprint.route('/')
@login_required
def game():
    """
    Renders the game view.
    :return:
    """
    return render_template('game/game.html', app_data=config_data)

@game_blueprint.route('/update-building-map', methods=['POST'])
def update_map():
    map_data = request.json
    # Process the map data as needed...
    return jsonify({'status': 'success', 'message': 'Map updated successfully'})