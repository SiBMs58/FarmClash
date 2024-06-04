from datetime import datetime


class Resource(object):
    def __init__(self, username_owner, resource_type, amount, last_updated=None):
        self.username_owner = username_owner
        self.resource_type = resource_type
        self.amount = amount
        self.last_updated = last_updated if last_updated is not None else datetime.now()

    def to_dict(self):
        return {
            'owner': self.username_owner,
            'resource_type': self.resource_type,
            'amount': self.amount,
            'last_updated': self.last_updated.isoformat()
        }