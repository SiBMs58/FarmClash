class ChatMessageDataAccess:
    def __init__(self, db_connection):
        self.db_connection = db_connection

    def add_message(self, message):
        """
        Adds a message to the database
        :param message: A message object
        :return: True if the message was added successfully, False otherwise
        """
        cursor = self.db_connection.get_cursor()
        cursor.execute("INSERT INTO chat_messages (sender, receiver, message_text, sent_at) VALUES (%s, %s, %s, %s)",
                       (message.sender, message.receiver, message.message, message.created_at))
        self.db_connection.conn.commit()
        return True