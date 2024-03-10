from flask import Blueprint, render_template
from flask_login import login_required
from config import config_data

game_blueprint = Blueprint('game', __name__, template_folder='templates')

@game_blueprint.route('/')
@login_required
def game():
    return render_template('game/game.html', app_data=config_data)

@game_blueprint.route('/dashboard')
def dashboard():
    return render_template('game/dashboard.html', app_data=config_data)