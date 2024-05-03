from datetime import datetime, timedelta
import math
import random


class Exploration:
    def __init__(self, owner, chickens, goats, pigs, cows, level, augment, duration=None, started_at=None,
                 surviving_goats=None, rewards_goats=None, surviving_cows=None, rewards_cows=None, surviving_pigs=None,
                 surviving_chickens=None):
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
        self.surviving_goats = surviving_goats
        self.rewards_of_goats = rewards_goats
        self.surviving_pigs = surviving_pigs
        self.surviving_cows = surviving_cows
        self.rewards_of_cows = rewards_cows
        self.surviving_chickens = surviving_chickens

        if surviving_goats is None or rewards_goats is None or surviving_pigs is None or surviving_cows is None or surviving_chickens is None or rewards_cows is None:
            risk_chance = self.get_risk_chance()
            self.set_surviving_goats_and_rewards(risk_chance)
            self.set_surviving_cows_and_rewards(risk_chance)
            self.set_surviving_pigs(risk_chance)
            self.set_surviving_chickens(risk_chance)

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
            "duration": self.duration,
            "surviving_goats": self.surviving_goats,
            "rewards_of_goats": self.rewards_of_goats,
            "surviving_pigs": self.surviving_pigs,
            "surviving_cows": self.surviving_cows,
            "rewards_of_cows": self.rewards_of_cows,
            "surviving_chickens": self.surviving_chickens
        }

    def set_surviving_goats_and_rewards(self, risk_chance):
        self.surviving_goats = sum(1 for _ in range(self.goats) if random.uniform(0, 100) > risk_chance)
        print(self.surviving_goats)

        self.rewards_of_goats = 0
        for _ in range(self.surviving_goats):
            rand = random.uniform(0, 100)
            chance_of_2 = 10 + self.surviving_goats * 0.5
            chance_of_3 = 5 + self.surviving_goats * 0.5

            if rand <= chance_of_2:
                self.rewards_of_goats += 2
            elif rand <= chance_of_2 + chance_of_3:
                self.rewards_of_goats += 3
            else:
                self.rewards_of_goats += 1

        print("goat rewards: ", self.rewards_of_goats)

    def set_surviving_chickens(self, risk_chance):
        self.surviving_chickens = self.chickens
        for i in range(self.chickens):
            if random.uniform(0, 100) <= (risk_chance + 0.5 * i * 5):
                self.surviving_chickens -= 1
        print(self.surviving_chickens)

    def set_surviving_cows_and_rewards(self, risk_chance):
        self.surviving_cows = self.cows
        self.rewards_of_cows = 0
        for i in range(self.cows):
            if random.uniform(0, 100) <= risk_chance:
                self.surviving_cows -= 1
            elif random.uniform(0, 100) <= 10 * i:
                self.rewards_of_cows += 1

        print(self.surviving_cows)
        print("cow rewards: ", self.rewards_of_cows)

    def set_surviving_pigs(self, risk_chance):
        self.surviving_pigs = sum(1 for _ in range(self.pigs) if random.uniform(0, 100) > risk_chance)
        print(self.surviving_pigs)

    def get_risk_chance(self):
        risk_chances = {
            1: 0,
            20: 5,
            60: 10,
            180: 30,
            720: 50,
            1440: 70
        }
        if self.level == 0:
            return 100

        # Adjust risk chance based on building level and augments
        risk_chance = risk_chances.get(self.duration, 0) / self.level
        if self.augment == 0:
            risk_chance += 1
        risk_chance -= 1 - math.log(self.augment + 1, 6) * 3 / (2 * (self.augment + 1))

        return max(0, risk_chance)
