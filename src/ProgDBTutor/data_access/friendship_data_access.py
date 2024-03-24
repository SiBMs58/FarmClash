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
                (friendship.user1, friendship.user2, friendship.created_at))
        else:
            cursor.execute("INSERT INTO friendships (friendship_id, user_1, user_2, created_at) VALUES (%s, %s, %s, %s)",
                           (friendship.friendship_id, friendship.user1, friendship.user2, friendship.created_at))
        self.db_connection.conn.commit()
        return True