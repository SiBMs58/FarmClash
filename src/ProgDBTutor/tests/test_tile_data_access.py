import pytest
from unittest.mock import MagicMock, patch
from datetime import datetime
from models.tile import Tile
from data_access.tile_data_access import TileDataAccess

@pytest.fixture
def mock_db_connection():
    connection = MagicMock()
    connection.get_cursor.return_value = MagicMock()
    return connection

@pytest.fixture
def tile_data_access(mock_db_connection):
    return TileDataAccess(mock_db_connection)

def test_get_tile_returns_tile(tile_data_access, mock_db_connection):
    test_tile_id = 1
    mock_db_connection.get_cursor().fetchone.return_value = {
        'tile_id': test_tile_id, 'map_id': 2, 'x': 10, 'y': 20, 'terrain_type': 'grass', 'occupant_id': None, 'created_at': datetime.now()
    }

    tile = tile_data_access.get_tile(test_tile_id)
    assert tile is not None
    assert isinstance(tile, Tile)
    assert tile.tile_id == test_tile_id
    assert tile.terrain_type == 'grass'

def test_get_tile_returns_none_if_not_found(tile_data_access, mock_db_connection):
    mock_db_connection.get_cursor().fetchone.return_value = None
    tile = tile_data_access.get_tile(999)  # Assuming 999 is a non-existent tile ID
    assert tile is None

def test_get_tiles_by_map_id_returns_tiles_list(tile_data_access, mock_db_connection):
    mock_db_connection.get_cursor().fetchall.return_value = [
        {'tile_id': 1, 'map_id': 2, 'x': 10, 'y': 20, 'terrain_type': 'grass', 'occupant_id': None, 'created_at': datetime.now()},
        {'tile_id': 2, 'map_id': 2, 'x': 15, 'y': 25, 'terrain_type': 'water', 'occupant_id': None, 'created_at': datetime.now()}
    ]

    tiles = tile_data_access.get_tiles_by_map_id(2)
    assert len(tiles) == 2
    assert all(isinstance(tile, Tile) for tile in tiles)
    assert tiles[0].terrain_type == 'grass'
    assert tiles[1].x == 15

def test_add_tile_adds_successfully(tile_data_access, mock_db_connection):
    new_tile = Tile(None, 2, 30, 40, 'forest', None, datetime.now())
    success = tile_data_access.add_tile(new_tile)
    assert success
    mock_db_connection.get_cursor().execute.assert_called()
    mock_db_connection.conn.commit.assert_called_once()
