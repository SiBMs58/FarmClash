import pytest
from unittest.mock import MagicMock
from data_access.market_data_access import MarketDataAccess
from models.market import Market
from datetime import datetime
@pytest.fixture
def mock_db_connection():
    connection = MagicMock()
    connection.get_cursor.return_value = MagicMock()
    return connection

@pytest.fixture
def market_data_access(mock_db_connection):
    return MarketDataAccess(mock_db_connection)

def test_get_market_data_returns_market_object(market_data_access, mock_db_connection):
    # Mock data returned by fetchone
    mock_db_connection.get_cursor().fetchone.return_value = {
        'crop_name': 'carrot',
        'current_price': 15,
        'current_quantity_crop': 100,
        'prev_quantity_crop': 50,
        'last_update': datetime(2023, 5, 1, 12, 0, 0)
    }

    market = market_data_access.get_market_data('carrot')

    assert isinstance(market, Market)
    assert market.crop_name == 'carrot'
    assert market.current_price == 15
    assert market.current_quantity_crop == 100
    assert market.prev_quantity_crop == 50
    assert market.last_update == datetime(2023, 5, 1, 12, 0, 0)
    mock_db_connection.get_cursor().execute.assert_called_once_with(
        'SELECT * FROM market WHERE crop_name = %s',
        ('carrot',)
    )

def test_add_market_data_adds_successfully(market_data_access, mock_db_connection):
    new_market = Market('corn', 20, 300, 200, datetime.now())

    success = market_data_access.add_market_data(new_market)

    assert success
    mock_db_connection.get_cursor().execute.assert_called_once_with(
        'INSERT INTO market (crop_name, current_price, current_quantity_crop, prev_quantity_crop, last_update) '
        'VALUES (%s, %s, %s, %s, %s)',
        ('corn', 20, 300, 200, new_market.last_update)
    )
    mock_db_connection.conn.commit.assert_called_once()