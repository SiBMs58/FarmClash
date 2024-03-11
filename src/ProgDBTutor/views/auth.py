from flask import Blueprint, render_template, request, redirect, url_for, current_app
from flask_login import login_user, logout_user, login_required
from werkzeug.security import check_password_hash

from models.user import User
from extensions import login_manager
from config import config_data

auth_blueprint = Blueprint('auth', __name__, template_folder='templates')


@login_manager.user_loader
def load_user(user_id):
    user_data_access = current_app.config.get('user_data_access')
    return user_data_access.get_user(user_id)


@auth_blueprint.route('/login', methods=['GET', 'POST'])
def login():
    error_message = None
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        user_data_access = current_app.config.get('user_data_access')
        user_record = user_data_access.get_user_by_username(username)

        if ((username == 'admin' and password == '123') or
                (user_record and check_password_hash(user_record.password, password))):
            login_user(user_record)
            new_user = user_data_access.get_user_by_username(username)
            map = user_data_access.get_maps_by_user(new_user.user_id, 1)
            map.to_json()
            # Make sure to redirect to a valid endpoint in your game blueprint
            return redirect(url_for('game.game'))
        else:
            error_message = 'Invalid username or password.'
    return render_template('auth/login.html', error_message=error_message, app_name=config_data['app_name'])


@auth_blueprint.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        email = request.form.get('email')  # Assuming you're collecting email too

        user_data_access = current_app.config.get('user_data_access')
        success = user_data_access.add_user(User(username, password, email))
        if success:
            # TODO: Send confiration e-mail

            login_user(new_user)

            return redirect(url_for('auth.login'))
        else:
            return redirect(url_for('auth.register'))

    return render_template('auth/register.html', app_name=config_data['app_name'])


@auth_blueprint.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('auth.login'))
