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

def test_get_building_returns_building_object(building_data_access, mock_db_connection):
    # Mock data returned by fetchone
    mock_db_connection.get_cursor().fetchone.return_value = {
        'building_id': 1,
        'username_owner': 'testuser',
        'farm_id': 1,
        'building_type': 'house',
        'level': 3,
        'x': 10,
        'y': 20,
        'tile_rel_locations': '[{"x": 0, "y": 0}]',
        'created_at': datetime(2023, 5, 1, 12, 0, 0)
    }

    building = building_data_access.get_building(1)

    assert isinstance(building, Building)
    assert building.building_id == 1
    assert building.username_owner == 'testuser'
    assert building.farm_id == 1
    assert building.building_type == 'house'
    assert building.level == 3
    assert building.x == 10
    assert building.y == 20
    assert building.tile_rel_locations == '[{"x": 0, "y": 0}]'
    assert building.created_at == datetime(2023, 5, 1, 12, 0, 0)
    mock_db_connection.get_cursor().execute.assert_called_once_with(
        'SELECT * FROM buildings WHERE building_id = %s',
        (1,)
    )

def test_add_building_adds_successfully(building_data_access, mock_db_connection):
    new_building = Building(None, 'testuser', 1, 'house', 1, 10, 20, '[{"x": 0, "y": 0}]', datetime.now())

    success = building_data_access.add_building(new_building)

    assert success
    mock_db_connection.get_cursor().execute.assert_called_once_with(
        'INSERT INTO buildings (username_owner, farm_id, building_type, level, x, y, tile_rel_locations, created_at) '
        'VALUES (%s, %s, %s, %s, %s, %s, %s, %s)',
        ('testuser', 1, 'house', 1, 10, 20, '[{"x": 0, "y": 0}]', new_building.created_at)
    )
    mock_db_connection.conn.commit.assert_called_once()
