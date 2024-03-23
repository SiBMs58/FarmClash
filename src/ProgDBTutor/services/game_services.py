from data_access.user_data_access import UserDataAccess
from data_access.map_data_access import MapDataAccess
from models.map import Map
from models.tile import Tile

class GameServices:
    def __init__(self, user_data_access, map_data_access, tile_data_access):
        self.user_data_access = user_data_access
        self.map_data_access = map_data_access
        self.tile_data_access = tile_data_access

    def create_default_map(self, username):
        """
        Creates a default map for a user.
        :param username: The username of the user. aka the primary key
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
        self.map_data_access.add_map(Map(None, username, 34, 20))
        map = self.map_data_access.get_map_by_username_owner(username) # TODO: Currently we just get the first map
        for row in range(len(terrain_tiles)):
            for col in range(len(terrain_tiles[row])):
                self.tile_data_access.add_tile(Tile(None, map.map_id, col, row, terrain_tiles[row][col], None))

    # TODO: def initialize_resources(self):


    def reformat_terrain_map(self, tile_data, map_width, map_height):
        """
        Generate the formatted (so the front end can easily read it) terrain map data based on the provided tile data.
        Parameters:
            tile_data (list): A list of dictionaries containing the x, y, and terrain_type for each tile.
            map_width (int): The width of the map.
            map_height (int): The height of the map.
        Returns: dict: A dictionary containing the formatted map data with map_width, map_height, and terrain_tiles.
        """
        # Initialize the terrain tiles grid with a default value
        terrain_tiles = [["Water.1.1" for _ in range(map_width)] for _ in range(map_height)]

        # Populate the terrain tiles grid based on the provided tile data
        for tile in tile_data:
            x = tile['x']
            y = tile['y']
            terrain_type = tile['terrain_type']
            terrain_tiles[y][x] = terrain_type

        # Construct the final structure
        formatted_data = {
            "map_width": map_width,
            "map_height": map_height,
            "terrain_tiles": terrain_tiles
        }

        return formatted_data