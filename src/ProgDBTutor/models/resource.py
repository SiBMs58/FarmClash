class Resource(object):
    def __init__(self, resource_id, username_owner, resource_type, amount):
        self.resource_id = resource_id
        self.username_owner = username_owner
        self.resource_type = resource_type
        self.amount = amount

    def to_dict(self):
        return {
            'resource_id': self.resource_id,
            'owner': self.username_owner,
            'resource_type': self.resource_type,
            'amount': self.amount
        }