from flask import Blueprint, render_template, request, redirect, url_for, current_app
from flask_login import login_user, logout_user, login_required

from models.user import User
from extensions import login_manager, werkzeug_check_password_hash
from config import config_data
from services.game_services import GameServices

auth_blueprint = Blueprint('auth', __name__, template_folder='templates')


@login_manager.user_loader
def load_user(username):
    user_data_access = current_app.config.get('user_data_access')
    return user_data_access.get_user(username)


@auth_blueprint.route('/login', methods=['GET', 'POST'])
def login():
    error_message = None
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        user_data_access = current_app.config.get('user_data_access')
        user_record = user_data_access.get_user(username)


        if user_record and werkzeug_check_password_hash(user_record.password, password):
            login_user(user_record)

            if user_record.username == 'admin':
                return redirect(url_for('admin.admin'))
            else:
                return redirect(url_for('user.user_dashboard'))

        else:
            error_message = 'Invalid username or password.'
    return render_template('auth/login.html', error_message=error_message, app_name=config_data['app_name'])


@auth_blueprint.route('/register', methods=['GET', 'POST'])
def register():
    error_message = None
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        email = request.form.get('email')  # Assuming you're collecting email too

        user_data_access = current_app.config.get('user_data_access')
        success = user_data_access.add_user(User(username, password, email))

        if success:
            # TODO: Send confiration e-mail
            """new_user_id = user_data_access.get_user_by_username(username).user_id
            map_data_access = current_app.config.get('map_data_access')
            tile_data_access = current_app.config.get('tile_data_access')
            gameservices = GameServices(user_data_access, map_data_access, tile_data_access)
            gameservices.create_default_map(new_user_id)"""

            return redirect(url_for('auth.login'))
        else:
            error_message = 'Failed to register user, try a different username.'

    return render_template('auth/register.html', error_message=error_message, app_name=config_data['app_name'])


@auth_blueprint.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('auth.login'))
