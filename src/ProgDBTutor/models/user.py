from datetime import datetime
class User:
    def __init__(self, username, password, email, created_at=None, last_gift=None):
        self.username = username
        self.password = password
        self.email = email
        if created_at is None:
            created_at = datetime.now()
        self.created_at = created_at
        self.last_gift = last_gift

    def get_id(self):
        """
        Returns the primary key of the user, this is used by Flask-Login.
        :return: the primary key of the user
        """
        return self.username

    def is_authenticated(self):
        """
        Returns True if the user is authenticated, i.e. they have provided valid credentials. This is used by Flask-Login.
        :return:
        """
        return True

    def is_active(self):
        """
        Returns True if the user is active, i.e. they have not been deactivated. This is used by Flask-Login.
        :return:
        """
        return True

    def to_dict(self):
        """
        Converts the user to a dict and returns it, this is useful for sending data to the client from the server aka api requests
        :return: the user as a dict
        """
        return {
            'username': self.username,
            'password': self.password,  # Be cautious about exposing passwords.
            'email': self.email,
            'created_at': self.created_at,
            'last_gift': self.last_login
        }
