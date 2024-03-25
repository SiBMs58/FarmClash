from datetime import datetime
class ChatMessage:
    def __init__(self, sender, receiver, message, message_id=None, created_at=None):
        self.message_id = message_id
        self.sender = sender
        self.receiver = receiver
        self.message = message
        if created_at is None:
            created_at = datetime.now()
        self.created_at = created_at

    def to_dict(self):
        return {
            'message_id': self.message_id,
            'sender': self.sender,
            'receiver': self.receiver,
            'message': self.message,
            'created_at': self.created_at
        }