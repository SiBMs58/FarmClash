from flask import Blueprint, render_template, current_app, request, jsonify, redirect, url_for
from flask_login import login_required, current_user

from config import config_data

market_blueprint = Blueprint('market', __name__, template_folder='templates')

@market_blueprint.route('/')
@login_required
def market():
    """
    Renders the market view.
    """
    if current_user.username == 'admin':
        return redirect(url_for('admin'))
    return render_template('market/market.html', app_data=config_data)

@market_blueprint.route('/animals')
@login_required
def animals():
    """
    Renders the market view.
    """
    if current_user.username == 'admin':
        return redirect(url_for('admin'))
    return render_template('market/animals.html', app_data=config_data)

@market_blueprint.route('/crops')
@login_required
def crops():
    """
    Renders the market view.
    """
    if current_user.username == 'admin':
        return redirect(url_for('admin'))
    return render_template('market/crops.html', app_data=config_data)
