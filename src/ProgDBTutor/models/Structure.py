from enum import Enum

STRUCTURE_TYPES = ['HALL', 'FIELD', 'BARN', 'SILO']
MIN_TILE_SIZE = 1
MAX_TILE_SIZE = 5


class Structure:
    def __init__(self, width, height, stype, level=0, created_at=None):
        self.x = None
        self.y = None
        self.height = max(MIN_TILE_SIZE, min(height, MAX_TILE_SIZE))
        self.width = max(MIN_TILE_SIZE, min(width, MAX_TILE_SIZE))

        self.level = level
        self.created_at = created_at

        if stype in STRUCTURE_TYPES:
            self.type = stype
        else:
            self.type = None


if __name__ == "__main__":
    struct1 = Structure(0, 1, 'HALL')
    print(struct1.width, struct1.height)  # 1,1
    struct2 = Structure(1, 0, 'FIELD')
    print(struct2.width, struct2.height)  # 1,1
    struct3 = Structure(2, 2, 'BARN')
    print(struct3.width, struct3.height)  # 2,2
    struct4 = Structure(6, 3, 'SILO')
    print(struct4.width, struct4.height)  # 1,3

    wrongStruct = Structure(6, 3, 'TEST')
    print(wrongStruct)
