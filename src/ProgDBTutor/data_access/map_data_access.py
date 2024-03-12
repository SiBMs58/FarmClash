from models.tile import Tile
from models.map import Map

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
        cursor.execute("SELECT x, y, terrain_type FROM map_tiles WHERE map_id = %s ORDER BY x, y", (map_id,))
        tiles = cursor.fetchall()
        return [Tile(x, y, terrain_type) for x, y, terrain_type in tiles]

    def add_map(self, user_id, width, height):
        """Adds a new map to the database."""
        cursor = self.db_connection.get_cursor()
        cursor.execute("INSERT INTO game_maps (user_id, width, height) VALUES (%s, %s, %s) RETURNING map_id", (user_id, width, height))
        self.db_connection.commit()

    def get_all_maps(self):
        cursor = self.db_connection.get_cursor()
        cursor.execute('SELECT * FROM game_maps')
        rows = cursor.fetchall()
        maps = []
        for row in rows:
            if row['user_id'] is not 1:
                tiles = self.get_terrain_tiles(row['map_id'])
                maps.append(Map(row['map_id'], row['user_id'], row['width'], row['height'], tiles, row['created_at']))
        return maps
