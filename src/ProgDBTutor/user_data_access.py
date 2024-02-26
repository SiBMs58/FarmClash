# Data Access Object pattern: see http://best-practice-software-engineering.ifs.tuwien.ac.at/patterns/dao.html
# For clean separation of concerns, create separate data layer that abstracts all data access to/from RDBM

# Depends on psycopg2 librarcy: see (tutor) https://wiki.postgresql.org/wiki/Using_psycopg2_with_PostgreSQL
import psycopg2
from psycopg2 import InterfaceError, OperationalError
from psycopg2.extras import DictCursor
from config import config_data


class DBConnection:
    def __init__(self, dbname, dbuser):
        self.dbname = dbname
        self.dbuser = dbuser
        self._connect()

    def _connect(self):
        try:
            self.conn = psycopg2.connect("dbname='{}' user='{}'".format(self.dbname, self.dbuser))
        except:
            print('ERROR: Unable to connect to database')
            raise

    def close(self):
        if self.conn is not None:
            self.conn.close()
            self.conn = None

    def get_connection(self):
        if self.conn is None or self.conn.closed:
            self._connect()
        return self.conn

    def get_cursor(self):
        if self.conn is None or self.conn.closed:
            print("Connection was closed; attempting to reconnect")
            self._connect()
        return self.conn.cursor(cursor_factory=DictCursor)

    def commit(self):
        return self.conn.commit()

    def rollback(self):
        return self.conn.rollback()


class User:
    def __init__(self, iden, username, password):
        self.id = iden
        self.username = username
        self.password = password

    @staticmethod
    def get(user_id):
        conn = DBConnection(dbname=config_data['dbname'], dbuser=config_data['dbuser'])
        cur = conn.get_cursor()
        cur.execute('SELECT * FROM users WHERE id=%s', (user_id,))
        user_record = cur.fetchone()
        if user_record:
            return User(user_record['id'], user_record['username'], user_record['password'])
        return None

    @property
    def is_active(self):
        # Here you could add logic to check if a user's account is active. For simplicity, we'll just return True
        return True

    @property
    def is_authenticated(self):
        # Assuming a user who has been instantiated like this has already been authenticated
        return True

    def get_id(self):
        return self.id

    def to_dct(self):
        return {'id': self.id, 'username': self.username, 'password': self.password}


class UserDataAccess:
    def __init__(self, db_connection):
        self.db_connection = db_connection

    def get_users(self):
        cursor = self.db_connection.get_cursor()
        cursor.execute('SELECT * FROM users')
        user_objects = list()
        for row in cursor:
            user_obj = User(row['id'], row['username'], row['password'])
            user_objects.append(user_obj)
        return user_objects

    def get_user(self, iden):
        cursor = self.db_connection.get_cursor()
        # See also SO: https://stackoverflow.com/questions/45128902/psycopg2-and-sql-injection-security
        cursor.execute('SELECT * FROM users WHERE id=%s', (iden,))
        row = cursor.fetchone()
        return User(row['id'], row['username'], row['password'])

    def add_user(self, user_obj):
        cursor = self.db_connection.get_cursor()
        try:
            cursor.execute('INSERT INTO users(username, password) VALUES(%s)', (user_obj.username, user_obj.password))
            # get id and return updated object
            cursor.execute('SELECT LASTVAL()')
            iden = cursor.fetchone()[0]
            user_obj.id = iden
            self.db_connection.commit()
            return user_obj
        except:
            self.db_connection.rollback()
            raise Exception('Unable to save user!')