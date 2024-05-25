from flask import Blueprint, current_app, jsonify, abort, request
from flask_login import login_required, current_user
from threading import Lock

from services.game_services import GameServices

from src.ProgDBTutor.models.animal import Animal
from src.ProgDBTutor.models.resource import Resource
from src.ProgDBTutor.models.field import Field

api_blueprint = Blueprint('api', __name__, template_folder='templates')

# Create lock objects for concurrency control
user_lock = Lock()
map_lock = Lock()
resource_lock = Lock()
terrain_lock = Lock()
friend_lock = Lock()
message_lock = Lock()
leaderboard_lock = Lock()
building_lock = Lock()
animal_lock = Lock()
exploration_lock = Lock()

@api_blueprint.route('/users')
@login_required
def get_users():
    """
    Handles GET requests for all users. This will return a list of all users, if the logged in user is admin
    :return: A list of all users, in json format
    """
    with user_lock:
        if current_user.username != 'admin':
            return abort(403)
        user_data_access = current_app.config.get('user_data_access')
        users = user_data_access.get_all_users()
        return jsonify([user.to_dict() for user in users])

@api_blueprint.route('/maps')
@login_required
def get_maps():
    """
    Handles GET requests for all maps. This will return a list of all maps, if the logged in user is admin
    :return: A list of all maps, in json format
    """
    with map_lock:
        if current_user.username != 'admin':
            return abort(403)
        map_data_access = current_app.config.get('map_data_access')
        maps = map_data_access.get_all_maps()
        return jsonify([map.to_dict() for map in maps])

@api_blueprint.route('/resources')
@login_required
def get_all_resources():
    """
    Handles GET requests for all resources. This will return a list of all resources, if the logged in user is admin
    :return: A list of all resources, in json format
    """
    with resource_lock:
        resource_data_access = current_app.config.get('resource_data_access')
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
        return jsonify({"resource_type": resource_type, "quantity": quantity})
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
        with resource_lock:
            data = request.get_json()
            resource_data_access = current_app.config.get('resource_data_access')
            update_status = [True, 'Resources updated successfully']
            already_updated = []

            for resource_type, amount in data.items():
                updated_resource = Resource(None, current_user.username, resource_type, amount)
                update_status = resource_data_access.update_by_adding_resource(updated_resource)

                if not update_status[0]:
                    for rollback_resource in already_updated:
                        rollback_resource.amount = -rollback_resource.amount
                        resource_data_access.update_by_adding_resource(rollback_resource)
                    return jsonify({"status": "error", "message": update_status[1]}), 500
                already_updated.append(updated_resource)

            return jsonify({"status": "success", "message": update_status[1]}), 200

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
    with resource_lock:
        resource_data_access = current_app.config.get('resource_data_access')
        resources = resource_data_access.get_resources(username)
        return jsonify([resource.to_dict() for resource in resources])

@api_blueprint.route('/terrain-map')
@login_required
def get_terrain_map():
    """
    Handles GET requests for the terrain map. This will return the terrain map, if the logged in user is admin
    :return: The terrain map, in json format
    """
    with terrain_lock:
        map_data_access = current_app.config.get('map_data_access')
        map = map_data_access.get_map_by_username_owner(current_user.username)
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

@api_blueprint.route('/terrain-map/<string:friend_username>')
@login_required
def get_friend_terrain_map(friend_username):
    """
    Handles GET requests for the terrain map. This will return the terrain map, for the friend
    :return: The terrain map, in json format
    """
    with terrain_lock:
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
    with friend_lock:
        friendship_data_access = current_app.config.get('friendship_data_access')
        current_user_object = current_app.config.get('user_data_access').get_user(current_user.username)
        friends = friendship_data_access.get_friends(current_user_object)
        list_of_friends = []
        for friend in friends:
            if friend.user1 == current_user.username:
                list_of_friends.append(friend.user2)
            elif friend.user2 == current_user.username:
                list_of_friends.append(friend.user1)
        return jsonify(list_of_friends)

@api_blueprint.route('/messages/<string:friend_name>')
@login_required
def get_messages(friend_name):
    """
    Handles GET requests for all messages. This will return a list of all messages, for the current user
    :return: A list of all messages, in json format
    """
    with message_lock:
        chatmessage_data_access = current_app.config.get('chatmessage_data_access')
        current_user_object = current_app.config.get('user_data_access').get_user(current_user.username)
        friend_user_object = current_app.config.get('user_data_access').get_user(friend_name)
        messages = chatmessage_data_access.get_messages(current_user_object, friend_user_object)
        if messages:
            return jsonify([message.to_dict() for message in messages])
        else:
            return jsonify({"message": "No messages found"}), 200

