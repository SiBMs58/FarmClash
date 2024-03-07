from Resources import Resources

class User:
    def __init__(self, name, level, Map, resources):
        self.friends = []
        self.map = Map
        self.level = level
        self.name = name
        self.resources = resources

    def add_friend(self, friend):
        self.friends.append(friend)

    def attack(self, user):
        result = '' # do some attack stuff
        self.resources.add(Resources(0, 0, 0, 0))
        attack_time = ''


    def chat(self, receiver, message, time):
        pass

