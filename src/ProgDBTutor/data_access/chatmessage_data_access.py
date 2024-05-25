from models.chatmessage import ChatMessage
from threading import Lock
class ChatMessageDataAccess:
    def __init__(self, db_connection):
        self.db_connection = db_connection
        self.lock = Lock()

    def add_message(self, message):
        """
        Adds a message to the database
        :param message: A message object
        :return: True if the message was added successfully, False otherwise
        """
        with self.lock:
            cursor = self.db_connection.get_cursor()
            if message.message_id is None:
                cursor.execute(
                    "INSERT INTO chat_messages (sender, receiver, message_text, sent_at) VALUES (%s, %s, %s, %s)",
                    (message.sender, message.receiver, message.message, message.created_at))
            else:
                cursor.execute("INSERT INTO chat_messages (message_id, sender, receiver, message_text, sent_at) VALUES (%s, %s, %s, %s, %s)", (message.message_id, message.sender, message.receiver, message.message, message.created_at))
            self.db_connection.conn.commit()
            return True

    def get_messages(self, sender, receiver):
        """
        Gets messages from the database
        :param sender: The user object of the sender
        :param receiver: The user object of the receiver
        :return: A list of messages
        """
        with self.lock:
            cursor = self.db_connection.get_cursor()
            cursor.execute("""
                SELECT * FROM chat_messages
                WHERE (sender = %s AND receiver = %s) OR (sender = %s AND receiver = %s)
                ORDER BY sent_at ASC
                """, (sender.username, receiver.username, receiver.username, sender.username))
            messages = cursor.fetchall()
            return [ChatMessage(result['sender'], result['receiver'], result['message_text'], result['message_id'], result['sent_at']) for result in messages]