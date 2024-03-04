from flask import Blueprint, render_template, request, redirect, url_for, flash
from flask_login import login_user, logout_user, login_required
from werkzeug.security import check_password_hash
from data_access.dbconnection import DBConnection
from config import config_data
from models.user import User
from extensions import login_manager
auth_blueprint = Blueprint('auth', __name__, template_folder='templates')


@login_manager.user_loader
def load_user(user_id):
    return User.get(user_id)


@auth_blueprint.route('/login', methods=['GET', 'POST'])
def login():
    error_message = None  # Initialize the error message to None
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        conn = DBConnection().get_connection()
        cur = conn.cursor()
        cur.execute("SELECT * FROM users WHERE username = %s", (username,))
        user_record = cur.fetchone()
        cur.close()
        conn.close()

        if user_record and check_password_hash(user_record['password'], password):
            # Assuming you have a way to create a `User` object from `user_record`
            user_obj = User(id=user_record['id'], username=user_record['username'], password=user_record['password'])
            login_user(user_obj)
            return redirect(url_for('game.dashboard'))
        else:
            error_message = 'Invalid username or password.'
    return render_template('auth/login.html', error_message=error_message, app_name=config_data)


@auth_blueprint.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        # Your registration logic here...
        pass

    return render_template('register.html')

@auth_blueprint.route('/logout')
@login_required
def logout():
    """logout_user()
    return redirect(url_for('auth.login'))"""
    pass