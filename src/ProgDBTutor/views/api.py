import json
import os

from flask import Blueprint, current_app, jsonify, abort, request
from flask_login import login_required, current_user

from services.game_services import GameServices

from models.animal import Animal
from models.resource import Resource
from models.exploration import Exploration
from models.field import Field

api_blueprint = Blueprint('api', __name__, template_folder='templates')

crops = ['Wheat', 'Carrot', 'Corn', 'Lettuce', 'Tomato', 'Turnip', 'Zucchini', 'Parsnip', 'Cauliflower', 'Eggplant']


def read_json_file(file_path):
    with open(file_path, 'r') as file:
        return json.load(file)


def get_augmentation_value(building_type, augmentation_type):
    buildingData = read_json_file(os.path.join(current_app.root_path, "static", "img", "assets", "building.json"))
    augmentation = buildingData[building_type].get('augment', False)
    if not augmentation:
        return 0
    for aug_type, value in augmentation:
        if aug_type == augmentation_type:
            return value
    return 0


def get_stats_value(building_type, stats_type, level):
    buildingData = read_json_file(os.path.join(current_app.root_path, "static", "img", "assets", "building.json"))
    stats = buildingData[building_type].get('other_stats', False)
    if not stats:
        return 0
    for stat_type, values in stats:
        if stat_type == stats_type:
            return values[level]
    return 0


@api_blueprint.route('/users')
@login_required
def get_users():
    """
    Handles GET requests for all users. This will return a list of all users, if the logged in user is admin
    :return: A list of all users, in json format
    """
    if current_user.username != 'admin':
        return 403
    user_data_access = current_app.config.get('user_data_access')
    users = user_data_access.get_all_users()  # Assuming this is a method you have
    return jsonify([user.to_dict() for user in users])  # Convert users to dicts


def user_stats(username):
    """
    Calculate the stats of a user.
    :param username: The username of the user whose stats are being requested.
    :return: The stats of a user, in JSON format
    """
    atk = 0
    defn = 0
    level = 0
    try:
        # Safely retrieve Money resource
        money_resource = current_app.config.get('resource_data_access').get_resource_by_type(username, 'Money')
        coins = money_resource.amount if money_resource and money_resource.amount is not None else 0

        buildings = current_app.config.get('building_data_access').get_buildings_by_username_owner(username) or []
        animals = current_app.config.get('animal_data_access').get_animals(username) or []
        townhallList = current_app.config.get('building_data_access').get_buildings_by_username_and_type(username, "Townhall") or []

        if townhallList:
            level = townhallList[0].level or 0

        for building in buildings:
            if building.unlock_level > level:
                continue
            atk_value = get_stats_value(building.building_type, 'Attack', building.level) or 0
            atk_augment = get_augmentation_value(building.building_type, 'Attack') or 0
            defn_value = get_stats_value(building.building_type, 'Defense', building.level) or 0
            defn_augment = get_augmentation_value(building.building_type, 'Defense') or 0
            atk += atk_value + building.augment_level * atk_augment
            defn += defn_value + building.augment_level * defn_augment

        for animal in animals:
            if animal.amount is None:
                continue
            species_augments = {
                "Chicken": 'Chickencoop',
                "Cow": 'Cowbarn',
                "Pig": 'Pigpen',
                "Goat": 'Goatbarn'
            }
            species_building = species_augments.get(animal.species)
            if species_building:
                defn += animal.amount * (get_augmentation_value(species_building, 'Defense') or 0)
                atk += animal.amount * (get_augmentation_value(species_building, 'Attack') or 0)

        return {
            "level": level,
            "attack": atk,
            "defense": defn,
            "coins": coins
        }
    except Exception as e:
        return {"error": str(e)}



@api_blueprint.route('/get-user-stats', methods=['GET'])
@login_required
def get_user_stats():
    """
    Handles GET requests for the stats of the current user.
    :return: The stats of the current user, in json format
    """
    return jsonify(user_stats(current_user.username))


@api_blueprint.route('/maps')
@login_required
def get_maps():
    """
    Handles GET requests for all maps. This will return a list of all maps, if the logged in user is admin
    :return: A list of all maps, in json format
    """
    if current_user.username != 'admin':
        return 403
    map_data_access = current_app.config.get('map_data_access')
    maps = map_data_access.get_all_maps()  # Assuming this method exists
    return jsonify([map.to_dict() for map in maps])


@api_blueprint.route('/resources')
@login_required
def get_all_resources():
    """
    Handles GET requests for all resources. This will return a list of all resources, if the logged in user is admin
    :return: A list of all resources, in json format
    """
    resource_data_access = current_app.config.get('resource_data_access')
    # Fetch resources for the specified username instead of the current user
    resources = resource_data_access.get_resources(current_user.username)
    return jsonify([resource.to_dict() for resource in resources])


