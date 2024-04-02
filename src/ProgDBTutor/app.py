from flask import Flask, redirect, url_for, render_template, request
from flask_login import current_user, login_required
from config import config_data
from data_access.dbconnection import DBConnection
from data_access.user_data_access import UserDataAccess
from data_access.map_data_access import MapDataAccess
from data_access.tile_data_access import TileDataAccess
from data_access.resource_data_access import ResourceDataAccess
from data_access.friendship_data_access import FriendshipDataAccess
from data_access.chatmessage_data_access import ChatMessageDataAccess
from extensions import login_manager, werkzeug_generate_password_hash
from views.auth import auth_blueprint
from views.game import game_blueprint
from views.api import api_blueprint
from views.friends import friends_blueprint
from views.market import market_blueprint
from models.user import User
from extensions import login_manager

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
resource_data_access = ResourceDataAccess(connection)
app.config['resource_data_access'] = resource_data_access
friendship_data_access = FriendshipDataAccess(connection)
app.config['friendship_data_access'] = friendship_data_access
chatmessage_data_access = ChatMessageDataAccess(connection)
app.config['chatmessage_data_access'] = chatmessage_data_access

# Insert the admin user
user_data_access.add_user(
    User(config_data['admin_username'], werkzeug_generate_password_hash(config_data['admin_password']),
         config_data['admin_email']))

# Initialize the login manager
login_manager.init_app(app)

# Blueprints
app.register_blueprint(auth_blueprint, url_prefix='/auth')
app.register_blueprint(game_blueprint, url_prefix='/game')
app.register_blueprint(api_blueprint, url_prefix='/api')
app.register_blueprint(market_blueprint, url_prefix='/market')
app.register_blueprint(friends_blueprint, url_prefix='/friends')

DEBUG = False
HOST = "127.0.0.1" if DEBUG else "0.0.0.0"


@app.route('/')
def main():
    """
    This is the main view.
    :return: Send to game view if logged in, else send to login view
    """
    if current_user.is_authenticated:
        return redirect(url_for('game.game'))  # Assuming 'game' is the function name for the game view
    return redirect(url_for('auth.login'))  # Assuming 'login' is the function name for the login view


@app.route('/friends')
@login_required
def friends():
    """
    Renders the dashboard view, for a user.
    """
    if current_user.username == 'admin':
        return redirect(url_for('admin'))
    return render_template('friends.html', app_data=app_data)


@app.route('/settings')
@login_required
def settings():
    """
    Renders the settings view, for a user.
    """
    if current_user.username == 'admin':
        return redirect(url_for('admin'))
    return render_template('settings.html', app_data=app_data)


@app.route('/attack')
@login_required
def attack():
    """
    Renders the attack dashboard view.
    """
    if current_user.username == 'admin':
        return redirect(url_for('admin'))
    return render_template('attack.html', app_data=app_data)


@app.route('/admin')
@login_required
def admin():
    """
    Renders the admin dashboard view.
    """
    if current_user.username != 'admin':
        return redirect(url_for('dashboard'))
    return render_template('admin.html', app_data=app_data)


@app.route('/jasmine_tests')
@login_required
def jasmine_tests():
    """
    Renders the jasmine tests view.
    """
    if current_user.username != 'admin':
        return redirect(url_for('dashboard'))
    return render_template('jasmine-tests.html', app_data=app_data)


@login_manager.user_loader
def load_user(username):
    """
    This function is a user loader for the login manager. It takes a username as a parameter and returns the user data accessed using the username.
    """
    return user_data_access.get_user(username)


@app.context_processor
def inject_base_url():
    return dict(base_url=request.url_root)


# RUN DEV SERVER
if __name__ == "__main__":
    app.run(HOST, debug=DEBUG)
