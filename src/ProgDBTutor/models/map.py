import json
import random

#from Building import Building
from tile import Tile

MAP_WIDTH = 3
MAP_HEIGHT = 3


class Map:
    def __init__(self):
        self.width = MAP_WIDTH
        self.height = MAP_HEIGHT
        self.terrain_data = [[Tile() for x in range(self.width)] for y in range(self.height)]
        self.created_at = 0

    def _can_place(self, x, y, width, height):
        """
        Checks if a building of a given size can be placed at the given position
        :param x:  x position of the building
        :param y:  y position of the building
        :param width: the width of the building
        :param height: the height of the building
        :return: if a building can be placed at the given position
        """
        if x < 0 or y < 0 or self.width < x + width or self.height < y + height:
            return False

        for Y in range(height):
            for X in range(width):
                if self.terrain_data[y + Y][x + X].get_building() is not None:
                    return False
        return True

    def _replace(self, x, y, width, height, building):
        """
        Places the building in the map at the given coordinates, overrides other buildings (that's why this is private)
        :param x: x position
        :param y: y position
        :param width: the width of the building
        :param height:
        :param building:
        :return:
        """
        for Y in range(height):
            for X in range(width):
                self.terrain_data[y + Y][x + X].set_building(building)

    def place_building(self, x, y, building):
        """
        Places the building in the map at the given coordinates if there is no other building in the way and if it is in bounds
        :param x: x position of the building
        :param y: y position of the building
        :param building: the building
        :return: True if placed, False otherwise
        """
        if not self._can_place(x, y, building.width, building.height):
            print("Cannot place structure at (" + str(x) + "," + str(y) + ") with size",
                  str(building.width) + "x" + str(building.height))
            return False

        building.x = x
        building.y = y

        self._replace(x, y, building.width, building.height, building)
        return True

    # getting structures
    def take_building(self, x, y):
        """
        Takes the building at position x y and returns it removing it from the map
        :param x: position
        :param y: position
        :return: the building at position x y if there is one, else None
        """
        building = self.get_building(x, y)
        if building is not None:
            self._replace(building.x, building.y, building.width, building.height, None)
        return building

    def get_building(self, x, y):
        """
        Returns the building at position x and y if it is in bounds
        :param x: x position
        :param y: y position
        :return: the building at position, NONE if there is no building or it is out of bounds
        """
        if 0 < x < self.width and 0 < y < self.height:
            return self._map[y][x].get_building()
        return None

    def set_terrain(self, x, y, terrain):
        """
        Set the terrain
        :param x: x position
        :param y: y position
        :param terrain: terrain to set
        """
        if 0 < x < self.width and 0 < y < self.height:
            self._map[y][x].set_terrain(terrain)

    def get_terrain(self, x, y):
        """
        Returns the terrain if the terrain is in the map
        :param x: the x position
        :param y: the y position
        :return: the terrain type
        """
        if 0 < x < self.width and 0 < y < self.height:
            return self._map[y][x].get_terrain()
        return 'OUT OF BOUNDS'

    def to_dict(self):
        """
        Converts the map to a dict and returns it
        :return: the dict of the map
        """
        terrain_map = [[f"{tile.get_terrain()}" for tile in row] for row in self._map]
        structure_map = [[tile.get_building_dict() for tile in row] for row in self._map]

        self_map = {
            "map_width": self.width,
            "map_height": self.height,
            "terrain_tiles": terrain_map,
            "structures": structure_map
        }

        return self_map

    def to_json(self):
        """
        Converts the map to json and returns it and also creates the json file
        This is needed to send data to the client from the server
        :return: the json as a string
        """
        self_map = self.to_dict()

        with open("map.json", 'w') as json_file:
            json.dump(self_map, json_file, indent=4)

        with open("map.json", 'r') as json_file:
            json_string = json_file.read()

        return json_string