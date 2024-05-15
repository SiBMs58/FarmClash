from datetime import datetime


class Animal(object):
    def __init__(self, species, owner, amount, last_updated=None):
        self.species = species
        self.owner = owner
        self.amount = amount
        self.last_updated = last_updated if last_updated is not None else datetime.now()

    def to_dict(self):
        return {
            'species': self.species,
            'owner': self.owner,
            'amount': self.amount,
            'last_updated': self.last_updated.isoformat()
        }
