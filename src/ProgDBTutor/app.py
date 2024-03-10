from flask import Flask
from config import config_data
from data_access.dbconnection import DBConnection
from data_access.user_data_access import UserDataAccess
from extensions import login_manager
from views.auth import auth_blueprint


# Initialize the Flask application
app = Flask('FarmClash')
app.secret_key = config_data['secret_key']
app_data = dict()
app_data['app_name'] = config_data['app_name']
# Database connection
connection = DBConnection(dbname=config_data['dbname'], dbuser=config_data['dbuser'])
user_data_access = UserDataAccess(connection)

# Initialize the login manager
login_manager.init_app(app)

# Blueprints
app.register_blueprint(auth_blueprint, url_prefix='/auth')


DEBUG = False
HOST = "127.0.0.1" if DEBUG else "0.0.0.0"

from flask import render_template
@app.route("/")
def main():
    return render_template('index.html', app_data=app_data)

# TEST FILES VAN JOREN
@app.route("/test")
def test():
    return render_template('JorenTestFiles/game.html')

# RUN DEV SERVER
if __name__ == "__main__":
    app.run(HOST, debug=DEBUG)