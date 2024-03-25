from datetime import datetime
class Friendship:
    def __init__(self, user1, user2, friendship_id=None, created_at=None):
        self.friendship_id = friendship_id
        self.user1 = user1
        self.user2 = user2
        if created_at is None:
            created_at = datetime.now()
        self.created_at = created_at

    def to_dict(self):
        return {
            'friendship_id': self.friendship_id,
            'user1': self.user1,
            'user2': self.user2,
            'created_at': self.created_at
        }
