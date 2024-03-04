from flask import Blueprint, render_template, request
from flask_login import login_user, logout_user, login_required
from models.user import User
from extensions import login_manager
auth_blueprint = Blueprint('auth', __name__, template_folder='templates')


@login_manager.user_loader
def load_user(user_id):
    return User.get(user_id)


@auth_blueprint.route('/login', methods=['GET', 'POST'])
def login():
    """error_message = None  # Initialize the error message to None
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        cur = connection.get_cursor()
        cur.execute('SELECT * FROM users WHERE username = %s', (username, ))
        user = cur.fetchone()
        cur.close()
        connection.close()

        if user and user['password'] == password:
            user_obj = User(user['username'], user['password'], user['id'])
            login_user(user_obj)
            return redirect(url_for('dashboard'))
        else:
            error_message = 'Invalid username or password'

    return render_template('login.html', error_message=error_message)"""
    pass


@auth_blueprint.route('/logout')
@login_required
def logout():
    """logout_user()
    return redirect(url_for('auth.login'))"""
    pass