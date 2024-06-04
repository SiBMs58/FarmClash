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
@game_blueprint.route('/silo')
@login_required
def silo():
    """
    Renders the silo view.
    :return:
    """
    return render_template('silo.html', app_data=config_data)

@game_blueprint.route('/barn')
@login_required
def barn():
    """
    Renders the barn view.
    :return:
    """
    return render_template('barn.html', app_data=config_data)

@game_blueprint.route('/townhall')
@login_required
def townhall():
    """
    Renders the townhall view.
    :return:
    """
    return render_template('townhall.html', app_data=config_data)

@game_blueprint.route('/exploration')
@login_required
def exploration():
    """
    Renders the EXPLORATION  view.
    """
    return render_template('exploration/exploration.html', app_data=config_data)

@game_blueprint.route('/gifts')
@login_required
def gifts():
    """
    Renders the gifts view with the current user's gifts.
    The gifts are based on the user's last login time and the time the user has been playing the game.
    :return: Rendered template for the gifts view.
    """
    user_data_access = current_app.config.get('user_data_access')
    user = user_data_access.get_user(current_user.username)
    if user.last_gift is None:
        user.last_gift = datetime.now()

    gifts = {
        "Money": 200,
        "Wheat": 58,
        "Carrot": 47,
        "corn": 45,
        "Lettuce": 40,
        "Tomato": 35,
        "Turnip": 67,
        "zucchini": 50,
        "Parsnip": 60,
        "Cauliflower": 55,
        "eggplant": 45,
        "egg": 22,
        "Rustic egg": 37,
        "Crimson egg": 55,
        "Emerald egg": 11,
        "Sapphire egg": 55,
        "milk": 55,
        "Chocolate milk": 55,
        "Strawberry milk": 8,
        "Soy milk": 8,
        "Blueberry milk": 4,
    }

    gift = None
    amount = 0

    # Check if the user has logged in within the last hour
    if user.last_gift + timedelta(hours=1) <= datetime.now():
        # Calculate bonuses based on the time the user has been playing the game
        delta_created_at = datetime.now() - user.created_at
        delta_last_gift = datetime.now() - user.last_gift

        # Determine bonus multipliers
        # Example bonus logic (you can customize this logic as needed)
        time_played_bonus = max(delta_created_at.days // 30, 1)  # 1 bonus point for each month played
        recent_login_bonus = max((60 - delta_last_gift.seconds // 60), 1)  # Up to 60 bonus points for recent login

        # Pick a random gift and calculate the total amount with bonuses
        gift = random.choice(list(gifts.keys()))
        base_amount = gifts[gift]
        amount = base_amount + time_played_bonus + recent_login_bonus

        # Insert it in the database
        resource_data_access = current_app.config.get('resource_data_access')
        print(current_user.username, gift, amount)
        resource_data_access.update_resource(current_user.username, gift, amount)

        # Update the last gift time
        user_data_access.update_last_gift(current_user.username)

    return render_template('gifts.html', app_data=config_data, gift=gift, amount=amount)


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
            building_type = building_info["general_information"]
            level = building_info["level"]
            augment_level = building_info.get("augment_level", 0)  # Default to 0 if not provided
            unlock_level = building_info.get("unlock_level", 0)  # Default to 0 if not provided
            created_at = datetime.now()
            x_value = building_info["building_location"][0]
            y_value = building_info["building_location"][1]
            building_id = building_info["self_key"]

            building = next((b for b in buildings if b.building_id == building_id), None)

            if building:
                # Update the existing building entry
                building.building_type = building_type
                building.level = level
                building.augment_level = augment_level
                building.unlock_level = unlock_level
                building.created_at = created_at
                building.x = x_value
                building.y = y_value
                building_data_access.add_building(building)

            else:
                # Insert a new building entry
                new_building = Building(building_id, username_owner, building_type, unlock_level, level, x_value, y_value, created_at, augment_level)
                building_data_access.add_building(new_building)

        return jsonify({"status": "success", "message": "Data inserted successfully"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


"""
Markt fetch and update functions
"""
def update_price(last_count, current_count, last_price, base_price):
    if last_price == base_price or current_count == base_price*3:
        last_price = base_price*2
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
    new_price = max(base_price, min(base_price*3, round(new_price)))

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
        base_price = json_data["base_price"]

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
                new_price = update_price(last_count, current_count, last_price, base_price)

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
            new_market = Market(crop_name, base_price, sale, 0, datetime.now())
            market_data_access.add_market_data(new_market)

        return jsonify({"status": "success", "message": "Market data updated successfully"})

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500



@game_blueprint.route('/fetch-crop-price', methods=['GET'])
def fetch_crop_price():
    try:
        # Get the crop name from the query parameters
        crop_name = request.args.get('crop')
        base_price = request.args.get('base_price')
        if not isinstance(base_price, int):
            base_price = int(request.args.get('base_price'))


        # Query the database to fetch the price of the crop from the market
        market_data_access = current_app.config.get('market_data_access')
        market = market_data_access.get_market_data(crop_name)

        if market:
            # If market data exists for the crop, return its price
            if  datetime.now() - market.last_update > timedelta(minutes=4):
                market.last_update = datetime.now()

                last_count = market.prev_quantity_crop
                current_count = market.current_quantity_crop
                last_price = market.current_price
                new_price = update_price(last_count, current_count, last_price, base_price)

                # change the price based on sales and random variable
                market.current_price = new_price
                market_data_access.add_market_data(market)

            return jsonify({"price": market.current_price})
        else:
            # If market data doesn't exist, return an error message
            # No existing market data found, create a new entry with crop's base price

            new_market = Market(crop_name, base_price, 0, 0, datetime.now())
            market_data_access.add_market_data(new_market)
            return jsonify({"error": "Market data not found for the crop", "crop": crop_name, "base_price":base_price}), 404

    except Exception as e:
        # If any error occurs, return an error response
        return jsonify({"error": str(e)}), 500