from flask import Blueprint, render_template, current_app, request, jsonify
from flask_login import login_required, current_user

from models.building import Building
from datetime import datetime
import json

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
    """
    Handles POST requests to insert JSON data into the database.
    Expects JSON data in the request body.
    """
    try:
        building_data_access = current_app.config.get('building_data_access')

        # Parse JSON data from request body
        json_data = request.json
        building_information = json_data["building_information"]

        for building_info in building_information.values():
            building_type = building_info["display_name"]
            level = building_info["level"]
            created_at = datetime.now()
            tile_rel_locations_json = json.dumps(building_info["tile_rel_locations"])  # Serialize to JSON
            x_value = building_info["building_location"][0]
            y_value = building_info["building_location"][1]
            building_id = building_info["self_key"]
            username_owner = current_user.username

            # Check if the building_id exists
            building = building_data_access.get_building(building_id)
            if building:
                # Update the existing building entry
                building.building_type = building_type
                building.level = level
                building.created_at = created_at
                building.x = x_value
                building.y = y_value
                building.tile_rel_locations = tile_rel_locations_json
                building_data_access.add_building(building)
            else:
                # Insert a new building entry
                new_building = Building(building_id, username_owner, None, building_type, level, x_value, y_value,
                                        tile_rel_locations_json, created_at)
                building_data_access.add_building(new_building)

            # Retrieve the generated or updated building ID
            building = building_data_access.get_building(building_id)
            building_id = building.building_id

            # Insert or update the building_tiles entry
            # You need to implement this part based on your specific logic

        return jsonify({"status": "success", "message": "Data inserted successfully"})

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500





@game_blueprint.route('/fetch-building-information', methods=['GET'])
def fetch_building_information():
    try:
        building_data_access = current_app.config.get('building_data_access')
        # Fetch building information based on username
        buildings = building_data_access.get_buildings_by_username_owner(current_user.username)

        # If no buildings found, return appropriate JSON response
        if not buildings:
            return jsonify({"status": "No buildings"})

        # Construct the final JSON response
        building_information = {}
        for building in buildings:
            building_info = {
                "self_key": building.building_id,
                "display_name": building.building_type,
                "level": building.level,
                "building_location": [building.x, building.y],
                "tile_rel_locations": building.tile_rel_locations
            }
            building_information[building.building_id] = building_info

        json_response = {
            "building_information": building_information
        }

        return jsonify(json_response)

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500