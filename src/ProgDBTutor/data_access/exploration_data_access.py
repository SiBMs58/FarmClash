from models.exploration import Exploration


class ExplorationDataAccess:
    def __init__(self, db_connection):
        self.db_connection = db_connection

    def start_exploration(self, exploration: Exploration):
        """
        Add resource to the db
        :param exploration: A Exploration object
        :return: True if added successfully, False otherwise
        """
        cursor = self.db_connection.get_cursor()
        cursor.execute(
            'INSERT INTO explorations (started_at, duration, chickens, goats, pigs, cows, exploration_level, augment_level, owner) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)',
            (exploration.started_at, exploration.duration, exploration.chickens, exploration.goats, exploration.pigs,
             exploration.cows, exploration.level, exploration.augment, exploration.owner))
        self.db_connection.conn.commit()
        return True

    def get_exploration(self, username_owner: str):
        """
        Get explorations for the current owner
        :param username_owner: The user that owns the explorations
        :return: An list of exploration-- objects
        """
        cursor = self.db_connection.get_cursor()
        cursor.execute('SELECT * FROM explorations WHERE owner = %s', (username_owner,))
        rows = cursor.fetchall()
        exploration: Exploration = Exploration()
        for row in rows:
            exploration = Exploration(row['owner'], row['chickens'], row['goats'], row['pigs'], row['cows'],
                                      row['exploration_level'], row['augment_level'], row['duration'], row['started_at'])
            break
        return exploration

    def stop_exploration(self, username_owner: str):
        """
        Delete exploration from the database for a given owner.
        :param username_owner: Username of the owner whose exploration needs to be deleted.
        :return: True if deleted successfully, False otherwise.
        """
        cursor = self.db_connection.get_cursor()
        cursor.execute('DELETE FROM explorations WHERE owner = %s', (username_owner,))
        self.db_connection.conn.commit()
        # Check if any rows were affected
        if cursor.rowcount > 0:
            return True
        else:
            return False
