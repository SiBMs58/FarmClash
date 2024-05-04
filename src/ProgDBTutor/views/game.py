from flask import Blueprint, render_template, current_app, request, jsonify
from flask_login import login_required, current_user

from models.building import Building
from models.market import Market
from datetime import datetime, timedelta
import random
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

@game_blueprint.route('/leaderboard')
@login_required
def leaderboard():
    """
    Renders the leaderboard view.
    :return:
    """
    return render_template('game/leaderboard.html', app_data=config_data)

"""
Building fetch and update functions
"""
def building_user_exists(buildings, id):
    for building in buildings:
        if building.building_id == id:
            return building
    return None

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

        username_owner = current_user.username
        buildings = building_data_access.get_buildings_by_username_owner(username_owner)

        for building_info in building_information.values():
            last_building = building_info
            building_type = building_info["general_information"]
            level = building_info["level"]
            created_at = datetime.now()
            tile_rel_locations_json = json.dumps(building_info["tile_rel_locations"])  # Serialize to JSON
            x_value = building_info["building_location"][0]
            y_value = building_info["building_location"][1]
            building_id = building_info["self_key"]

            building = building_user_exists(buildings, building_id)

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
                new_building = Building(building_id, username_owner, building_type, level, x_value, y_value,
                                        tile_rel_locations_json, created_at)
                building_data_access.add_building(new_building)


        return jsonify({"status": "success", "message": "Data inserted successfully"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


"""
Markt fetch and update functions
"""
def update_price(last_count, current_count, last_price):
    if last_price == 10 or current_count == 30:
        last_price = 20
    # Calculate the ratio of current count to last count
    count_ratio = current_count / last_count if last_count != 0 else 1
    if count_ratio >= 1:
        numb = [0.7,0.8,0.9]
        random_factor = numb[random.randint(0, 2)]
    else:
        numb = [1.1, 1.2, 1.3]
        random_factor = numb[random.randint(0, 2)]

    # Calculate the new price
    new_price = last_price * random_factor

    # Ensure the price is within the specified range
    new_price = max(10, min(30, round(new_price)))

    # return jsonify({"count_ratio": count_ratio, "random_factor" : random_factor, "new_price" : new_price})
    return new_price

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

                last_count = market.prev_quantity_crop
                current_count = market.current_quantity_crop
                last_price = market.current_price
                new_price = update_price(last_count, current_count, last_price)

                # Update prev_quantity_crop and reset current_quantity_crop

                market.prev_quantity_crop = market.current_quantity_crop
                market.current_quantity_crop = 0

                # change the price based on sales and random variable

                market.current_price = new_price

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
            if  datetime.now() - market.last_update > timedelta(minutes=1):
                market.last_update = datetime.now()

                last_count = market.prev_quantity_crop
                current_count = market.current_quantity_crop
                last_price = market.current_price
                new_price = update_price(last_count, current_count, last_price)

                # change the price based on sales and random variable
                market.current_price = new_price
                market_data_access.add_market_data(market)

            return jsonify({"price": market.current_price})
        else:
            # If market data doesn't exist, return an error message
            return jsonify({"error": "Market data not found for the crop"}), 404

    except Exception as e:
        # If any error occurs, return an error response
        return jsonify({"error": str(e)}), 500