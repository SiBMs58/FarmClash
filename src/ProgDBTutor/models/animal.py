from datetime import datetime


class Animal(object):
    def __init__(self, owner, species, amount, last_updated=None):
        self.owner = owner
        self.species = species
        self.amount = amount
        self.last_updated = last_updated if last_updated is not None else datetime.now()

    def to_dict(self):
        return {
            'owner': self.owner,
            'species': self.species,
            'amount': self.amount,
            'last_updated': self.last_updated.isoformat()
        }
