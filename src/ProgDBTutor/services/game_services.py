from data_access.user_data_access import UserDataAccess
from data_access.map_data_access import MapDataAccess
from data_access.tile_data_access import TileDataAccess

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

    def create_new_farm(self, user_id, farm_name):
        """
        Creates a new farm for a user.
        """
        # Logic to create a new farm, involving database operations.
        # This might include checking if the user exists and if the farm name is unique.
        pass

    def plant_crop(self, farm_id, crop_id, quantity):
        """
        Plants a specified quantity of a crop on a farm.
        """
        # Logic to plant a crop, including checking if the farm and crop exist,
        # and if the farm has enough space or resources for the planting.
        pass

    def harvest_crop(self, farm_id, crop_id):
        """
        Harvests a crop from a farm, updating the farm's resources.
        """
        # Logic to harvest a crop, which could involve checking the crop's growth time,
        # updating the farm's inventory, and possibly affecting the farm's economy.
        pass

    def upgrade_building(self, farm_id, building_id):
        """
        Upgrades a building on a farm, improving its benefits.
        """
        # Logic to upgrade a building, which may include cost calculation,
        # checking if the upgrade is available, and applying the upgrade effects.
        pass