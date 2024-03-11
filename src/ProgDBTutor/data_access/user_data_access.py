from models.user import User


class UserDataAccess:
    def __init__(self, db_connection):
        self.db_connection = db_connection

    def get_user(self, user_id):
        cursor = self.db_connection.get_cursor()
        cursor.execute('SELECT * FROM users WHERE user_id = %s', (user_id,))
        row = cursor.fetchone()
        if row:
            return User(row['username'], row['password'], row['email'], row['user_id'], row['created_at'])
        return None

    def add_user(self, user):
        cursor = self.db_connection.get_cursor()
        try:
            cursor.execute('INSERT INTO users (username, password, email) VALUES (%s, %s, %s) RETURNING user_id',
                           (user.username, user.password, user.email))
            user_id = cursor.fetchone()[0]
            self.db_connection.commit()
            return user_id
        except Exception as e:
            print(f'Error adding user: {e}')
            self.db_connection.rollback()
            return None