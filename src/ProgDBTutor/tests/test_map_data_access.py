import pytest
from unittest.mock import MagicMock, patch
from datetime import datetime
from models.map import Map
from data_access.map_data_access import MapDataAccess

# Assuming models.map.Map and data_access.map_data_access.MapDataAccess are the import paths

@pytest.fixture
def mock_db_connection():
    connection = MagicMock()
    connection.get_cursor.return_value = MagicMock()
    return connection

@pytest.fixture
def map_data_access(mock_db_connection):
    return MapDataAccess(mock_db_connection)

def test_get_map_found(map_data_access, mock_db_connection):
    test_map_id = 1
    mock_db_connection.get_cursor().fetchone.return_value = {
        'map_id': test_map_id, 'username_owner': 'user1', 'map_width': 100, 'map_height': 100, 'created_at': datetime.now()
    }

    result = map_data_access.get_map(test_map_id)
    assert result is not None
    assert isinstance(result, Map)
    assert result.map_id == test_map_id

def test_get_map_not_found(map_data_access, mock_db_connection):
    mock_db_connection.get_cursor().fetchone.return_value = None

    result = map_data_access.get_map(999)  # Assuming 999 is an ID that doesn't exist
    assert result is None

def test_get_map_by_username_owner_found(map_data_access, mock_db_connection):
    username_owner = 'user1'
    mock_db_connection.get_cursor().fetchone.return_value = {
        'map_id': 1, 'username_owner': username_owner, 'width': 100, 'height': 100, 'created_at': datetime.now()
    }

    result = map_data_access.get_map_by_username_owner(username_owner)
    assert result is not None
    assert isinstance(result, Map)
    assert result.username_owner == username_owner

def test_get_all_maps(map_data_access, mock_db_connection):
    mock_db_connection.get_cursor().fetchall.return_value = [
        {'map_id': 1, 'username_owner': 'user1', 'width': 100, 'height': 100, 'created_at': datetime.now()},
        {'map_id': 2, 'username_owner': 'user2', 'width': 200, 'height': 200, 'created_at': datetime.now()}
    ]

    result = map_data_access.get_all_maps()
    assert len(result) == 2
    assert all(isinstance(item, Map) for item in result)

def test_add_map(map_data_access, mock_db_connection):
    new_map = Map(None, 'new_user', 150, 150, datetime.now())

    success = map_data_access.add_map(new_map)
    assert success
    mock_db_connection.get_cursor().execute.assert_called()
    mock_db_connection.conn.commit.assert_called()
