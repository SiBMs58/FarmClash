from datetime import datetime


class Building:
    def __init__(self, building_id, username_owner, building_type, level=1, x=None, y=None, tile_rel_locations=None,
                 created_at=None, augment_level=0):
        self.building_id = building_id
        self.username_owner = username_owner
        self.building_type = building_type
        self.level = level
        self.x = x
        self.y = y
        self.tile_rel_locations = tile_rel_locations
        if created_at is None:
            created_at = datetime.now()
        self.created_at = created_at
        self.augment_level = augment_level
        self.width = 0
        self.height = 0
        self.set_dimensions()

    def to_dict(self):
        return {
            'building_id': self.building_id,
            'username_owner': self.username_owner,
            'building_type': self.building_type,
            'level': self.level,
            'augment_level': self.augment_level,
            'x': self.x,
            'y': self.y,
            'tile_rel_locations': self.tile_rel_locations,
            'created_at': self.created_at,
            'width': self.width,
            'height': self.height
        }

    def set_dimensions(self):
        if self.building_type == 'Field' or self.building_type == 'Fence':
            self.width = 1
            self.height = 1

        elif self.building_type == 'Harvesthopper':
            self.width = 1
            self.height = 2

        elif self.building_type == 'gift': #TODO only if we do gifts through buildings dropped on map
            self.width = 2
            self.height = 2

        elif self.building_type == 'Chickencoop':
            self.width = 2
            self.height = 3

        elif self.building_type == 'Cowbarn' or self.building_type == 'Barn' or self.building_type == 'Goatbarn' or self.building_type == 'Pigpen':
            self.width = 3
            self.height = 3

        elif self.building_type == 'Silo':
            self.width = 3
            self.height = 5

        elif self.building_type == 'Townhall':
            self.width = 4
            self.height = 5

        elif self.building_type == 'Bay':
            self.width = 6
            self.height = 5