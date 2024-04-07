from datetime import datetime

class Market:
    def __init__(self, crop_id, current_price, current_quantity_crop, prev_quantity_crop, last_update=None):
        self.crop_id = crop_id
        self.current_price = current_price
        self.current_quantity_crop = current_quantity_crop
        self.prev_quantity_crop = prev_quantity_crop
        if last_update is None:
            last_update = datetime.now()
        self.last_update = last_update

    def to_dict(self):
        return {
            'crop_id': self.crop_id,
            'current_price': self.current_price,
            'current_quantity_crop': self.current_quantity_crop,
            'prev_quantity_crop': self.prev_quantity_crop,
            'last_update': self.last_update
        }

