from datetime import datetime
class Map:
    def __init__(self, map_id, username_owner, map_width, map_height, created_at=None):
        self.map_id = map_id
        self.username_owner = username_owner
        self.map_width = map_width
        self.map_height = map_height
        if created_at is None:
            created_at = datetime.now()
        self.created_at = created_at

    def to_dict(self):
        return {
            'map_id': self.map_id,
            'username_owner': self.username_owner,
            'map_width': self.map_width,
            'map_height': self.map_height,
            'created_at': self.created_at
        }