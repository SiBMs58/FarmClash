from models.tile import Tile
import json

class MapDataAccess:
    def __init__(self, db_connection):
        self.db_connection = db_connection

    def get_map_dimensions(self, user_id, map_id):
        """Fetches the width and height of a specific map."""
        cursor = self.db_connection.get_cursor()
        cursor.execute("SELECT width, height FROM game_maps WHERE map_id = %s AND user_id = %s", (map_id, user_id))
        return cursor.fetchone()  # Returns a tuple (width, height)

    def get_terrain_tiles(self, map_id):
        """Fetches the terrain tiles for a specific map, organized by their coordinates."""
        cursor = self.db_connection.get_cursor()
        cursor.execute("SELECT x, y, terrain_type FROM map_tiles WHERE map_id = %s ORDER BY y, x", (map_id,))
        tiles = cursor.fetchall()
        return [Tile(x, y, terrain_type) for x, y, terrain_type in tiles]

    def add_map(self, user_id, width, height):
        """Adds a new map to the database."""
        cursor = self.db_connection.get_cursor()
        cursor.execute("INSERT INTO game_maps (user_id, width, height) VALUES (%s, %s, %s) RETURNING map_id", (user_id, width, height))
        self.db_connection.commit()


    """def map_data_to_json(self, user_id, map_id):
        Converts map and tile data for a specific map into JSON format.
        map_dimensions = self.get_map_dimensions(user_id, map_id)
        if not map_dimensions:
            return json.dumps({})  # Return an empty JSON object if no map is found

        map_width, map_height = map_dimensions
        tiles = self.get_terrain_tiles(map_id)

        # Construct the terrain_tiles structure
        terrain_tiles = [[None for _ in range(map_width)] for _ in range(map_height)]
        for tile in tiles:
            terrain_tiles[tile.y][tile.x] = tile.terrain_type

        # Construct the final JSON structure
        map_data = {
            "map_width": map_width,
            "map_height": map_height,
            "terrain_tiles": terrain_tiles
        }

        # Convert to JSON
        return json.dumps(map_data)"""
