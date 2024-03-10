class TileDataAccess:
    def __init__(self, db_connection):
        self.db_connection = db_connection

    def get_tile(self, x, y):
        cursor = self.db_connection.get_cursor()
        cursor.execute("SELECT terrain_type FROM map_tiles WHERE x = %s AND y = %s", (x, y))
        return cursor.fetchone()

    def add_tile(self, x, y, terrain_type):
        cursor = self.db_connection.get_cursor()
        cursor.execute("INSERT INTO map_tiles (x, y, terrain_type) VALUES (%s, %s, %s)", (x, y, terrain_type))
        self.db_connection.commit()