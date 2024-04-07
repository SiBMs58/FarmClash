
class Crop:
    def __init__(self, name, growth_time=None, sell_price=None):
        self.name = name
        self.growth_time = growth_time if growth_time is not None else 2
        self.sell_price = sell_price if sell_price is not None else 20

    def to_dict(self):
        return {
            'name': self.name,
            'growth_time': self.growth_time,
            'sell_price': self.sell_price
        }