from models.building import Building

class BuildingDataAccess:
    def __init__(self, db_connection):
        self.db_connection = db_connection

    def get_building(self, building_id):
        """
        Fetches the building with the given id out of the database
        :param building_id: the id of the building aka the primary key
        :return: The building object with the given id, if not found return None
        """
        cursor = self.db_connection.get_cursor()
        cursor.execute("SELECT * FROM buildings WHERE building_id = %s", (building_id,))
        result = cursor.fetchone()
        if result:
            return Building(result['building_id'], result['username_owner'], result['farm_id'],
                            result['building_type'], result['level'], result['x'], result['y'],
                            result['tile_rel_locations'], result['created_at'])
        else:
            return None

    def get_buildings_by_username_owner(self, username_owner):
        """
        Fetches all buildings belonging to the given username_owner from the database
        :param username_owner: the username of the owner
        :return: A list of Building objects belonging to the given username_owner, an empty list if none found
        """
        cursor = self.db_connection.get_cursor()
        cursor.execute("SELECT * FROM buildings WHERE username_owner = %s", (username_owner,))
        results = cursor.fetchall()

        buildings = []
        for result in results:
            building = Building(result['building_id'], result['username_owner'], result['building_type'],
                                result['level'], result['x'], result['y'], result['tile_rel_locations'],
                                result['created_at'])
            buildings.append(building)

        return buildings

    def get_buildings_by_username_and_type(self, username_owner, building_type):
        """
        Fetches all buildings belonging to the given username_owner and building_type from the database
        :param username_owner: the username of the owner
        :param building_type: the type of the building
        :return: A list of Building objects belonging to the given username_owner and building_type, an empty list if none found
        """
        cursor = self.db_connection.get_cursor()
        cursor.execute("SELECT * FROM buildings WHERE username_owner = %s AND building_type = %s",
                       (username_owner, building_type))
        results = cursor.fetchall()

        buildings = []
        for result in results:
            building = Building(result['building_id'], result['username_owner'], result['building_type'],
                                result['level'], result['x'], result['y'], result['tile_rel_locations'],
                                result['created_at'], result['augment_level'])
            buildings.append(building)

        return buildings

    def add_building(self, building):
        """
        Adds or updates the given building object in the database
        :param building: A Building object
        :return: True if the building was added/updated successfully, False otherwise
        """
        cursor = self.db_connection.get_cursor()
        try:
            # Check if the building already exists for the given username and building_id
            cursor.execute("SELECT * FROM buildings WHERE username_owner = %s AND building_id = %s",
                           (building.username_owner, building.building_id))
            existing_building = cursor.fetchone()
            if existing_building:
                # Update the existing building entry
                cursor.execute("""
                    UPDATE buildings
                    SET building_type = %s, level = %s, x = %s, y = %s, 
                    tile_rel_locations = %s, created_at = %s
                    WHERE username_owner = %s AND building_id = %s;
                """, (building.building_type, building.level,
                      building.x, building.y, building.tile_rel_locations, building.created_at,
                      building.username_owner, building.building_id))
            else:
                # Insert a new building entry
                cursor.execute("""
                    INSERT INTO buildings (building_id, username_owner, building_type, level, x, y, 
                    tile_rel_locations, created_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (username_owner, building_id) DO UPDATE 
                    SET building_type = EXCLUDED.building_type, level = EXCLUDED.level,
                        x = EXCLUDED.x, y = EXCLUDED.y, tile_rel_locations = EXCLUDED.tile_rel_locations,
                        created_at = EXCLUDED.created_at;
                """, (building.building_id, building.username_owner, building.building_type,
                      building.level, building.x, building.y, building.tile_rel_locations, building.created_at))
            self.db_connection.conn.commit()
            return True
        except Exception as e:
            # Handle exceptions
            print("Error:", e)
            return False


