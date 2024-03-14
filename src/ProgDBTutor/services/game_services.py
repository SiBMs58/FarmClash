from data_access.user_data_access import UserDataAccess
from data_access.map_data_access import MapDataAccess

class GameServices:
    def __init__(self, user_data_access, map_data_access, tile_data_access):
        self.user_data_access = user_data_access
        self.map_data_access = map_data_access
        self.tile_data_access = tile_data_access

    def create_default_map(self, user_id):
        """
        Creates a default map for a user.
        """
        # Logic to create a default map, involving database operations.
        # This might include checking if the user exists and if the default map already exists.
        terrain_tiles = [
            ['Water.1.1','Grass.6.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1', 'Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1'],
            ['Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1', 'Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1'],
            ['Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1', 'Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1'],
            ['Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1', 'Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1'],
            ['Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1', 'Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1'],
            ['Water.1.1','Water.1.1','Grass.6.1','Grass.6.1','Grass.6.1','Water.1.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Water.1.1','Grass.6.1','Grass.6.1','Grass.6.1', 'Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1'],
            ['Water.1.1','Water.1.1','Grass.6.1','Grass.6.1','Grass.6.1','Water.1.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Water.1.1','Grass.6.1','Grass.6.1','Grass.6.1', 'Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1'],
            ['Water.1.1','Water.1.1','Grass.6.1','Grass.6.1','Grass.6.1','Water.1.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Water.1.1','Grass.6.1','Grass.6.1','Grass.6.1', 'Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1'],
            ['Water.1.1','Water.1.1','Grass.6.1','Grass.6.1','Grass.6.1','Water.1.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Water.1.1','Grass.6.1','Grass.6.1','Grass.6.1', 'Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1'],
            ['Water.1.1','Water.1.1','Grass.6.1','Grass.6.1','Grass.6.1','Water.1.1','Grass.6.1','Grass.6.1','Grass.6.1','Water.1.1','Water.1.1','Grass.6.1','Grass.6.1','Water.1.1','Grass.6.1','Grass.6.1','Grass.6.1', 'Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1'],
            ['Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1', 'Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1'],
            ['Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1', 'Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1'],
            ['Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1', 'Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1'],
            ['Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1', 'Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1'],
            ['Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1', 'Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1'],
            ['Water.1.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1', 'Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1'],
            ['Water.1.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1', 'Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1'],
            ['Water.1.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1', 'Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1','Grass.6.1'],
            ['Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1', 'Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1'],
            ['Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1', 'Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1','Water.1.1']
          ]
        self.map_data_access.add_map(user_id, 34, 20)
        map_id = self.user_data_access.get_maps_by_user(user_id, 1).map_id # Currently only the first map of the user
        for row in range(len(terrain_tiles)):
            for col in range(len(terrain_tiles[row])):
                self.tile_data_access.add_tile(row, col, terrain_tiles[row][col], map_id)