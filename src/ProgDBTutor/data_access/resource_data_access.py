from models.resource import Resource
class ResourceDataAccess:
    def __init__(self, db_connection):
        self.db_connection = db_connection

    def get_resources(self, username_owner):
        """
        Get resources for the current owner
        :param username_owner: The user that owns the resources
        :return: An list of resources objects
        """
        cursor = self.db_connection.get_cursor()
        cursor.execute('SELECT * FROM resources WHERE owner = %s', (username_owner,))
        rows = cursor.fetchall()
        resources = []
        for row in rows:
            resources.append(Resource(row['resource_id'], row['owner'], row['type'], row['quantity']))
        return resources

    def get_all_resources(self):
        """
        Get all resources
        :return: An list of resources objects
        """
        cursor = self.db_connection.get_cursor()
        cursor.execute('SELECT * FROM resources')
        rows = cursor.fetchall()
        resources = []
        for row in rows:
            resources.append(Resource(row['resource_id'], row['owner'], row['type'], row['quantity']))
        return resources

    def add_resource(self, resource):
        """
        Add resource to the db
        :param resource: A resource object
        :return: True if added successfully, False otherwise
        """
        cursor = self.db_connection.get_cursor()
        cursor.execute('INSERT INTO resources (type, quantity, owner) VALUES (%s, %s, %s)',
                       (resource.resource_type, resource.amount, resource.username_owner))
        self.db_connection.conn.commit()
        return True

    def update_resource(self, username_owner, resource_type, amount):
        """
        Update the resource for the user by adding the specified amount to the existing quantity.
        :param username_owner: The username of the resource owner.
        :param resource_type: The type of the resource to update.
        :param amount: The amount to add to or subtract from the existing resource quantity.
        :return: True if the operation was successful, otherwise False.
        """
        cursor = self.db_connection.get_cursor()
        # SQL query to increment the resource quantity by the given amount only if it does not go below zero
        cursor.execute(
            'UPDATE resources SET quantity = GREATEST(0, quantity + %s) WHERE owner = %s AND type = %s',
            (amount, username_owner, resource_type)
        )
        # Check if the update was successful
        if cursor.rowcount == 0:
            # No rows updated, possibly because the resource doesn't exist for the user or no change was necessary
            return False
        self.db_connection.conn.commit()
        return True
