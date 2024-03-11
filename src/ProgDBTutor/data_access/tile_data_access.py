class TileDataAccess:
    def __init__(self, db_connection):
        self.db_connection = db_connection

    def get_tile(self, x, y, map_id):
        cursor = self.db_connection.get_cursor()
        cursor.execute("SELECT terrain_type FROM map_tiles WHERE x = %s AND y = %s AND map_id = %s", (x, y, map_id))
        return cursor.fetchone()

    def add_tile(self, x, y, terrain_type, map_id):
        cursor = self.db_connection.get_cursor()
        cursor.execute("INSERT INTO map_tiles (x, y, terrain_type, map_id) VALUES (%s, %s, %s, %s)", (x, y, terrain_type, map_id))
        self.db_connection.commit()