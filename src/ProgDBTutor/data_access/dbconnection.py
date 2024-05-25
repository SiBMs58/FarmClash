# Data Access Object pattern: see http://best-practice-software-engineering.ifs.tuwien.ac.at/patterns/dao.html
# For clean separation of concerns, create separate data layer that abstracts all data access to/from RDBM

# Depends on psycopg2 librarcy: see (tutor) https://wiki.postgresql.org/wiki/Using_psycopg2_with_PostgreSQL

import psycopg2
from psycopg2.extras import DictCursor
from threading import Lock


class DBConnection:
    def __init__(self, dbname, dbuser):
        self.dbname = dbname
        self.dbuser = dbuser
        self.conn = None
        self.lock = Lock()
        self._connect()

    def _connect(self):
        try:
            with self.lock:
                self.conn = psycopg2.connect(dbname=self.dbname, user=self.dbuser)
        except Exception as e:
            print(f'ERROR: Unable to connect to the database: {e}')
            raise

    def get_connection(self):
        with self.lock:
            if self.conn is None or self.conn.closed:
                self._connect()
            return self.conn

    def get_cursor(self):
        with self.lock:
            if not self.conn or self.conn.closed:
                self._connect()
            return self.conn.cursor(cursor_factory=DictCursor)

    def close(self):
        with self.lock:
            if self.conn:
                self.conn.close()

    def commit(self):
        with self.lock:
            if self.conn:
                self.conn.commit()

    def rollback(self):
        with self.lock:
            if self.conn:
                self.conn.rollback()