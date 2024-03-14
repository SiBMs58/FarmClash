from models.Tile import Tile
class TileDataAccess:
    def __init__(self, db_connection):
        self.db_connection = db_connection

    def get_tile(self, tile_id):
        """
        Fetches the tile with the given id
        :param tile_id:
        :return: The tile object with the given id, if not found return None
        """
        cursor = self.db_connection.get_cursor()
        cursor.execute("SELECT * FROM map_tiles WHERE tile_id = %s", (tile_id,))
        result = cursor.fetchone()
        if result:
            return Tile(result['tile_id'], result['map_id'], result['x'], result['y'], result['terrain_type'], result['occupant_id'], result['created_at'])
        else:
            return None

    def get_tiles_by_map_id(self, map_id):
        """
        Fetches all the tiles in the given map
        :param map_id: The id of the map
        :return: A list of Tile objects
        """
        cursor = self.db_connection.get_cursor()
        cursor.execute("SELECT * FROM map_tiles WHERE map_id = %s", (map_id,))
        results = cursor.fetchall()
        tiles = []
        for result in results:
            tiles.append(Tile(result['tile_id'], result['map_id'], result['x'], result['y'], result['terrain_type'], result['occupant_id'], result['created_at']))
        return tiles