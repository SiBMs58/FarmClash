import pytest
from unittest.mock import patch, MagicMock
from data_access.dbconnection import DBConnection


@pytest.fixture
def mock_psycopg2_connect():
    # Patch the connect method specifically, not the whole psycopg2 module
    with patch('data_access.dbconnection.psycopg2.connect') as mock_connect:
        # This mock represents the connection object returned by psycopg2.connect
        mock_connection = MagicMock()
        mock_connect.return_value = mock_connection
        yield mock_connect


def test_dbconnection_initialization(mock_psycopg2_connect):
    dbname = 'dbtutor'
    dbuser = 'app'
    # Instantiate DBConnection, which should internally call psycopg2.connect
    db_conn = DBConnection(dbname, dbuser)
    assert db_conn.dbname == dbname
    assert db_conn.dbuser == dbuser

    # Assert that psycopg2.connect was called with the correct parameters
    mock_psycopg2_connect.assert_called_once_with(dbname=dbname, user=dbuser)

def test_get_connection_reconnects_if_closed(mock_psycopg2_connect):
    mock_connection = mock_psycopg2_connect.return_value
    # Simulate an open connection initially
    mock_connection.closed = False
    db_conn = DBConnection('dbtutor', 'app')

    # Assert that the connection is initially open
    assert not db_conn.get_connection().closed

    # Now simulate the connection being closed
    mock_connection.closed = True
    db_conn.get_connection()  # Attempt to get connection which should reconnect
    # Check if connect was called again due to closed connection
    assert mock_psycopg2_connect.call_count == 2

def test_get_cursor_returns_cursor(mock_psycopg2_connect):
    mock_connection = mock_psycopg2_connect.return_value
    # Configure the mock connection to return a mock cursor
    mock_cursor = MagicMock()
    mock_connection.cursor.return_value = mock_cursor
    db_conn = DBConnection('dbtutor', 'app')

    cursor = db_conn.get_cursor()
    assert cursor == mock_cursor
    mock_connection.cursor.assert_called_once()

def test_close_closes_connection(mock_psycopg2_connect):
    mock_connection = mock_psycopg2_connect.return_value
    db_conn = DBConnection('dbtutor', 'app')
    db_conn.close()
    mock_connection.close.assert_called_once()

def test_commit_commits_transaction(mock_psycopg2_connect):
    mock_connection = mock_psycopg2_connect.return_value
    db_conn = DBConnection('dbtutor', 'app')
    db_conn.commit()
    mock_connection.commit.assert_called_once()

def test_rollback_rolls_back_transaction(mock_psycopg2_connect):
    mock_connection = mock_psycopg2_connect.return_value
    db_conn = DBConnection('dbtutor', 'app')
    db_conn.rollback()
    mock_connection.rollback.assert_called_once()
