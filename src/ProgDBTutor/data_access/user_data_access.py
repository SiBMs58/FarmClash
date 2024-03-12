from models.user import User
from models.map import Map
from werkzeug.security import generate_password_hash


class UserDataAccess:
    def __init__(self, db_connection):
        self.db_connection = db_connection

    def get_user_by_username(self, user_name):
        cursor = self.db_connection.get_cursor()
        cursor.execute('SELECT * FROM users WHERE username = %s', (user_name,))
        row = cursor.fetchone()
        if row:
            return User(row['username'], row['password'], row['email'], row['user_id'], row['created_at'])
        return None

    def get_user(self, user_id):
        cursor = self.db_connection.get_cursor()
        cursor.execute('SELECT * FROM users WHERE user_id = %s', (user_id,))
        row = cursor.fetchone()
        if row:
            return User(row['username'], row['password'], row['email'], row['user_id'], row['created_at'])
        return None

    def get_maps_by_user(self, user_id, map_number):
        cursor = self.db_connection.get_cursor()
        cursor.execute('SELECT * FROM game_maps WHERE user_id = %s ORDER BY created_at DESC LIMIT %s', (user_id, map_number))
        row = cursor.fetchone()
        return Map(row['map_id'], row['user_id'], row['width'], row['height'], row['created_at'])

    def add_user(self, user):
        cursor = self.db_connection.get_cursor()
        try:
            hashed_password = generate_password_hash(user.password)
            cursor.execute('INSERT INTO users (username, password, email) VALUES (%s, %s, %s) RETURNING user_id',
                           (user.username, hashed_password, user.email))
            user_id = cursor.fetchone()[0]
            self.db_connection.commit()
            return user_id
        except Exception as e:
            print(f'Error adding user: {e}')
            self.db_connection.rollback()
            return None

    def get_all_users(self):
        cursor = self.db_connection.get_cursor()
        cursor.execute('SELECT * FROM users')
        rows = cursor.fetchall()
        users = []
        for row in rows:
            user = User(row['username'], row['password'], row['email'], row['user_id'], row['created_at'])
            users.append(user)
        return users