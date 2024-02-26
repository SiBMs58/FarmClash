# TUTORIAL Len Feremans, Sandy Moens and Joey De Pauw
# see tutor https://code.tutsplus.com/tutorials/creating-a-web-app-from-scratch-using-python-flask-and-mysql--cms-22972
from flask import Flask, redirect, url_for, flash
from flask.templating import render_template
from flask import request, session, jsonify
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user

from config import config_data
from user_data_access import User, DBConnection, UserDataAccess

# INITIALIZE SINGLETON SERVICES
app = Flask('FarmClash ')
app.secret_key = '*^*(*&)(*)(*afafafaSDD47j\3yX R~X@H!jmM]Lwf/,?KT'
app_data = dict()
app_data['app_name'] = config_data['app_name']
connection = DBConnection(dbname=config_data['dbname'], dbuser=config_data['dbuser'])
user_data_access = UserDataAccess(connection)

DEBUG = False
HOST = "127.0.0.1" if DEBUG else "0.0.0.0"

# Initialize login manager
login_manager = LoginManager()
login_manager.init_app(app)


# REST API
# See https://www.ibm.com/developerworks/library/ws-restful/index.html
@login_manager.user_loader
def load_user(user_id):
    return User.get(user_id)


@app.route('/users', methods=['GET'])
def get_quotes():
    # Lookup row in table Quote, e.g. 'SELECT ID,TEXT FROM Quote'
    user_objects = user_data_access.get_users()
    # Translate to json
    return jsonify([obj.to_dct() for obj in user_objects])


@app.route('/user/<int:id>', methods=['GET'])
def get_quote(id):
    # ID of quote must be passed as parameter, e.g. http://localhost:5000/quotes?id=101
    # Lookup row in table Quote, e.g. 'SELECT ID,TEXT FROM Quote WHERE ID=?' and ?=101
    user_obj = user_data_access.get_user(id)
    return jsonify(user_obj.to_dct())


# To create resource use HTTP POST
@app.route('/quotes', methods=['POST'])
def add_quote():
    # Text value of <input type="text" id="text"> was posted by form.submit
    quote_text = request.form.get('text')
    quote_author = request.form.get('author')
    # Insert this value into table Quote(ID,TEXT)
    quote_obj = User(iden=None, text=quote_text, author=quote_author)
    print('Adding {}'.format(quote_obj.to_dct()))
    quote_obj = user_data_access.add_quote(quote_obj)
    return jsonify(quote_obj.to_dct())


# VIEW
@app.route("/")
def main():
    return render_template('index.html', app_data=app_data)


@app.route("/show_quotes")
def show_quotes():
    quote_objects = user_data_access.get_users()
    # Render quote_objects "server-side" using Jinja 2 template system
    return render_template('users.html', app_data=app_data, quote_objects=quote_objects)


@app.route("/show_users_ajax")
def show_quotes_ajax():
    # Render quote_objects "server-side" using Jinja 2 template system
    return render_template('users_ajax.html', app_data=app_data)

@app.route('/login', methods=['GET', 'POST'])
def login():
    error_message = None  # Initialize the error message to None
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

    return render_template('login.html', error_message=error_message)


@app.route('/register', methods=['GET', 'POST'])
def register():
    error_message = None  # Initialize error message
    if request.method == 'POST':
        username = request.form['new_username']
        password = request.form['new_password']
        confirm_password = request.form['confirm_password']

        if password != confirm_password:
            error_message = "Passwords do not match."
        else:
            # Add new user to table
            new_user = User(username, password)
            success = user_data_access.add_user(new_user)
            if success:
                return redirect(url_for('login'))
            else:
                error_message = "Registration failed. Please try again."

    return render_template('register.html', error_message=error_message, app_data=app_data)


@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))


@app.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html', app_data=app_data, user=current_user)


# RUN DEV SERVER
if __name__ == "__main__":
    app.run(HOST, debug=DEBUG)