@api_blueprint.route('/leaderboard')
@login_required
def get_leaderboard():
    """
    Handles GET requests for the leaderboard. This will return a list of all users, sorted by score
    :return: A list of all users, in json format
    """
    with leaderboard_lock:
        user_data_access = current_app.config.get('user_data_access')
        resource_data_access = current_app.config.get('resource_data_access')

        users = user_data_access.get_all_users()
        scores = {}
        for user in users:
            recources = resource_data_access.get_resources(user.username)
            user_score = sum([resource.amount for resource in recources])
            scores[user.username] = user_score

        sorted_users = sorted(users, key=lambda user: scores[user.username], reverse=True)
        top_three = sorted_users[:3]

        friends_response = get_friends().json
        friends = friends_response[:2]
        friend_objects = [user_data_access.get_user(friend) for friend in friends]
        leaderboard_users = top_three + friend_objects
        for leaderboard_user in leaderboard_users:
            if leaderboard_user.username == current_user.username:
                break
            leaderboard_users.append(current_user)

        unique_users = list({user.username: user for user in leaderboard_users}.values())
        ranked_users = [{'place': i + 1, 'username': user.username, 'score': scores[user.username]}
                        for i, user in enumerate(unique_users)]
        return jsonify(ranked_users)

@api_blueprint.route('/fetch-building-information', methods=['GET'])
def fetch_building_information():
    try:
        with building_lock:
            building_data_access = current_app.config.get('building_data_access')
            buildings = building_data_access.get_buildings_by_username_owner(current_user.username)

            if not buildings:
                return jsonify({"status": "No buildings", "user": current_user.username})

            building_information = {}
            for building in buildings:
                building_info = {
                    "self_key": building.building_id,
                    "general_information": building.building_type,
                    "level": building.level,
                    "augment_level": building.augment_level,
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


@api_blueprint.route('/fetch-building-information-by-type/<string:building_type>', methods=['GET'])
def fetch_building_information_by_type(building_type):
    try:
        with building_lock:
            building_data_access = current_app.config.get('building_data_access')
            buildings = building_data_access.get_buildings_by_username_and_type(current_user.username, building_type)

            if not buildings:
                return jsonify({"status": "No buildings", "type": building_type, "user": current_user.username})

            building_information = {}
            for building in buildings:
                building_info = {
                    "self_key": building.building_id,
                    "general_information": building.building_type,
                    "level": building.level,
                    "augment_level": building.augment_level,
                    "building_location": [building.x, building.y],
                    "tile_rel_locations": building.tile_rel_locations
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
        with building_lock:
            building_data_access = current_app.config.get('building_data_access')
            buildings = building_data_access.get_buildings_by_username_owner(username)

            if not buildings:
                return jsonify({"status": "No buildings", "user": username}), 404

            building_information = {}
            for building in buildings:
                building_info = {
                    "self_key": building.building_id,
                    "general_information": building.building_type,
                    "level": building.level,
                    "augment_level": building.augment_level,
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


@api_blueprint.route('/animals', methods=['GET'])
@login_required
def get_animals():
    """
    Handles GET requests for all animals. This will return a list of all animals, for the current user
    :return: A list of all animals, in json format
    """
    try:
        with animal_lock:
            animal_data_access = current_app.config.get('animal_data_access')
            animals = animal_data_access.get_animals(current_user.username)
            return jsonify([animal.to_dict() for animal in animals])
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

        with animal_lock:
            data = request.get_json()
            Idle = data['update_type'] == 'idle'
            animal_data_access = current_app.config.get('animal_data_access')

            for specie in data['species']:
                update_success = True
                if data['species'][specie][0] or Idle:
                    updated_animal = Animal(specie, current_user.username,
                                            data[specie][1] if len(data[specie]) == 2 else None,
                                            None if Idle else False)
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
        with exploration_lock:
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


@api_blueprint.route('/update-fields', methods=['POST'])
@login_required
def update_field_map():
    """
        Handles POST requests to update fields. This will update fields for the current user.
        :return: Status of the update operation, in JSON format.
        """
    try:
        # TODO: Apply concurrency lock
        data = request.get_json()
        field_data_access = current_app.config.get('field_data_access')

        for field_key, field_data in data['crop_information'].items():
            field = Field(field_data['building_name'],current_user.username, field_data['phase'], field_data['crop'], field_data['assetPhase'], field_data['time_planted'])

            #return jsonify({"status": "success", "filed": field_data}), 200
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
        # TODO: Apply concurrency lock
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
