from flask import Blueprint, current_app, jsonify, abort
from flask_login import login_required, current_user

from services.game_services import GameServices

api_blueprint = Blueprint('api', __name__, template_folder='templates')


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
    game_services = GameServices(current_app.config.get('user_data_access'), current_app.config.get('map_data_access'),
                                 current_app.config.get('tile_data_access'),
                                 current_app.config.get('resource_data_access'), current_app.config.get('animal_data_access'))
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
    game_services = GameServices(current_app.config.get('user_data_access'), current_app.config.get('map_data_access'),
                                 current_app.config.get('tile_data_access'),
                                 current_app.config.get('resource_data_access'), current_app.config.get('animal_data_access'))
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
    return jsonify(list_of_friends)


@api_blueprint.route('/messages/<string:friend_name>')
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


@api_blueprint.route('/leaderboard')
@login_required
def get_leaderboard():
    """
    Handles GET requests for the leaderboard. This will return a list of all users, sorted by score
    :return: A list of all users, in json format
    """
    user_data_access = current_app.config.get('user_data_access')
    resource_data_access = current_app.config.get('resource_data_access')

    users = user_data_access.get_all_users()
    scores = {}
    for user in users:
        recources = resource_data_access.get_resources(user.username)
        user_score = sum([resource.amount for resource in recources])
        scores[user.username] = user_score
    # Sort users based on their scores stored in the scores dictionary
    sorted_users = sorted(users, key=lambda user: scores[user.username], reverse=True)
    # Get the top 3 users
    top_three = sorted_users[:3]
    # Get two friends (implementation depends on your data model)
    friends_response = get_friends().json
    friends = friends_response[:2]  # Assume the response is a list of usernames and we need the first two
    # Ensure current user is included
    friend_objects = [user_data_access.get_user(friend) for friend in friends]
    leaderboard_users = top_three + friend_objects
    for leaderboard_user in leaderboard_users:
        if leaderboard_user.username == current_user.username:
            break
        leaderboard_users.append(current_user)
    # Remove duplicates and create ranked list
    unique_users = list({user.username: user for user in leaderboard_users}.values())
    ranked_users = [{'place': i + 1, 'username': user.username, 'score': scores[user.username]}
                    for i, user in enumerate(unique_users)]
    return jsonify(ranked_users)


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


@api_blueprint.route('/exploration')
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


@api_blueprint.route('/animals')
@login_required
def get_animals():
    """
    Handles GET requests for all animals. This will return a list of all animals, for the current user
    :return: A list of all animals, in json format
    """
    animal_data_access = current_app.config.get('animal_data_access')
    animals = animal_data_access.get_animals_by_username_owner(current_user.username)
    return jsonify([animal.to_dict() for animal in animals])

