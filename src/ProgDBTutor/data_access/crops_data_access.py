from models.crops import Crop

class CropsDataAccess:
    def __init__(self, db_connection):
        self.db_connection = db_connection

    def get_crop(self, crop_id):
        """
        Fetches the crop with the given id from the database
        :param crop_id: the id of the crop (primary key)
        :return: The crop object with the given id, if not found return None
        """
        cursor = self.db_connection.get_cursor()
        cursor.execute("SELECT * FROM crops WHERE crop_id = %s", (crop_id,))
        result = cursor.fetchone()
        if result:
            return Crop(result['name'], result['growth_time'], result['sell_price'])
        else:
            return None

    def get_crop_by_name(self, name):
        """
        Fetches the crop with the given name from the database
        :param name: the name of the crop
        :return: The crop object with the given name, if not found return None
        """
        cursor = self.db_connection.get_cursor()
        cursor.execute("SELECT * FROM crops WHERE name = %s", (name,))
        result = cursor.fetchone()
        if result:
            return Crop(result['name'], result['growth_time'], result['sell_price'])
        else:
            return None

    def get_id_from_name(self, name):
        """
        Fetches the crop id with the given name from the database
        :param name: the name of the crop
        :return: The crop id with the given name, if not found return None
        """
        cursor = self.db_connection.get_cursor()
        cursor.execute("SELECT crop_id FROM crops WHERE name = %s", (name,))
        result = cursor.fetchone()
        if result:
            return result['crop_id']
        else:
            return None

    def add_crop(self, crop):
        """
        Adds the given crop object to the database if it does not already exist
        :param crop: A crop object
        :return: True if the crop was added successfully, False otherwise
        """
        cursor = self.db_connection.get_cursor()
        # Check if the crop with the given name already exists
        cursor.execute("SELECT * FROM crops WHERE name = %s", (crop.name,))
        existing_crop = cursor.fetchone()
        if existing_crop:
            return False  # Crop with the given name already exists
        else:
            # Insert the new crop into the database
            cursor.execute("""
                INSERT INTO crops (name, growth_time, sell_price)
                VALUES (%s, %s, %s)
                RETURNING crop_id;
            """, (crop.name, crop.growth_time, crop.sell_price))
            crop_id = cursor.fetchone()[0]
            self.db_connection.conn.commit()
            return crop_id is not None
