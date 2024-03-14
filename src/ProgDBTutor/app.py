from flask import Flask, redirect, url_for, jsonify, request, render_template
from flask_login import current_user, login_required
from flask_principal import Principal, Permission, RoleNeed, identity_loaded, UserNeed
from config import config_data
from data_access.dbconnection import DBConnection
from data_access.user_data_access import UserDataAccess
from data_access.map_data_access import MapDataAccess
# from data_access.tile_data_access import TileDataAccess # TODO: Implement
from extensions import login_manager, werkzeug_generate_password_hash
from views.auth import auth_blueprint
from views.game import game_blueprint
from models.user import User


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
#tile_data_access = TileDataAccess(connection)
#app.config['tile_data_access'] = tile_data_access

# Insert the admin user
user_data_access.add_user(User(config_data['admin_username'], werkzeug_generate_password_hash(config_data['admin_password']), config_data['admin_email']))

# Initialize the login manager
login_manager.init_app(app)

# Initialize the principal
principals = Principal(app)
admin_permission = Permission(RoleNeed('admin'))

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

@app.route('/dashboard')
@login_required
def dashboard():
    """
    Renders the dashboard view, for a user.
    """
    return render_template('dashboard.html', app_data=app_data)

@app.route('/admin')
@login_required
@admin_permission.require(http_exception=403)
def admin():
    """
    Renders the admin dashboard view.
    """
    return render_template('admin.html', app_data=app_data)

@app.route('/api/users')
@login_required
@admin_permission.require(http_exception=403)
def get_users():
    users = user_data_access.get_all_users()  # Assuming this is a method you have
    return jsonify([user.to_dict() for user in users])  # Convert users to dicts

@app.route('/api/maps')
@login_required
@admin_permission.require(http_exception=403)
def get_maps():
    maps = map_data_access.get_all_maps()  # Assuming this method exists
    return jsonify([map.to_dict() for map in maps])

@identity_loaded.connect_via(app)
def on_identity_loaded(sender, identity):
    identity.user = current_user
    if hasattr(current_user, 'username'):
        identity.provides.add(UserNeed(current_user.username))
    if getattr(current_user, 'admin', False):
        identity.provides.add(RoleNeed('admin'))

# RUN DEV SERVER
if __name__ == "__main__":
    app.run(HOST, debug=DEBUG)