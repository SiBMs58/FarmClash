class Crop:
    def __init__(self, crop_id, name, growth_time, sell_price):
        self.name = name
        self.growth_time = growth_time
        self.sell_price = sell_price  #price should depend on the market
class PlantedCrop:
    def __init__(self, planted_crop_id, crop_id, farm_id, harvest_time):
        self.planted_crop_id = planted_crop_id
        self.crop_id = crop_id
        self.farm_id = farm_id
        self.harvest_time = harvest_time
