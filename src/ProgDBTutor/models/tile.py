class Tile:
    def __init__(self, x, y, terrain_type):
        self.x = x
        self.y = y
        self.terrain_type = terrain_type

    def get_terrain(self):
        return self.terrain_type