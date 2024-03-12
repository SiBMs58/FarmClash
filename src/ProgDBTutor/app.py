from flask import Flask, redirect, url_for, jsonify, request
from flask_login import current_user
from config import config_data
from data_access.dbconnection import DBConnection
from data_access.user_data_access import UserDataAccess
from data_access.map_data_access import MapDataAccess
from data_access.tile_data_access import TileDataAccess
from extensions import login_manager
from views.auth import auth_blueprint
from views.game import game_blueprint


# Initialize the Flask application
app = Flask('FarmClash')
app.secret_key = config_data['secret_key']
app_data = dict()
app_data['app_name'] = config_data['app_name']
# Database connection
connection = DBConnection(dbname=config_data['dbname'], dbuser=config_data['dbuser'])
user_data_access = UserDataAccess(connection)
app.config['user_data_access'] = user_data_access
map_data_access = MapDataAccess(connection)
app.config['map_data_access'] = map_data_access
tile_data_access = TileDataAccess(connection)
app.config['tile_data_access'] = tile_data_access

# Initialize the login manager
login_manager.init_app(app)

# Blueprints
app.register_blueprint(auth_blueprint, url_prefix='/auth')
app.register_blueprint(game_blueprint, url_prefix='/game')


DEBUG = False
HOST = "127.0.0.1" if DEBUG else "0.0.0.0"


@app.route('/')
def main():
    if current_user.is_authenticated:
        return redirect(url_for('game.game'))  # Assuming 'game' is the function name for the game view
    return redirect(url_for('auth.login'))  # Assuming 'login' is the function name for the login view

@app.route('/api/users')
def get_users():
    users = user_data_access.get_all_users()  # Assuming this is a method you have
    return jsonify([user.to_dict() for user in users])  # Convert users to dicts

@app.route('/api/maps')
def get_maps():
    maps = map_data_access.get_all_maps()  # Assuming this method exists
    first_map = maps[0]
    print(first_map.to_dict())
    return jsonify([map.to_dict() for map in maps])

@app.route('/api/test', methods=['POST'])
def test_api():
    # Extract details from the request for testing
    data = request.json
    endpoint = data['endpoint']
    method = data['method']
    # Additional logic to test API request based on 'endpoint' and 'method'
    # This is a simplified placeholder. Actual implementation may vary.
    return jsonify({"success": True, "message": "API test executed"})

# RUN DEV SERVER
if __name__ == "__main__":
    app.run(HOST, debug=DEBUG)