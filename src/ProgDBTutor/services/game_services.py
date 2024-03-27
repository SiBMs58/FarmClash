from data_access.user_data_access import UserDataAccess
from data_access.map_data_access import MapDataAccess
from data_access.resource_data_access import ResourceDataAccess
from models.map import Map
from models.tile import Tile
from models.resource import Resource
from services.map_creator import generate_map


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

        terrain_tiles = generate_map()

        self.map_data_access.add_map(Map(None, username, len(terrain_tiles[0]), len(terrain_tiles)))
        map = self.map_data_access.get_map_by_username_owner(username)  # TODO: Currently we just get the first map
        for row in range(len(terrain_tiles)):
            for col in range(len(terrain_tiles[row])):
                self.tile_data_access.add_tile(Tile(None, map.map_id, col, row, terrain_tiles[row][col], None))

    def initialize_resources(self, username):
        """
        Initialize default, starting resources when a user registers
        :param username:  The username object of the user
        """
        self.resource_data_access.add_resource(Resource(None, username, "Money", 50))
        self.resource_data_access.add_resource(Resource(None, username, "Corn", 20))
        self.resource_data_access.add_resource(Resource(None, username, "Carrot", 0))
        self.resource_data_access.add_resource(Resource(None, username, "Cauliflower", 0))
        self.resource_data_access.add_resource(Resource(None, username, "Tomato", 0))
        self.resource_data_access.add_resource(Resource(None, username, "Eggplant", 0))
        self.resource_data_access.add_resource(Resource(None, username, "Lettuce", 0))
        self.resource_data_access.add_resource(Resource(None, username, "Wheat", 0))
        self.resource_data_access.add_resource(Resource(None, username, "Beetroot", 0))
        self.resource_data_access.add_resource(Resource(None, username, "Daikon", 0))
        self.resource_data_access.add_resource(Resource(None, username, "Zucchini", 0))

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
            terrain_type = tile.terrain_type
            # print(tile.y, tile.x, terrain_type)
            terrain_tiles[tile.y][tile.x] = terrain_type

        # Construct the final structure
        formatted_data = {
            "map_width": map_width,
            "map_height": map_height,
            "terrain_tiles": terrain_tiles
        }

        return formatted_data
