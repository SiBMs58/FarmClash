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
            return result
        else:
            return None