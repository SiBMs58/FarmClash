import pytest
from unittest.mock import MagicMock
from datetime import datetime
from models.friendship import Friendship
from models.user import User
from data_access.friendship_data_access import FriendshipDataAccess


@pytest.fixture
def mock_db_connection():
    connection = MagicMock()
    connection.get_cursor.return_value = MagicMock()
    return connection


@pytest.fixture
def friendship_data_access(mock_db_connection):
    return FriendshipDataAccess(mock_db_connection)


@pytest.fixture
def user1():
    return User(username="user1", password="password1", email="user1@example.com")


@pytest.fixture
def user2():
    return User(username="user2", password="password2", email="user2@example.com")


def test_add_friendship_success(friendship_data_access, mock_db_connection, user1, user2):
    # Creating a Friendship object with User objects for user1 and user2
    friendship = Friendship(user1=user1, user2=user2, created_at=datetime.now())

    # Setup: Simulating successful database operation
    mock_db_connection.get_cursor.return_value.execute.return_value = None
    mock_db_connection.get_cursor.return_value.fetchone.return_value = [1]  # Assume ID of the new friendship

    # Execute & Assert: Method should complete without errors
    try:
        success = friendship_data_access.add_friendship(friendship)
        assert success is True
    except Exception:
        pytest.fail("Unexpected error occurred")

    mock_db_connection.get_cursor.assert_called_once()
    mock_db_connection.get_cursor.return_value.execute.assert_called()


def test_add_friendship_exception(friendship_data_access, mock_db_connection, user1, user2):
    # Creating a Friendship object with User objects for user1 and user2
    friendship = Friendship(user1=user1, user2=user2, created_at=datetime.now())

    # Setup: Simulating a database error during the execute call
    mock_db_connection.get_cursor.return_value.execute.side_effect = Exception("Database error")

    # Execute & Assert: Method should raise an exception due to the database error
    with pytest.raises(Exception) as exc_info:
        friendship_data_access.add_friendship(friendship)

    assert "Database error" in str(exc_info.value)
    mock_db_connection.get_cursor.assert_called_once()
    mock_db_connection.get_cursor.return_value.execute.assert_called()
