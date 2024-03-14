import unittest
from unittest.mock import patch, MagicMock
from data_access.dbconnection import DBConnection
from config import config_data


class TestDBConnection(unittest.TestCase):

    @patch('dbconnection.psycopg2.connect')
    def test_successful_connection(self, mock_connect):
        # Simulate a successful connection
        mock_conn = MagicMock()
        mock_connect.return_value = mock_conn

        db = DBConnection(config_data['dbname'], config_data['dbuser'])

        # Verify that a connection was established
        self.assertIsNotNone(db.conn)
        mock_connect.assert_called_with("dbname='dbtutor' user='app'")

        # Verify get_connection returns the connection
        self.assertEqual(db.get_connection(), mock_conn)

        # Verify get_cursor returns a cursor
        self.assertTrue(db.get_cursor())

    @patch('dbconnection.psycopg2.connect')
    def test_reconnect_when_connection_closed(self, mock_connect):
        # Simulate a scenario where the initial connection is closed, and a reconnect is needed
        mock_conn = MagicMock()
        mock_conn.closed = True  # Simulate closed connection
        mock_connect.return_value = mock_conn

        db = DBConnection(config_data['dbname'], config_data['dbuser'])
        db._connect()  # Attempt to reconnect

        # Verify reconnect attempts if connection is closed
        self.assertTrue(mock_connect.called)
        self.assertEqual(mock_connect.call_count, 2)  # Called during init and _connect

    @patch('dbconnection.psycopg2.connect')
    def test_connection_exception(self, mock_connect):
        # Simulate a connection exception
        mock_connect.side_effect = Exception('Connection failed')

        with self.assertRaises(Exception) as context:
            DBConnection(config_data['dbname'], config_data['dbuser'])

        self.assertTrue('Connection failed' in str(context.exception))

    @patch('dbconnection.psycopg2.connect')
    def test_close_commit_rollback_methods(self, mock_connect):
        # Test the close, commit, and rollback methods
        mock_conn = MagicMock()
        mock_connect.return_value = mock_conn

        db = DBConnection(config_data['dbname'], config_data['dbuser'])

        db.close()
        mock_conn.close.assert_called_once()

        db.commit()
        mock_conn.commit.assert_called_once()

        db.rollback()
        mock_conn.rollback.assert_called_once()


if __name__ == '__main__':
    unittest.main()
