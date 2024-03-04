class User:
    def __init__(self, username, password, email, user_id=None, created_at=None):
        self.user_id = user_id
        self.username = username
        self.password = password
        self.email = email
        self.created_at = created_at

    @staticmethod
    def get(user_id):
        # This method should be updated to fetch a user by their user_id from the database
        pass

    @property
    def is_active(self):
        # Potentially, you could check if the account is active (e.g., not deleted). For now, we'll return True.
        return True

    @property
    def is_authenticated(self):
        # Assuming a user instantiated is authenticated, return True
        return True

    def get_id(self):
        # Flask-Login uses this method to manage user sessions. It expects a unicode string identifying the user.
        return str(self.user_id)

    def to_dict(self):
        # Useful for JSON responses in APIs
        return {
            'user_id': self.user_id,
            'username': self.username,
            'password': self.password,  # Be cautious about exposing passwords.
            'email': self.email,
            'created_at': self.created_at,
        }
