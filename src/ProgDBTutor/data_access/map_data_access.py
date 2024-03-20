from models.map import Map
class MapDataAccess:
    def __init__(self, db_connection):
        self.db_connection = db_connection

    def get_map(self, map_id):
        """
        Fetches the map with the given id out of the database
        :param map_id: the id of the map aka the primary key
        :return: The map object with the given id, if not found return None
        """
        cursor = self.db_connection.get_cursor()
        cursor.execute("SELECT * FROM game_maps WHERE map_id = %s", (map_id,))
        result = cursor.fetchone()
        if result:
            return Map(result['map_id'], result['username_owner'], result['map_width'], result['map_height'], result['created_at'])
        else:
            return None

    def get_map_by_username_owner(self, username_owner):
        """
        Fetches the map with the given username_owner out of the database
        :param username_owner: the username of the owner
        :return: The map object with the given username_owner, if not found return None
        """
        cursor = self.db_connection.get_cursor()
        cursor.execute("SELECT * FROM game_maps WHERE username_owner = %s", (username_owner,))
        result = cursor.fetchone()
        if result:
            return Map(result['map_id'], result['username_owner'], result['width'], result['height'], result['created_at'])
        else:
            return None

    def get_all_maps(self):
        """
        Fetches all maps out of the database
        :return: List of map objects
        """
        cursor = self.db_connection.get_cursor()
        cursor.execute("SELECT * FROM game_maps")
        results = cursor.fetchall()
        return [Map(result['map_id'], result['username_owner'], result['width'], result['height'], result['created_at']) for result in results]

    def add_map(self, map):
        """
        Adds the given map object to the database
        :param map: A map object
        :return: True if the map was added successfully, False otherwise
        """
        cursor = self.db_connection.get_cursor()
        if map.map_id is None:
            cursor.execute(
                "INSERT INTO game_maps (username_owner, width, height, created_at) VALUES (%s, %s, %s, %s)",
                (map.username_owner, map.width, map.height, map.created_at))
        else:
            cursor.execute("INSERT INTO game_maps (map_id, username_owner, width, height, created_at) VALUES (%s, %s, %s, %s, %s)",
                       (map.map_id, map.username_owner, map.width, map.height, map.created_at))
        self.db_connection.conn.commit()
        return True