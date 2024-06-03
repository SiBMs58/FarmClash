import pytest
from unittest.mock import MagicMock
from data_access.resource_data_access import ResourceDataAccess
from models.resource import Resource


@pytest.fixture
def mock_db_connection():
    connection = MagicMock()
    connection.get_cursor.return_value = MagicMock()
    return connection


@pytest.fixture
def resource_data_access(mock_db_connection):
    return ResourceDataAccess(mock_db_connection)


def test_update_resource_updates_successfully(resource_data_access, mock_db_connection):
    # Arrange
    username_owner = 'testuser'
    resource_type = 'wood'
    amount = 50

    # Mock the rowcount to simulate successful update
    cursor = mock_db_connection.get_cursor.return_value
    cursor.rowcount = 1  # Simulate one row being updated

    # Act
    success = resource_data_access.update_resource(username_owner, resource_type, amount)

    # Assert
    assert success
    cursor.execute.assert_called_once_with(
        'UPDATE resources SET quantity = GREATEST(0, quantity + %s) WHERE owner = %s AND type = %s',
        (amount, username_owner, resource_type)
    )
    mock_db_connection.conn.commit.assert_called_once()


def test_update_resource_fails_when_no_rows_updated(resource_data_access, mock_db_connection):
    # Arrange
    username_owner = 'testuser'
    resource_type = 'wood'
    amount = 50

    # Mock the rowcount to simulate no rows updated
    cursor = mock_db_connection.get_cursor.return_value
    cursor.rowcount = 0  # Simulate no rows being updated

    # Act
    success = resource_data_access.update_resource(username_owner, resource_type, amount)

    # Assert
    assert not success
    cursor.execute.assert_called_once_with(
        'UPDATE resources SET quantity = GREATEST(0, quantity + %s) WHERE owner = %s AND type = %s',
        (amount, username_owner, resource_type)
    )
    mock_db_connection.conn.commit.assert_not_called()


def test_update_resource_does_not_go_below_zero(resource_data_access, mock_db_connection):
    # Arrange
    username_owner = 'testuser'
    resource_type = 'wood'
    amount = -150

    # Mock the rowcount to simulate successful update
    cursor = mock_db_connection.get_cursor.return_value
    cursor.rowcount = 1  # Simulate one row being updated

    # Act
    success = resource_data_access.update_resource(username_owner, resource_type, amount)

    # Assert
    assert success
    cursor.execute.assert_called_once_with(
        'UPDATE resources SET quantity = GREATEST(0, quantity + %s) WHERE owner = %s AND type = %s',
        (amount, username_owner, resource_type)
    )
    mock_db_connection.conn.commit.assert_called_once()

