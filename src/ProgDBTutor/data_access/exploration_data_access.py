from models.exploration import Exploration
from threading import Lock


class ExplorationDataAccess:
    def __init__(self, db_connection):
        self.db_connection = db_connection
        self.lock = Lock()

    def start_exploration(self, exploration: Exploration):
        """
        add an exploration to the db
        :param exploration: A Exploration object
        :return: True if added successfully, False otherwise
        """
        with self.lock:
            cursor = self.db_connection.get_cursor()
            cursor.execute(
                "INSERT INTO explorations (started_at, duration, chickens, goats, pigs, cows, exploration_level, "
                "augment_level, owner, surviving_goats, rewards_of_goats, surviving_cows, rewards_of_cows, surviving_pigs, "
                "surviving_chickens, base_rewards) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s,%s, %s, %s, %s, %s, %s, %s)",
                (exploration.started_at, exploration.duration, exploration.chickens, exploration.goats, exploration.pigs,
                 exploration.cows, exploration.level, exploration.augment, exploration.owner, exploration.surviving_goats,
                 exploration.rewards_of_goats, exploration.surviving_cows, exploration.rewards_of_cows,
                 exploration.surviving_pigs, exploration.surviving_chickens, exploration.base_rewards))
            self.db_connection.conn.commit()
            return True

    def get_exploration(self, username: str):
        """
        Get exploration for the current owner
        :param username: The user that owns the exploration
        :return: An exploration object if one exists, None otherwise
        """
        with self.lock:
            cursor = self.db_connection.get_cursor()
            cursor.execute("SELECT * FROM explorations WHERE owner = %s", (username,))
            result = cursor.fetchone()
            if result:
               return Exploration(username, result['chickens'], result['goats'], result['pigs'], result['cows'],
                                  result['exploration_level'], result['augment_level'], result['duration'],
                                  result['started_at'], result['surviving_goats'], result['rewards_of_goats'],
                                  result['surviving_cows'], result['rewards_of_cows'], result['surviving_pigs'],
                                  result['surviving_chickens'], result['base_rewards'])
            else:
               return None

    def stop_exploration(self, username: str):
        """
        Delete exploration from the database for a given owner.
        :param username: Username of the owner whose exploration needs to be deleted.
        :return: True if deleted successfully, False otherwise.
        """
        with self.lock:
            cursor = self.db_connection.get_cursor()
            cursor.execute("DELETE FROM explorations WHERE owner = %s", (username,))
            self.db_connection.conn.commit()
            # Check if any rows were affected
            if cursor.rowcount > 0:
                return True
            else:
                return False