@api_blueprint.route('/api/single-resource-quantity', methods=['GET'])
@login_required
def get_resource_quantity():
    """
    Handles GET requests for the quantity of a specific resource.
    This will return the quantity of the requested resource for the current logged-in user.
    :return: The quantity of the resource in JSON format
    """
    # TODO: Apply concurrency lock
    resource_data_access = current_app.config.get('resource_data_access')

    # Get resource type from query parameters
    resource_type = request.args.get('resource_type')

    if not resource_type:
        return jsonify({"error": "resource_type query parameter is required"}), 400

    # Fetch resource quantity for the current user
    quantity = resource_data_access.get_resource_quantity(current_user.username, resource_type)

    if quantity is not None:
        return jsonify({"resource_type": resource_type, "quantity": quantity}), 200
    else:
        return jsonify({"resource_type": "resource not found", "quantity": 0}), 404


@api_blueprint.route('/add-resources', methods=['POST'])
@login_required
def add_resources():
    """
    Handles POST requests to update animals. This will update animals for the current user if a change in amount has been made
    use this for
    :return: Status of the update operation, in json format
    """
    try:
        data = request.get_json()
        resource_data_access = current_app.config.get('resource_data_access')
        update_status = True
        rollback = []
        Idle = data.get('idle', False)  # Get the value of 'idle' key, default to False if not present

        for resource_type, amount in data.items():
            if resource_type == 'idle':
                continue

            updated_resource = Resource(current_user.username, resource_type, amount, None if Idle else False)
            rollback.append(resource_data_access.get_resource_by_type(current_user.username, resource_type))
            update_status = resource_data_access.update_by_adding_resource(updated_resource, get_resource_category_limit(resource_type))

            if not update_status:
                for resource in rollback:
                    resource.amount = -resource.amount
                    resource_data_access.update_by_adding_resource(resource)
                return jsonify({"status": "error", "message": "resources updated cancelled and rollbacked"}), 500

        return jsonify({"status": "success", "message": "resources updated successfully"}), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@api_blueprint.route('/resources/<string:username>')
@login_required
def get_resources(username):
    """
    Handles GET requests for all resources. This will return a list of all resources for the specified user.
    :param username: The username of the user whose resources are being requested.
    :return: A list of all resources for the specified user, in json format.
    """
    resource_data_access = current_app.config.get('resource_data_access')
    # Fetch resources for the specified username instead of the current user
    resources = resource_data_access.get_resources(username)

    return jsonify([resource.to_dict() for resource in resources])


@api_blueprint.route('/animals', methods=['GET'])
@login_required
def get_animals():
    """
    Handles GET requests for all animals. This will return a list of all animals, for the current user
    :return: A list of all animals, in json format
    """
    try:
        animal_data_access = current_app.config.get('animal_data_access')
        animals = animal_data_access.get_animals(current_user.username)
        return jsonify([animal.to_dict() for animal in animals])
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@api_blueprint.route('/add-animals', methods=['POST'])
@login_required
def add_animals():
    """
    Handles POST requests to update animals. This will update animals for the current user if a change in amount has been made
    use this for
    :return: Status of the update operation, in json format
    """
    try:
        data = request.get_json()
        animal_data_access = current_app.config.get('animal_data_access')

        Idle = data.get('idle', False)  # Get the value of 'idle' key, default to False if not present
        for specie in data:
            if specie == 'idle':
                continue

            updated_animal = Animal(current_user.username, specie, data.get(specie, 0), None if Idle else False)
            update_success = animal_data_access.update_animal_by_adding(updated_animal, get_animal_limit(specie))

        return jsonify({"status": "success", "message": "Animal updated successfully"}), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@api_blueprint.route('/terrain-map')
@login_required
def get_terrain_map():
    """
    Handles GET requests for the terrain map. This will return the terrain map, if the logged in user is admin
    :return: The terrain map, in json format
    """
    map_data_access = current_app.config.get('map_data_access')
    map = map_data_access.get_map_by_username_owner(current_user.username)  # TODO: Handle more maps than one
    if map is None:
        return "No maps found", 404
    # for map in maps:
    tile_data_access = current_app.config.get('tile_data_access')
    tiles = tile_data_access.get_tiles_by_map_id(map.map_id)
    game_services = GameServices(current_app.config.get('user_data_access'),
                                 current_app.config.get('map_data_access'),
                                 current_app.config.get('tile_data_access'),
                                 current_app.config.get('resource_data_access'),
                                 current_app.config.get('animal_data_access'),
                                 current_app.config.get('building_data_access'))
    formatted_terrain_map = game_services.reformat_terrain_map(tiles, map.width, map.height)
    return jsonify(formatted_terrain_map)


