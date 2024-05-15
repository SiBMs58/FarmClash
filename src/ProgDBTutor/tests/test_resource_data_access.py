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


def test_get_resources_returns_resources_list(resource_data_access, mock_db_connection):
    # Mock data returned by fetchall
    mock_db_connection.get_cursor().fetchall.return_value = [
        {'resource_id': 1, 'owner': 'testuser', 'type': 'wood', 'quantity': 100},
        {'resource_id': 2, 'owner': 'testuser', 'type': 'stone', 'quantity': 200},
    ]

    resources = resource_data_access.get_resources('testuser')

    assert len(resources) == 2
    assert all(isinstance(r, Resource) for r in resources)
    assert resources[0].resource_type == 'wood'
    assert resources[1].amount == 200
    mock_db_connection.get_cursor().execute.assert_called_once_with('SELECT * FROM resources WHERE owner = %s',
                                                                    ('testuser',))


def test_add_resource_adds_successfully(resource_data_access, mock_db_connection):
    new_resource = Resource(None, 'testuser', 'food', 500)

    success = resource_data_access.add_resource(new_resource)

    assert success
    mock_db_connection.get_cursor().execute.assert_called_once_with(
        'INSERT INTO resources (type, quantity, owner) VALUES (%s, %s, %s)',
        ('food', 500, 'testuser')
    )
    mock_db_connection.conn.commit.assert_called_once()


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

