from flask import Blueprint, render_template, current_app, request, jsonify
from flask_login import login_required, current_user

from models.building import Building
from models.market import Market
from models.crops import Crop
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



"""
Building fetch and update functions
"""

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
            building_type = building_info["general_information"]
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
                "general_information": building.building_type,
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





"""
Markt fetch and update functions
"""

@game_blueprint.route('/update-market', methods=['POST'])
def update_market():
    """
    Handles POST requests to insert market count data into the database.
    Expects crop name and sale amount in the request body as JSON.
    """
    try:
        # Get the crop name and sale amount from the request body
        json_data = request.json
        crop_name = json_data["crop"]
        sale = json_data["sale"]

        # Get current market data
        market_data_access = current_app.config.get('market_data_access')
        market = market_data_access.get_market_data(crop_name)

        if market:
            # Update the last update time

            # Check if more than 1 minute has passed since the last update
            if  datetime.now() - market.last_update > timedelta(minutes=1):
                market.last_update = datetime.now()
                # Update prev_quantity_crop and reset current_quantity_crop
                market.prev_quantity_crop = market.current_quantity_crop
                market.current_quantity_crop = 0

            # Update the existing market entry
            market.current_quantity_crop += sale
            market_data_access.add_market_data(market)
        else:
            # No existing market data found, create a new entry with crop's base price
            new_market = Market(crop_name, 10, sale, 0, datetime.now())
            market_data_access.add_market_data(new_market)

        return jsonify({"status": "success", "message": "Market data updated successfully"})

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500



@game_blueprint.route('/fetch-crop-price', methods=['GET'])
def fetch_crop_price():
    try:
        # Get the crop name from the query parameters
        crop_name = request.args.get('crop')

        # Query the database to fetch the price of the crop from the market
        market_data_access = current_app.config.get('market_data_access')
        market = market_data_access.get_market_data(crop_name)

        if market:
            # If market data exists for the crop, return its price
            return jsonify({"price": market.current_price})
        else:
            # If market data doesn't exist, return an error message
            return jsonify({"error": "Market data not found for the crop"}), 404

    except Exception as e:
        # If any error occurs, return an error response
        return jsonify({"error": str(e)}), 500