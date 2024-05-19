from models.resource import Resource

crops = ['Wheat', 'Carrot', 'Corn', 'Lettuce', 'Tomato', 'Turnip', 'Zucchini', 'Parsnip', 'Cauliflower', 'Eggplant']

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
            resources.append(Resource(row['owner'], row['type'], row['quantity'], row['last_updated']))
        return resources

    def get_resources_by_type(self, username_owner, type):
        """
        Get resources for the current owner
        :param username_owner: The user that owns the resources
        :return: An list of resources objects
        """
        cursor = self.db_connection.get_cursor()
        cursor.execute('SELECT * FROM resources WHERE owner = %s AND resource_type = %s', (username_owner, type))
        rows = cursor.fetchone()
        return Resource(row['owner'], row['type'], row['quantity'], row['last_updated'])

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
            resources.append(Resource( row['owner'], row['type'], row['quantity'], row['last_updated']))
        return resources

    def add_resource(self, resource):
        """
        Add resource to the db
        :param resource: A resource object
        :return: True if added successfully, False otherwise
        """
        cursor = self.db_connection.get_cursor()
        cursor.execute('INSERT INTO resources (type, quantity, owner, last_updated) VALUES (%s, %s, %s, %s)',
                       (resource.resource_type, resource.amount, resource.username_owner, resource.last_updated))
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


    def update_by_adding_resource(self, resource, limit):
        """
        update resource in the db by adding a value to the quantity
        :param resource: A resource object
        :return: True if added successfully, False otherwise
        """
        message = ''

        # get the total of crops or non-crops owned by the user to check if the limit is reached of their store building
        total = 0
        if resource.resource_type in crops:
            total = self.get_crop_total(resource.username_owner)
        else:
            total = self.get_noncrop_total(resource.username_owner)

        # calculate the new quantity
        cursor = self.db_connection.get_cursor()
        cursor.execute('SELECT * FROM resources WHERE owner = %s AND type = %s',
                       (resource.username_owner, resource.resource_type))
        new_quantity = cursor.fetchone()['quantity'] + resource.amount
        if new_quantity < 0:
            return [False, f'{resource.resource_type} quantity cannot be negative. {result["quantity"]} + {resource.amount} = {new_quantity}']
        if resource.resource_type != "Money" and total + resource.amount > limit:
            new_quantity = limit - total
            message = f'{resource.resource_type} exceeded the limit of {limit}.'

        # update the resource quantity
        if not resource.last_updated:
            cursor.execute("UPDATE resources SET quantity = %s WHERE owner = %s AND type = %s",
                           (new_quantity, resource.owner, resource.resource_type))
        else:
            cursor.execute('UPDATE resources SET quantity = %s AND last_updated WHERE owner = %s AND type = %s',
                           (new_quantity,  resource.last_updated, resource.username_owner, resource.resource_type))
        if cursor.rowcount == 0:
            return [True, "No rows updated, possibly because the resource doesn't exist for the user or no change was necessary"]
        self.db_connection.conn.commit()
        return [True, message]

    def get_crop_total(self, username_owner):
        """
        Get the total amount of crops owned by the user
        :param username_owner: The username of the user
        :return: The total amount of crops owned by the user
        """
        cursor = self.db_connection.get_cursor()
        cursor.execute('SELECT SUM(quantity) FROM resources WHERE owner = %s AND type IN %s', (username_owner, tuple(crops)))
        total = cursor.fetchone()
        return total['sum']

    def get_noncrop_total(self, username_owner):
        """
        Get the total amount of non-crops owned by the user
        :param username_owner: The username of the user
        :return: The total amount of non-crops owned by the user
        """
        cropsAndMoney = crops + ['Money']
        cursor = self.db_connection.get_cursor()
        cursor.execute('SELECT SUM(quantity) FROM resources WHERE owner = %s AND type NOT IN %s', (username_owner, tuple(cropsAndMoney)))
        total = cursor.fetchone()
        return total['sum']
