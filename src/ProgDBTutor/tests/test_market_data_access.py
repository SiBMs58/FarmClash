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

def test_get_market_data_returns_none_when_not_found(market_data_access, mock_db_connection):
    mock_db_connection.get_cursor().fetchone.return_value = None

    market = market_data_access.get_market_data('nonexistentcrop')

    assert market is None
    mock_db_connection.get_cursor().execute.assert_called_once_with(
        'SELECT * FROM market WHERE crop_name = %s',
        ('nonexistentcrop',)
    )

def test_add_market_data_updates_successfully(market_data_access, mock_db_connection):
    existing_market = Market('corn', 20, 300, 200, datetime.now())
    mock_db_connection.get_cursor().fetchone.return_value = {
        'crop_name': 'corn',
        'current_price': 20,
        'current_quantity_crop': 300,
        'prev_quantity_crop': 200,
        'last_update': existing_market.last_update
    }

    updated_market = Market('corn', 22, 320, 310, datetime.now())
    success = market_data_access.add_market_data(updated_market)

    assert success
    expected_sql = """
        UPDATE market
        SET current_price = %s, current_quantity_crop = %s, prev_quantity_crop = %s, last_update = %s
        WHERE crop_name = %s;
    """
    normalized_expected_sql = ' '.join(expected_sql.split())  # This removes all extraneous whitespace
    actual_call = mock_db_connection.get_cursor().execute.call_args[0][0]
    normalized_actual_sql = ' '.join(actual_call.split())  # Also normalizes the actual SQL

    assert normalized_expected_sql == normalized_actual_sql  # Compare normalized SQL statements
    mock_db_connection.conn.commit.assert_called_once()



def test_add_market_data_handles_errors_gracefully(market_data_access, mock_db_connection):
    new_market = Market('wheat', 10, 150, 100, datetime.now())
    mock_db_connection.get_cursor().execute.side_effect = Exception("Database error")

    try:
        market_data_access.add_market_data(new_market)
    except Exception as e:
        assert "Database error" in str(e)

    mock_db_connection.conn.commit.assert_not_called()
