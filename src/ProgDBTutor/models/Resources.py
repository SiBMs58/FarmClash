class Resources:
    def __init__(self, money, potato, wheat, carrot):
        self.money = money
        self.potato = potato
        self.wheat = wheat
        self.carrot = carrot

    def add(self, resource):
        self.money += resource.money
        self.potato += resource.potato
        self.wheat += resource.wheat
        self.carrot += resource.carrot

    def remove(self, potato, wheat, carrot):
        pass