@api_blueprint.route('/terrain-map/<string:friend_username>')
@login_required
def get_friend_terrain_map(friend_username):
    """
    Handles GET requests for the terrain map. This will return the terrain map, for the friend
    :return: The terrain map, in json format
    """
    map_data_access = current_app.config.get('map_data_access')
    map = map_data_access.get_map_by_username_owner(friend_username)
    if map is None:
        return "No maps found", 404
    tile_data_access = current_app.config.get('tile_data_access')
    tiles = tile_data_access.get_tiles_by_map_id(map.map_id)
    game_services = GameServices(current_app.config.get('user_data_access'),
                                 current_app.config.get('map_data_access'),
                                 current_app.config.get('tile_data_access'),
                                 current_app.config.get('resource_data_access'),
                                 current_app.config.get('animal_data_access'),
                                 current_app.config.get('building_data_access'))
    formatted_terrain_map = game_services.reformat_terrain_map(tiles, map.width, map.height)
    return jsonify(formatted_terrain_map)


@api_blueprint.route('/friends')
@login_required
def get_friends():
    """
    Handles GET requests for all friends. This will return a list of all friends, for the current user
    :return: A list of all friends, in json format
    """
    friendship_data_access = current_app.config.get('friendship_data_access')
    current_user_object = current_app.config.get('user_data_access').get_user(current_user.username)
    friends = friendship_data_access.get_friends(current_user_object)
    list_of_friends = []
    for friend in friends:
        if friend.user1 == current_user.username:
            list_of_friends.append(friend.user2)
        elif friend.user2 == current_user.username:
            list_of_friends.append(friend.user1)
    # Be sure to remove duplicates
    list_of_friends = list(set(list_of_friends))
    return jsonify(list_of_friends)


@api_blueprint.route('/messages/<string:friend_name>', methods=['GET'])
@login_required
def get_messages(friend_name):
    """
    Handles GET requests for all messages. This will return a list of all messages, for the current user
    :return: A list of all messages, in json format
    """
    chatmessage_data_access = current_app.config.get('chatmessage_data_access')
    current_user_object = current_app.config.get('user_data_access').get_user(current_user.username)
    friend_user_object = current_app.config.get('user_data_access').get_user(friend_name)
    messages = chatmessage_data_access.get_messages(current_user_object, friend_user_object)
    if messages:
        return jsonify([message.to_dict() for message in messages])
    else:
        return jsonify({"message": "No messages found"}), 200  # Consider returning an empty list with a 200 OK


