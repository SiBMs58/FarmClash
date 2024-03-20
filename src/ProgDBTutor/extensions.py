from flask_login import LoginManager
from werkzeug.security import check_password_hash, generate_password_hash

login_manager = LoginManager()

werkzeug_generate_password_hash = generate_password_hash
werkzeug_check_password_hash = check_password_hash