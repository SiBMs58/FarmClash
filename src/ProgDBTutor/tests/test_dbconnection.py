import pytest
from data_access.dbconnection import DBConnection
from unittest.mock import MagicMock

# This fixture sets up the DBConnection before each test and closes it after.
@pytest.fixture
def db_connection(mocker):
    # Mock the psycopg2.connect method before DBConnection tries to use it
    mocker.patch('dbconnection.psycopg2.connect', return_value=MagicMock())

    # Create the DBConnection instance
    db_conn = DBConnection('dbname', 'user')

    # Return the created database connection for use in tests
    yield db_conn

    # Teardown: close the connection after a test completes
    db_conn.close()

# Example test: checking if connection is successfully created.
def test_db_connection_creation(db_connection):
    assert db_connection.conn is not None