@api_blueprint.route('/leaderboard', methods=['GET'])
@login_required
def get_leaderboard():
    """
    Handles GET requests for the leaderboard. This will return a list of all users, sorted by score
    :return: A list of all users, in json format
    """
    try:
        user_data_access = current_app.config.get('user_data_access')
        resource_data_access = current_app.config.get('resource_data_access')

        users = user_data_access.get_all_users()
        users = [user for user in users if user.username != 'admin']     # Filter out the admin user
        scores = {}
        for user in users:
            try:
                user_stats_result = user_stats(user.username)  # Calculate stats using user_stats function
                # Example scoring formula: level * 10 + attack + defense + coins
                user_score = (user_stats_result['level'] * 10 +
                              user_stats_result['attack'] +
                              user_stats_result['defense'] +
                              user_stats_result['coins'])
                scores[user.username] = user_score
            except Exception as e:
                print(f"Error calculating score for user {user.username}: {str(e)}")
                continue # Skip this user if an error occurs
        # Sort users based on their scores stored in the scores dictionary
        sorted_users = sorted(users, key=lambda user: scores[user.username], reverse=True)
        # Get the top 3 users
        top_three = sorted_users[:3]
        # Get two friends (implementation depends on your data model)
        friendship_data_access = current_app.config.get('friendship_data_access')
        friends_response = friendship_data_access.get_friends(current_user)
        friends = friends_response[:2]  # Assume the response is a list of usernames and we need the first two
        # Ensure current user is included
        friend_objects = [user_data_access.get_user(friend) for friend in friends]
        leaderboard_users = top_three + friend_objects
        for leaderboard_user in leaderboard_users:
            if leaderboard_user.username == current_user.username:
                break
        else:
            leaderboard_users.append(current_user)
        # Remove duplicates and create ranked list
        unique_users = list({user.username: user for user in leaderboard_users}.values())
        ranked_users = [{'place': i + 1, 'username': user.username, 'score': scores[user.username]}
                        for i, user in enumerate(unique_users)]
        return jsonify(ranked_users)
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@api_blueprint.route('/fetch-building-information', methods=['GET'])
def fetch_building_information():
    try:
        building_data_access = current_app.config.get('building_data_access')
        # Fetch building information based on username
        buildings = building_data_access.get_buildings_by_username_owner(current_user.username)

        # If no buildings found, return appropriate JSON response
        if not buildings:
            return jsonify({"status": "No buildings", "user": current_user.username})

        # Construct the final JSON response
        building_information = {}
        for building in buildings:
            building_info = {
                "self_key": building.building_id,
                "general_information": building.building_type,
                "level": building.level,
                "augment_level": building.augment_level,
                "building_location": [building.x, building.y],
                "unlock_level": building.unlock_level
            }
            building_information[building.building_id] = building_info

        json_response = {
            "building_information": building_information
        }

        return jsonify(json_response)

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@api_blueprint.route('/fetch-building-information-by-type/<string:building_type>', methods=['GET'])
def fetch_building_information_by_type(building_type):
    try:
        building_data_access = current_app.config.get('building_data_access')
        # Fetch building information based on username and building type
        buildings = building_data_access.get_buildings_by_username_and_type(current_user.username, building_type)

        # If no buildings found, return appropriate JSON response
        if not buildings:
            return jsonify({"status": "No buildings", "type": building_type, "user": current_user.username})

        # Construct the final JSON response
        building_information = {}
        for building in buildings:
            building_info = {
                "self_key": building.building_id,
                "general_information": building.building_type,
                "level": building.level,
                "augment_level": building.augment_level,
                "building_location": [building.x, building.y],
                "unlock_level": building.unlock_level
            }
            building_information[building.building_id] = building_info

        json_response = {
            "status": "success",
            "user": current_user.username,
            "type": building_type,
            "building_information": building_information
        }

        return jsonify(json_response)

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@api_blueprint.route('/fetch-building-information/<string:username>', methods=['GET'])
@login_required
def fetch_building_information_for_user(username):
    """
    Handles GET requests for fetching building information for a specific user.
    :param username: The username of the user whose building information is being fetched.
    :return: A JSON response containing the building information for the specified user.
    """
    try:
        building_data_access = current_app.config.get('building_data_access')
        # Fetch building information based on the username passed in the URL
        buildings = building_data_access.get_buildings_by_username_owner(username)

        # If no buildings found, return appropriate JSON response
        if not buildings:
            return jsonify({"status": "No buildings", "user": username}), 404

        # Construct the final JSON response
        building_information = {}
        for building in buildings:
            building_info = {
                "self_key": building.building_id,
                "general_information": building.building_type,
                "level": building.level,
                "augment_level": building.augment_level,
                "building_location": [building.x, building.y],
                "unlock_level": building.unlock_level
            }
            building_information[building.building_id] = building_info

        json_response = {
            "building_information": building_information
        }

        return jsonify(json_response)

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@api_blueprint.route('/update-animals', methods=['POST'])
@login_required
def update_animals():
    """
    Handles POST requests to update animals. This will update animals for the current user if a change in amount has been made
    use this for
    :return: Status of the update operation, in json format
    """
    try:
        # TODO for FERHAT: add logica to limit the animal specie to the sum of levels of the appropiate buildings
        #  i.e if the user has 3 unlocked pigpens one of level 2, one of level 6, and one level 10, pigs are limited to 18

        data = request.get_json()
        Idle = data['update_type'] == 'idle'
        animal_data_access = current_app.config.get('animal_data_access')

        for specie in data['species']:
            update_success = True
            if data['species'][specie][0] or Idle:
                updated_animal = Animal(specie, current_user.username,
                                        data[specie][1] if len(data[specie]) == 2 else None, None if Idle else False)
                update_success = animal_data_access.update_animal(updated_animal)

            if not update_success:
                return jsonify({"status": "error", "message": f"Failed to update animal {specie}"}), 500

        return jsonify({"status": "success", "message": "Animal updated successfully"}), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@api_blueprint.route('/exploration', methods=['GET'])
@login_required
def get_exploration():
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


@api_blueprint.route('/start-exploration', methods=['POST'])
@login_required
def start_exploration():
    """
    Handles POST requests for starting an exploration
    """
    exploration_data_access = current_app.config.get('exploration_data_access')
    data = request.get_json()

    if exploration_data_access.start_exploration(
            Exploration(current_user.username, data['chickens'], data['goats'], data['pigs'], data['cows'],
                        data['exploration_level'], data['augment_level'], data['remaining_time'])):
        return jsonify({'status': 'success', 'message': 'Exploration started successfully.'})
    else:
        return jsonify({'status': 'error', 'message': 'Failed to start exploration.'}), 500


