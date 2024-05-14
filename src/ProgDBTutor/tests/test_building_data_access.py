import pytest
from unittest.mock import MagicMock
from data_access.building_data_access import BuildingDataAccess
from models.building import Building
from datetime import datetime

@pytest.fixture
def mock_db_connection():
    connection = MagicMock()
    connection.get_cursor.return_value = MagicMock()
    return connection

@pytest.fixture
def building_data_access(mock_db_connection):
    return BuildingDataAccess(mock_db_connection)

def test_get_building_returns_none_when_not_found(building_data_access, mock_db_connection):
    mock_db_connection.get_cursor().fetchone.return_value = None

    building = building_data_access.get_building(99)  # Assuming 99 is a non-existent ID

    assert building is None
    mock_db_connection.get_cursor().execute.assert_called_once_with(
        'SELECT * FROM buildings WHERE building_id = %s',
        (99,)
    )

def test_get_buildings_by_username_owner_returns_buildings_list(building_data_access, mock_db_connection):
    # Mock data returned by fetchall
    mock_db_connection.get_cursor().fetchall.return_value = [
        {'building_id': 1, 'username_owner': 'testuser', 'building_type': 'house', 'level': 1, 'x': 10, 'y': 20, 'tile_rel_locations': '[{"x": 0, "y": 0}]', 'created_at': datetime.now(), 'augment_level': 0},
        {'building_id': 2, 'username_owner': 'testuser', 'building_type': 'farm', 'level': 2, 'x': 15, 'y': 25, 'tile_rel_locations': '[{"x": 1, "y": 1}]', 'created_at': datetime.now(), 'augment_level': 1}
    ]

    buildings = building_data_access.get_buildings_by_username_owner('testuser')

    assert len(buildings) == 2
    assert all(isinstance(b, Building) for b in buildings)
    assert buildings[0].building_id == 1
    assert buildings[1].building_id == 2
    mock_db_connection.get_cursor().execute.assert_called_once_with(
        'SELECT * FROM buildings WHERE username_owner = %s',
        ('testuser',)
    )

def test_get_buildings_by_username_owner_returns_empty_list_when_no_buildings_found(building_data_access, mock_db_connection):
    mock_db_connection.get_cursor().fetchall.return_value = []

    buildings = building_data_access.get_buildings_by_username_owner('nonexistentuser')

    assert buildings == []
    mock_db_connection.get_cursor().execute.assert_called_once_with(
        'SELECT * FROM buildings WHERE username_owner = %s',
        ('nonexistentuser',)
    )

def test_add_building_handles_errors_gracefully(building_data_access, mock_db_connection):
    new_building = Building(None, 'testuser', 1, 'house', 1, 10, 20, datetime.now())
    mock_db_connection.get_cursor().execute.side_effect = Exception("Database error")

    success = building_data_access.add_building(new_building)

    assert not success
    mock_db_connection.conn.commit.assert_not_called()

