from flask import Blueprint, current_app, jsonify, abort
from flask_login import login_required, current_user

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
    if current_user.username != 'admin':
        return 403
    resource_data_access = current_app.config.get('resource_data_access')
    resources = resource_data_access.get_all_resources()
    return jsonify([resource.to_dict() for resource in resources])

@api_blueprint.route('/terrain-map')
@login_required
def get_terrain_map():
    """
    Handles GET requests for the terrain map. This will return the terrain map, if the logged in user is admin
    :return: The terrain map, in json format
    """
    map_data_access = current_app.config.get('map_data_access')
    maps = map_data_access.get_maps_by_username_owner(current_user.username)
    if maps is None:
        return "No maps found", 404
    for map in maps:
        tile_data_access = current_app.config.get('tile_data_access')
        tiles = tile_data_access.get_tiles_by_map_id(map.map_id)
        return jsonify([tile.to_dict() for tile in tiles])


@api_blueprint.route('/resources/<string:username>')
@login_required
def get_resources(username):
    """
    Handles GET requests for all resources. This will return a list of all resources for the specified user.
    :param username: The username of the user whose resources are being requested.
    :return: A list of all resources for the specified user, in json format.
    """
    # Check if the current user is allowed to fetch resources for the specified username
    if current_user.username != username and not current_user.is_admin():
        # If not, return a 403 Forbidden response
        abort(403)

    resource_data_access = current_app.config.get('resource_data_access')
    # Fetch resources for the specified username instead of the current user
    resources = resource_data_access.get_resources(username)

    return jsonify([resource.to_dict() for resource in resources])