@api_blueprint.route('/stop-exploration', methods=['POST'])
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


@api_blueprint.route('/update-augment-level/<string:building_id>', methods=['POST'])
@login_required
def augment_building_by_id(building_id):
    """
    Handles POST requests for updating a buildings augment level
    """
    building_data_access = current_app.config.get('building_data_access')
    resource_data_access = current_app.config.get('resource_data_access')
    data = request.get_json()

    Money = resource_data_access.get_resource_by_type(current_user.username, 'Money').amount
    if Money < data["cost"]:
        return jsonify({'status': 'unsuccessful', 'message': 'Not enough money to augment building.'}), 200

    if building_data_access.update_augment_level(building_id, data["augment_level"], current_user.username):
        resource_data_access.update_by_adding_resource(Resource(current_user.username, 'Money', -data["cost"]),
                                                       float('inf'))
        return jsonify({'status': 'success', 'message': 'building successfully augmented.'})
    else:
        return jsonify({'status': 'error', 'message': 'Failed to augment successfully.'}), 500


def get_resource_category_limit(resource_type):
    def get_barn_limit(building_level, building_augment_level):
        barn_limit = get_stats_value('Barn', 'Capacity', building_level)
        if barn_limit == "inf":
            return float('inf')
        return barn_limit + building_augment_level * get_augmentation_value('Barn', 'Capacity')

    def get_silo_limit(building_level, building_augment_level):
        silo_limit = get_stats_value('Silo', 'Capacity', building_level)
        if silo_limit == "inf":
            return float('inf')
        return silo_limit + building_augment_level * get_augmentation_value('Silo', 'Capacity')

    limit = 0
    if resource_type == 'Money':
        return float('inf')

    if resource_type in crops:
        building = current_app.config.get('building_data_access').get_buildings_by_username_and_type(current_user.username,"Silo")[0]
        return get_silo_limit(building.level, building.augment_level)

    building = current_app.config.get('building_data_access').get_buildings_by_username_and_type(current_user.username,"Barn")[0]
    return get_barn_limit(building.level, building.augment_level)


def get_animal_limit(animal):
    buildings = []
    building_data_access = current_app.config.get('building_data_access')
    if animal == 'Chicken':
        buildings = building_data_access.get_buildings_by_username_and_type(current_user.username, "Chickencoop")
    elif animal == 'Cow':
        buildings = building_data_access.get_buildings_by_username_and_type(current_user.username, "Cowbarn")
    elif animal == 'Goat':
        buildings = building_data_access.get_buildings_by_username_and_type(current_user.username, "Goatbarn")
    elif animal == 'Pig':
        buildings = building_data_access.get_buildings_by_username_and_type(current_user.username, "Pigpen")
    else:
        return 0

    limit = 0
    for building in buildings:
        limit += building.level * 2
    return limit


@api_blueprint.route('/update-fields', methods=['POST'])
@login_required
def update_field_map():
    """
        Handles POST requests to update fields. This will update fields for the current user.
        :return: Status of the update operation, in JSON format.
        """
    try:
        data = request.get_json()
        field_data_access = current_app.config.get('field_data_access')

        for field_key, field_data in data['crop_information'].items():
            field = Field(field_data['building_name'], current_user.username, field_data['phase'], field_data['crop'],
                          field_data['assetPhase'], field_data['time_planted'])

            # return jsonify({"status": "success", "filed": field_data}), 200
            update_success = field_data_access.add_or_update_field(field)

            if not update_success:
                return jsonify({"status": "error", "message": f"Failed to update field {field_key}"}), 500

        return jsonify({"status": "success", "message": "Fields updated successfully"}), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@api_blueprint.route('/fetch-crop-information', methods=['GET'])
@login_required
def fetch_crop_information():
    """
    Handles GET requests to fetch crop information for the current user.
    :return: Crop information in JSON format.
    """
    try:
        field_data_access = current_app.config.get('field_data_access')
        username_owner = current_user.username
        fields = field_data_access.get_fields_by_username_owner(username_owner)

        crop_information = {
            field.building_name: {
                'building_name': field.building_name,
                'phase': field.phase,
                'crop': field.crop,
                'assetPhase': field.asset_phase,
                'time_planted': field.time_planted
            }
            for field in fields
        }

        return jsonify({'crop_information': crop_information}), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
