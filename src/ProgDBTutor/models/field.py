from datetime import datetime

class Field:
    def __init__(self, building_name, username_owner, phase, crop=None, asset_phase=None, time_planted=None):
        self.building_name = building_name
        self.username_owner = username_owner
        self.phase = phase
        self.crop = crop
        self.asset_phase = asset_phase
        self.time_planted = time_planted

    def to_dict(self):
        return {
            'building_name': self.building_name,
            'username_owner': self.username_owner,
            'crop': self.crop,
            'phase': self.phase,
            'asset_phase': self.asset_phase,
            'time_planted': self.time_planted
        }
