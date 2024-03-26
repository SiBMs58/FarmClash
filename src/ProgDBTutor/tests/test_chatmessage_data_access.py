import pytest
from unittest.mock import MagicMock
from datetime import datetime
from models.chatmessage import ChatMessage
from data_access.chatmessage_data_access import ChatMessageDataAccess


@pytest.fixture
def mock_db_connection():
    connection = MagicMock()
    connection.get_cursor.return_value = MagicMock()
    return connection


@pytest.fixture
def chatmessage_data_access(mock_db_connection):
    return ChatMessageDataAccess(mock_db_connection)


def test_add_message_success(chatmessage_data_access, mock_db_connection):
    message = ChatMessage(sender='user1', receiver='user2', message='Hello!', created_at=datetime.now())

    mock_db_connection.get_cursor.return_value.execute.return_value = True
    mock_db_connection.get_cursor.return_value.fetchone.return_value = [1]  # Simulate successful insert

    assert chatmessage_data_access.add_message(message) == True
    mock_db_connection.get_cursor.assert_called_once()
    mock_db_connection.get_cursor.return_value.execute.assert_called()


def test_add_message_database_error(chatmessage_data_access, mock_db_connection):
    message = ChatMessage(sender='user1', receiver='user2', message='Hello!')

    # Simulating a database error during the execute call
    mock_db_connection.get_cursor.return_value.execute.side_effect = Exception("Database error")

    # Expecting the method to raise an exception due to the database error
    with pytest.raises(Exception) as exc_info:
        chatmessage_data_access.add_message(message)

    assert "Database error" in str(exc_info.value)
    mock_db_connection.get_cursor.assert_called_once()
    mock_db_connection.get_cursor.return_value.execute.assert_called()