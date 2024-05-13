from flask import Blueprint, redirect, url_for, render_template, request, jsonify, current_app
from flask_login import login_required, current_user


book_blueprint = Blueprint('books', __name__, template_folder='templates')

@book_blueprint.route('/book')
@login_required
def book():
    return render_template('books/book.html')
