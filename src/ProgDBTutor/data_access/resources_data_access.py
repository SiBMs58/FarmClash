from models.resource import Resource
class ResourcesDataAccess:
    def __init__(self, db_connection):
        self.db_connection = db_connection

    def get_resources(self, username_owner):
        """
        Get resources for the current owner
        :param username_owner: The user that owns the resources
        :return: An list of resources objects
        """
        cursor = self.db_connection.get_cursor()
        cursor.execute('SELECT * FROM resources WHERE username_owner = %s', (username_owner,))
        rows = cursor.fetchall()
        resources = []
        for row in rows:
            resources.append(Resource(row['resource_type'], row['amount']))
        return resources