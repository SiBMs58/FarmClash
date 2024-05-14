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

    def update_by_adding_resource(self, resource):
        """
        update resource in the db by adding a value to the quantity
        :param resource: A resource object
        :return: True if added successfully, False otherwise
        """
        cursor = self.db_connection.get_cursor()
        cursor.execute('SELECT * FROM resources WHERE owner = %s AND type = %s',
                       (resource.username_owner, resource.resource_type))
        result = cursor.fetchone()
        new_quantity = result['quantity'] + resource.amount
        if new_quantity < 0:
            return [False,
                    f'{resource.resource_type} quantity cannot be negative. {result["quantity"]} + {resource.amount} = {new_quantity}']
        cursor.execute('UPDATE resources SET quantity = %s WHERE owner = %s AND type = %s',
                       (new_quantity, resource.username_owner, resource.resource_type))
        self.db_connection.conn.commit()
        return [True, '']