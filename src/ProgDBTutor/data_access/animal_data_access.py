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

    def get_animals(self, username: str):
        """
        Get animals for the current owner
        :param username: The user that owns the animals
        :return: a list of animal objects of a given owner
        """
        cursor = self.db_connection.get_cursor()
        cursor.execute("SELECT * FROM animals WHERE owner = %s", (username,))
        results = cursor.fetchall()
        animals = []
        for result in results:
            animals.append(Animal(username, result['species'], result['amount'], result['last_updated']))
        return animals

    def update_animal(self, animal: Animal):
        """
        Update animal in the database for a given owner set last updated to False to not update the last_updated cell (last_updated is used for idle animal incrementation).
        :param animal: Animal object to be updated.
        :return: True if updated successfully, False otherwise.
        """
        if not animal.last_updated and animal.amount is None:
            return False
        cursor = self.db_connection.get_cursor()
        if not animal.last_updated:
            cursor.execute("UPDATE animals SET amount = %s WHERE owner = %s AND species = %s",
                           (animal.amount, animal.owner, animal.species))
        elif animal.amount is None:
            cursor.execute("UPDATE animals SET  last_updated = %s WHERE owner = %s AND species = %s",
                           ( animal.last_updated, animal.owner, animal.species))
        else:
            cursor.execute("UPDATE animals SET amount = %s, last_updated = %s WHERE owner = %s AND species = %s",
                           (animal.amount, animal.last_updated, animal.owner, animal.species))
        self.db_connection.conn.commit()
        if cursor.rowcount > 0:
            return True
        else:
            return False
