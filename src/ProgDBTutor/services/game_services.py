from data_access.user_data_access import UserDataAccess
from data_access.map_data_access import MapDataAccess
from data_access.resource_data_access import ResourceDataAccess
from data_access.animal_data_access import AnimalDataAccess
from data_access.building_data_access import BuildingDataAccess
from flask import current_app
from data_access.animal_data_access import AnimalDataAccess
from models.map import Map
from models.building import Building
from models.animal import Animal
from models.animal import Animal
from models.tile import Tile
from models.resource import Resource
from services.map_creator import generate_map
import json
import os


class GameServices:
    def __init__(self, user_data_access, map_data_access, tile_data_access, resource_data_access, animal_data_access,
                 building_data_access):
        self.user_data_access = user_data_access
        self.map_data_access = map_data_access
        self.tile_data_access = tile_data_access
        self.resource_data_access = resource_data_access
        self.animal_data_access = animal_data_access
        self.building_data_access = building_data_access

    def create_default_map(self, username):
        """
        Creates a default map for a user.
        :param username: The username of the user. aka the primary key
        """
        # Logic to create a default map, involving database operations.
        # This might include checking if the user exists and if the default map already exists.

        terrain_tiles = generate_map()

        self.map_data_access.add_map(Map(None, username, len(terrain_tiles[0]), len(terrain_tiles)))
        map = self.map_data_access.get_map_by_username_owner(username)
        for row in range(len(terrain_tiles)):
            for col in range(len(terrain_tiles[row])):
                self.tile_data_access.add_tile(Tile(None, map.map_id, col, row, terrain_tiles[row][col], None))

    def initialize_resources(self, username):
        """
        Initialize default, starting resources when a user registers
        :param username:  The username object of the user
        """
        # Money
        self.resource_data_access.add_resource(Resource(username, "Money", 50))

        # Crops (can be stolen in an attack)
        self.resource_data_access.add_resource(Resource(username, "Wheat", 100))
        self.resource_data_access.add_resource(Resource(username, "Carrot", 0))
        self.resource_data_access.add_resource(Resource(username, "Corn", 0))
        self.resource_data_access.add_resource(Resource(username, "Lettuce", 0))
        self.resource_data_access.add_resource(Resource(username, "Tomato", 0))
        self.resource_data_access.add_resource(Resource(username, "Turnip", 0))
        self.resource_data_access.add_resource(Resource(username, "Zucchini", 0))
        self.resource_data_access.add_resource(Resource(username, "Parsnip", 0))
        self.resource_data_access.add_resource(Resource(username, "Cauliflower", 0))
        self.resource_data_access.add_resource(Resource(username, "Eggplant", 0))

        # From Chickens
        self.resource_data_access.add_resource(Resource(username, "Egg", 0))
        self.resource_data_access.add_resource(Resource(username, "Rustic Egg", 0))
        self.resource_data_access.add_resource(Resource(username, "Crimson Egg", 0))
        self.resource_data_access.add_resource(Resource(username, "Emerald Egg", 0))
        self.resource_data_access.add_resource(Resource(username, "Sapphire Egg", 0))

        # From Cows
        self.resource_data_access.add_resource(Resource(username, "Milk", 0))
        self.resource_data_access.add_resource(Resource(username, "Chocolate Milk", 0))
        self.resource_data_access.add_resource(Resource(username, "Strawberry Milk", 0))
        self.resource_data_access.add_resource(Resource(username, "Soy Milk", 0))
        self.resource_data_access.add_resource(Resource(username, "Blueberry Milk", 0))

        # From Goats
        self.resource_data_access.add_resource(Resource(username, "Wool", 0))
        self.resource_data_access.add_resource(Resource(username, "Alpaca Wool", 0))
        self.resource_data_access.add_resource(Resource(username, "Cashmere Wool", 0))
        self.resource_data_access.add_resource(Resource(username, "Dolphin Wool", 0))
        self.resource_data_access.add_resource(Resource(username, "Irish Wool", 0))

        # From Pigs
        self.resource_data_access.add_resource(Resource(username, "Truffle", 0))
        self.resource_data_access.add_resource(Resource(username, "Bronze Truffle", 0))
        self.resource_data_access.add_resource(Resource(username, "Gold Truffle", 0))
        self.resource_data_access.add_resource(Resource(username, "Forest Truffle", 0))
        self.resource_data_access.add_resource(Resource(username, "Winter Truffle", 0))

        # From exploring (can also be stolen in an attack)
        self.resource_data_access.add_resource(Resource(username, "Stick", 0))
        self.resource_data_access.add_resource(Resource(username, "Stone", 0))
        self.resource_data_access.add_resource(Resource(username, "Plank", 0))
        self.resource_data_access.add_resource(Resource(username, "Log", 0))
        self.resource_data_access.add_resource(Resource(username, "Ingot", 0))

    def initialize_animals(self, username):
        """
        Initialize default, starting animals when a user registers
        :param username:  The username object of the user
        """
        self.animal_data_access.add_animal(Animal(username, "Chicken", 0))
        self.animal_data_access.add_animal(Animal(username, "Cow", 0))
        self.animal_data_access.add_animal(Animal(username, "Pig", 0))
        self.animal_data_access.add_animal(Animal(username, "Goat", 0))

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
