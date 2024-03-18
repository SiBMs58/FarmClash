class Resource(object):
    def __init__(self, resource_type, amount):
        self.resource_type = resource_type
        self.amount = amount

    def to_dict(self):
        return {
            'resource_type': self.resource_type,
            'amount': self.amount
        }