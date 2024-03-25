from models.friendship import Friendship
class FriendshipDataAccess:
    def __init__(self, db_connection):
        self.db_connection = db_connection

    def add_friendship(self, friendship):
        """
        Adds a friendship to the database
        :param friendship: A friendship object
        :return: True if the friendship was added successfully, False otherwise
        """
        cursor = self.db_connection.get_cursor()
        if friendship.friendship_id is None:
            cursor.execute(
                "INSERT INTO friendships (user_1, user_2, created_at) VALUES (%s, %s, %s)",
                (friendship.user1.username, friendship.user2.username, friendship.created_at))
        else:
            cursor.execute("INSERT INTO friendships (friendship_id, user_1, user_2, created_at) VALUES (%s, %s, %s, %s)",
                           (friendship.friendship_id, friendship.user1, friendship.user2, friendship.created_at))
        self.db_connection.conn.commit()
        return True

    def get_friendship(self, user1, user2):
        """
        Fetches a friendship from the database
        :param user1: The user object of the first user
        :param user2: The user object of the second user
        :return: A friendship object
        """
        cursor = self.db_connection.get_cursor()
        cursor.execute("SELECT * FROM friendships WHERE user_1 = %s AND user_2 = %s", (user1.username, user2.username))
        result = cursor.fetchone()
        if result is None:
            return None
        return Friendship(result['friendship_id'], result['user_1'], result['user_2'], result['created_at'])

    def get_friends(self, user):
        """
        Get all the friends of a user
        :param user: The user object
        :return: A list of all the friendship objects
        """
        cursor = self.db_connection.get_cursor()
        cursor.execute("SELECT * FROM friendships WHERE user_1 = %s OR user_2 = %s", (user.username, user.username))
        results = cursor.fetchall()
        return [Friendship(result['user_1'], result['user_2'], result['friendship_id'], result['created_at']) for result in results]