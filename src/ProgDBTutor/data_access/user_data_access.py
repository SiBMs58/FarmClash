from datetime import datetime

from models.user import User
from werkzeug.security import generate_password_hash


class UserDataAccess:

    def __init__(self, db_connection):
        self.db_connection = db_connection


    def add_user(self, user):
        """
        Adds a user to the database after checking if the username already exists.
        :param user: User object with user data.
        :return: True if user is added successfully, False otherwise.
        """
        if self.get_user(user.username):
            return False

        cursor = self.db_connection.get_cursor()
        cursor.execute("INSERT INTO users (username, password, email, created_at) VALUES (%s, %s, %s, %s)",
                       (user.username, generate_password_hash(user.password), user.email, user.created_at))
        self.db_connection.conn.commit()
        return True

    def get_user(self, username):
        """
        Fetches a user from the database by user.
        :param username: The username of the user to fetch, aka the primary key.
        :return: User object with user data or None if user is not found.
        """
        cursor = self.db_connection.get_cursor()
        cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
        result = cursor.fetchone()
        if result:
           return User(result['username'], result['password'], result['email'], result['created_at'], result['last_gift'])
        else:
           return None

    def update_last_gift(self, username):
        """
        Updates the last_gift field of the user with the given username.
        :param username: The username of the user to update.
        """
        cursor = self.db_connection.get_cursor()
        cursor.execute("UPDATE users SET last_gift = %s WHERE username = %s", (datetime.now(), username))
        self.db_connection.conn.commit()


    def get_all_users(self):
        """
        Fetches all users from the database.
        :return: List of User objects with user data.
        """
        cursor = self.db_connection.get_cursor()
        cursor.execute("SELECT * FROM users")
        results = cursor.fetchall()
        return [User(result['username'], result['password'], result['email'], result['created_at'], result['last_gift']) for result in results]

    def search_users(self, query):
        """
        Searches for users whose usernames contain the given query string.
        :param query: The search query string.
        :return: List of User objects for users whose usernames match the query.
        """
        cursor = self.db_connection.get_cursor()
        like_query = f"%{query}%"
        cursor.execute("SELECT * FROM users WHERE username LIKE %s", (like_query,))
        results = cursor.fetchall()
        return [User(result['username'], result['password'], result['email'], result['created_at'], result['last_gift']) for result in
                results]