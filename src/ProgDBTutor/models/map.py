from datetime import datetime
class Map:
    def __init__(self, map_id, username_owner, width, height, created_at=None):
        self.map_id = map_id
        self.username_owner = username_owner
        self.width = width
        self.height = height
        if created_at is None:
            created_at = datetime.now()
        self.created_at = created_at

    def to_dict(self):
        return {
            'map_id': self.map_id,
            'username_owner': self.username_owner,
            'width': self.width,
            'height': self.height,
            'created_at': self.created_at
        }