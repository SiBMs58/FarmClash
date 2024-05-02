from datetime import datetime, timedelta


class Exploration:
    def __init__(self, owner, chickens, goats, pigs, cows, level, augment, duration=None, started_at=None):
        self.owner = owner
        self.chickens = chickens
        self.goats = goats
        self.pigs = pigs
        self.cows = cows
        self.level = level
        self.augment = augment
        if started_at is None:
            started_at = datetime.now()
        self.started_at = started_at
        if duration is None:
            duration = 1  # Default duration of 1 minute
        self.duration = duration

    def to_dict(self):
        return {
            "owner": self.owner,
            "chickens": self.chickens,
            "goats": self.goats,
            "pigs": self.pigs,
            "cows": self.cows,
            "exploration_level": self.level,
            "augment_level": self.augment,
            "started_at": self.started_at.isoformat(),
            "duration": str(self.duration)
        }

