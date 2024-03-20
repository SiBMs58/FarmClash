import pytest
from unittest.mock import MagicMock, patch
from datetime import datetime
from werkzeug.security import check_password_hash, generate_password_hash
from data_access.user_data_access import UserDataAccess
from models.user import User


@pytest.fixture
def mock_db_connection():
    connection = MagicMock()
    connection.get_cursor.return_value = MagicMock()
    return connection


@pytest.fixture
def user_data_access(mock_db_connection):
    return UserDataAccess(mock_db_connection)


def test_add_user_adds_successfully(user_data_access, mock_db_connection):
    new_user = User("testuser", "testpass", "test@example.com", datetime.now())
    mock_db_connection.get_cursor().fetchone.return_value = None

    success = user_data_access.add_user(new_user)
    assert success
    args, _ = mock_db_connection.get_cursor().execute.call_args
    assert args[0] == "INSERT INTO users (username, password, email, created_at) VALUES (%s, %s, %s, %s)"
    assert args[1][0] == new_user.username
    assert args[1][2] == new_user.email
    # Check that the provided password is correctly hashed
    assert check_password_hash(args[1][1], "testpass")


def test_get_user_returns_user(user_data_access, mock_db_connection):
    username = "testuser"
    hashed_password = generate_password_hash("testpass")
    mock_db_connection.get_cursor().fetchone.return_value = {
        'username': username, 'password': hashed_password, 'email': 'test@example.com', 'created_at': datetime.now()
    }

    user = user_data_access.get_user(username)

    assert user is not None
    assert user.username == username
    # Direct comparison, since we're fetching and not hashing here
    assert user.password == hashed_password


def test_get_all_users_returns_users_list(user_data_access, mock_db_connection):
    mock_db_connection.get_cursor().fetchall.return_value = [
        {'username': 'user1', 'password': generate_password_hash('pass1'), 'email': 'user1@example.com',
         'created_at': datetime.now()},
        {'username': 'user2', 'password': generate_password_hash('pass2'), 'email': 'user2@example.com',
         'created_at': datetime.now()}
    ]

    users = user_data_access.get_all_users()
    assert len(users) == 2
    assert all(isinstance(user, User) for user in users)
    assert users[0].username == 'user1'
    assert users[1].email == 'user2@example.com'
    # We could add additional assertions here to verify the integrity of the password hashes, similar to the add_user test
