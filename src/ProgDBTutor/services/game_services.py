from data_access.user_data_access import UserDataAccess
from data_access.map_data_access import MapDataAccess
from data_access.resource_data_access import ResourceDataAccess
from models.map import Map
from models.tile import Tile
from models.resource import Resource


class GameServices:
    def __init__(self, user_data_access, map_data_access, tile_data_access, resource_data_access):
        self.user_data_access = user_data_access
        self.map_data_access = map_data_access
        self.tile_data_access = tile_data_access
        self.resource_data_access = resource_data_access

    def create_default_map(self, username):
        """
        Creates a default map for a user.
        :param username: The username of the user. aka the primary key
        """
        # Logic to create a default map, involving database operations.
        # This might include checking if the user exists and if the default map already exists.
        terrain_tiles = [
            ['Water.1.1', 'Grass.6.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1',
             'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1',
             'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1',
             'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1',
             'Water.1.1', 'Water.1.1'],
            ['Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1',
             'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1',
             'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1',
             'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1',
             'Water.1.1', 'Water.1.1'],
            ['Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1',
             'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1',
             'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1',
             'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1',
             'Water.1.1', 'Water.1.1'],
            ['Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1',
             'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1',
             'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1',
             'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1',
             'Water.1.1', 'Water.1.1'],
            ['Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1',
             'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1',
             'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1',
             'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1',
             'Water.1.1', 'Water.1.1'],
            ['Water.1.1', 'Water.1.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Water.1.1', 'Grass.6.1', 'Grass.6.1',
             'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Water.1.1', 'Grass.6.1', 'Grass.6.1',
             'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1',
             'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1',
             'Grass.6.1', 'Grass.6.1'],
            ['Water.1.1', 'Water.1.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Water.1.1', 'Grass.6.1', 'Grass.6.1',
             'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Water.1.1', 'Grass.6.1', 'Grass.6.1',
             'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1',
             'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1',
             'Grass.6.1', 'Grass.6.1'],
            ['Water.1.1', 'Water.1.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Water.1.1', 'Grass.6.1', 'Grass.6.1',
             'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Water.1.1', 'Grass.6.1', 'Grass.6.1',
             'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1',
             'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1',
             'Grass.6.1', 'Grass.6.1'],
            ['Water.1.1', 'Water.1.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Water.1.1', 'Grass.6.1', 'Grass.6.1',
             'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Water.1.1', 'Grass.6.1', 'Grass.6.1',
             'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1',
             'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1',
             'Grass.6.1', 'Grass.6.1'],
            ['Water.1.1', 'Water.1.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Water.1.1', 'Grass.6.1', 'Grass.6.1',
             'Grass.6.1', 'Water.1.1', 'Water.1.1', 'Grass.6.1', 'Grass.6.1', 'Water.1.1', 'Grass.6.1', 'Grass.6.1',
             'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1',
             'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1',
             'Grass.6.1', 'Grass.6.1'],
            ['Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1',
             'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1',
             'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1',
             'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1',
             'Water.1.1', 'Water.1.1'],
            ['Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1',
             'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1',
             'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1',
             'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1',
             'Water.1.1', 'Water.1.1'],
            ['Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1',
             'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1',
             'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1',
             'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1',
             'Water.1.1', 'Water.1.1'],
            ['Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1',
             'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1',
             'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1',
             'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1',
             'Water.1.1', 'Water.1.1'],
            ['Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1',
             'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1',
             'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1',
             'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1',
             'Water.1.1', 'Water.1.1'],
            ['Water.1.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1',
             'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1',
             'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1',
             'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1',
             'Grass.6.1', 'Grass.6.1'],
            ['Water.1.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1',
             'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1',
             'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1',
             'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1',
             'Grass.6.1', 'Grass.6.1'],
            ['Water.1.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1',
             'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1',
             'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1',
             'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1', 'Grass.6.1',
             'Grass.6.1', 'Grass.6.1'],
            ['Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1',
             'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1',
             'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1',
             'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1',
             'Water.1.1', 'Water.1.1'],
            ['Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1',
             'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1',
             'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1',
             'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1', 'Water.1.1',
             'Water.1.1', 'Water.1.1']
        ]
        self.map_data_access.add_map(Map(None, username, 34, 20))
        map = self.map_data_access.get_map_by_username_owner(username)  # TODO: Currently we just get the first map
        for row in range(len(terrain_tiles)):
            for col in range(len(terrain_tiles[row])):
                self.tile_data_access.add_tile(Tile(None, map.map_id, col, row, terrain_tiles[row][col], None))

    def initialize_resources(self, username):
        """
        Initialize default, starting resources when a user registers
        :param username:  The username object of the user
        """
        self.resource_data_access.add_resource(Resource(1, username, "Money", 50))
        self.resource_data_access.add_resource(Resource(2, username, "Potato", 20))
        self.resource_data_access.add_resource(Resource(3, username, "Carrot", 0))
        self.resource_data_access.add_resource(Resource(4, username, "Wheat", 0))
