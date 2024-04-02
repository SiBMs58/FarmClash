from datetime import datetime

class Building:
    def __init__(self, building_id, username_owner, farm_id, building_type, level=1, x=None, y=None, tile_rel_locations=None, created_at=None):
        self.building_id = building_id
        self.username_owner = username_owner
        self.farm_id = farm_id
        self.building_type = building_type
        self.level = level
        self.x = x
        self.y = y
        self.tile_rel_locations = tile_rel_locations
        if created_at is None:
            created_at = datetime.now()
        self.created_at = created_at

    def to_dict(self):
        return {
            'building_id': self.building_id,
            'username_owner': self.username_owner,
            'farm_id': self.farm_id,
            'building_type': self.building_type,
            'level': self.level,
            'x': self.x,
            'y': self.y,
            'tile_rel_locations': self.tile_rel_locations,
            'created_at': self.created_at
        }