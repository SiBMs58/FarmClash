# Data Access Object pattern: see http://best-practice-software-engineering.ifs.tuwien.ac.at/patterns/dao.html
# For clean separation of concerns, create separate data layer that abstracts all data access to/from RDBM

# Depends on psycopg2 librarcy: see (tutor) https://wiki.postgresql.org/wiki/Using_psycopg2_with_PostgreSQL

import psycopg2
from psycopg2.extras import DictCursor


class DBConnection:
    def __init__(self, dbname, dbuser, dbpassword='postgres'):
        self.dbname = dbname
        self.dbuser = dbuser
        self.dbpassword = dbpassword
        self.conn = None
        self._connect()

    def _connect(self):
        try:
            self.conn = psycopg2.connect(f"dbname='{self.dbname}' user='{self.dbuser}' password='{self.dbpassword}'")
        except Exception as e:
            print(f'ERROR: Unable to connect to the database: {e}')
            raise

    def get_connection(self):
        if self.conn is None or self.conn.closed:
            self._connect()
        return self.conn

    def get_cursor(self):
        if not self.conn or self.conn.closed:
            self._connect()
        return self.conn.cursor(cursor_factory=DictCursor)

    def close(self):
        if self.conn:
            self.conn.close()

    def commit(self):
        if self.conn:
            self.conn.commit()

    def rollback(self):
        if self.conn:
            self.conn.rollback()