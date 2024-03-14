from datetime import datetime
class Tile:
    def __init__(self, tile_id, map_id, x, y, terrain_type, occupant_id, created_at=None):
        self.tile_id = tile_id
        self.map_id = map_id
        self.x = x
        self.y = y
        self.terrain_type = terrain_type
        self.occupant_id = occupant_id
        if created_at is None:
            created_at = datetime.now()
        self.created_at = created_at

    def to_dict(self):
        return {
            'tile_id': self.tile_id,
            'map_id': self.map_id,
            'x': self.x,
            'y': self.y,
            'terrain_type': self.terrain_type,
            'occupant_id': self.occupant_id,
            'created_at': self.created_at
        }