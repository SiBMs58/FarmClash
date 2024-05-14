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

        create_building_map(username, terrain_tiles)

    def create_building_map(self, username, terrain_map):
        self.building_data_access.add_building(Building("bay", username, "Bay", x=0, y=15, level=0))
        self.building_data_access.add_building(Building("townhall", username, "Townhall", x=6, y=15, level=0))
        self.building_data_access.add_building(Building("barn", username, "Barn", x=4, y=10, level=1)) #TODO position
        self.building_data_access.add_building(Building("silo", username, "Silo", x=21, y=6, level=1)) #TODO position

        # concatenate name with counter for building_id
        fenceCounter = 0
        fieldCounter = 0
        pigCounter = 0
        cowCounter = 0
        goatCounter = 0
        chickenCounter = 0
        harvestHopperCounter = 0

        ## 3 fences per cloud area

        ## 6 farm fields per cloud area or one of 3 Pigpens, 3 Chicken Coops, 3 Cow Barns, 3 Goat Barns in total

        ## 3 harvesthoppers in total
        return True

    def initialize_resources(self, username):
        """
        Initialize default, starting resources when a user registers
        :param username:  The username object of the user
        """
        # Money
        self.resource_data_access.add_resource(Resource(None, username, "Money", 50))

        # Crops (can be stolen in an attack)
        self.resource_data_access.add_resource(Resource(None, username, "Wheat", 100))
        self.resource_data_access.add_resource(Resource(None, username, "Carrot", 0))
        self.resource_data_access.add_resource(Resource(None, username, "Corn", 0))
        self.resource_data_access.add_resource(Resource(None, username, "Lettuce", 0))
        self.resource_data_access.add_resource(Resource(None, username, "Tomato", 0))
        self.resource_data_access.add_resource(Resource(None, username, "Turnip", 0))
        self.resource_data_access.add_resource(Resource(None, username, "Zucchini", 0))
        self.resource_data_access.add_resource(Resource(None, username, "Parsnip", 0))
        self.resource_data_access.add_resource(Resource(None, username, "Cauliflower", 0))
        self.resource_data_access.add_resource(Resource(None, username, "Eggplant", 0))

        # From Chickens
        self.resource_data_access.add_resource(Resource(None, username, "Egg", 0))
        self.resource_data_access.add_resource(Resource(None, username, "Rustic Egg", 0))
        self.resource_data_access.add_resource(Resource(None, username, "Crimson Egg", 0))
        self.resource_data_access.add_resource(Resource(None, username, "Emerald Egg", 0))
        self.resource_data_access.add_resource(Resource(None, username, "Sapphire Egg", 0))

        # From Cows
        self.resource_data_access.add_resource(Resource(None, username, "Milk", 0))
        self.resource_data_access.add_resource(Resource(None, username, "Chocolate Milk", 0))
        self.resource_data_access.add_resource(Resource(None, username, "Strawberry Milk", 0))
        self.resource_data_access.add_resource(Resource(None, username, "Soy Milk", 0))
        self.resource_data_access.add_resource(Resource(None, username, "Blueberry Milk", 0))

        # From Goats
        self.resource_data_access.add_resource(Resource(None, username, "Wool", 0))
        self.resource_data_access.add_resource(Resource(None, username, "Alpaca Wool", 0))
        self.resource_data_access.add_resource(Resource(None, username, "Cashmere Wool", 0))
        self.resource_data_access.add_resource(Resource(None, username, "Dolphin Wool", 0))
        self.resource_data_access.add_resource(Resource(None, username, "Irish Wool", 0))

        # From Pigs
        self.resource_data_access.add_resource(Resource(None, username, "Truffle", 0))
        self.resource_data_access.add_resource(Resource(None, username, "Bronze Truffle", 0))
        self.resource_data_access.add_resource(Resource(None, username, "Gold Truffle", 0))
        self.resource_data_access.add_resource(Resource(None, username, "Forest Truffle", 0))
        self.resource_data_access.add_resource(Resource(None, username, "Winter Truffle", 0))

        # From exploring (can also be stolen in an attack)
        self.resource_data_access.add_resource(Resource(None, username, "Stick", 0))
        self.resource_data_access.add_resource(Resource(None, username, "Stone", 0))
        self.resource_data_access.add_resource(Resource(None, username, "Plank", 0))
        self.resource_data_access.add_resource(Resource(None, username, "Log", 0))
        self.resource_data_access.add_resource(Resource(None, username, "Ingot", 0))

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
