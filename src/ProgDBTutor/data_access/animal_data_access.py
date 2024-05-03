from models.animal import Animal


class AnimalDataAccess:
    def __init__(self, db_connection):
        self.db_connection = db_connection

    def add_animal(self, animal: Animal):
        """
            add an animal to the db
            :param animal: A Animal object
            :return: True if added successfully, False otherwise
            """
        cursor = self.db_connection.get_cursor()
        cursor.execute(
            "INSERT INTO animals (owner, species, amount, last_updated) VALUES (%s, %s, %s, %s)",
            (animal.owner, animal.species, animal.amount, animal.last_updated))
        self.db_connection.conn.commit()
        return True

    def get_animal(self, username: str):
        """
        Get animal for the current owner
        :param username: The user that owns the animal
        :return: An animal object if one exists, None otherwise
        """
        cursor = self.db_connection.get_cursor()
        cursor.execute("SELECT * FROM animals WHERE owner = %s", (username,))
        result = cursor.fetchone()
        if result:
            return Animal(username, result['species'], result['amount'], result['last_updated'])
        else:
            return None

    def update_animal(self, animal: Animal):
        """
        Update animal in the database for a given owner.
        :param animal: Animal object to be updated.
        :return: True if updated successfully, False otherwise.
        """
        cursor = self.db_connection.get_cursor()
        cursor.execute("UPDATE animals SET amount = %s, last_updated = %s WHERE owner = %s AND species = %s",
                       (animal.amount, animal.last_updated, animal.owner, animal.species))
        self.db_connection.conn.commit()
        # Check if any rows were affected
        if cursor.rowcount > 0:
            return True
        else:
            return False
