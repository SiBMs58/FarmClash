from Structure import Structure


class Map:
    def __init__(self):
        self.width = 50
        self.height = 50
        self.map = [[None for x in range(self.width)] for y in range(self.height)]
        self.created_at = 0

    def _can_place(self, x, y, width, height):
        if x < 0 or y < 0 or self.width < x + width or self.height < y + height:
            return False

        for i in range(height):
            for j in range(width):
                if self.map[y + i][x + j] is not None:
                    return False
        return True

    def _replace(self, x, y, width, height, tile):
        for i in range(height):
            for j in range(width):
                self.map[y + i][x + j] = tile

    def place_struct(self, x, y, struct):
        if not self._can_place(x, y, struct.width, struct.height):
            print("Cannot place structure at (" + str(x) + "," + str(y) + ") with size",
                  str(struct.width) + "x" + str(struct.height))
            return False

        struct.x = x
        struct.y = y

        self._replace(x, y, struct.width, struct.height, struct)
        return True

    def take_struct(self, x, y):
        struct = self.select_struct(x,y)
        if struct is not None:
            self._replace(struct.x, struct.y, struct.width, struct.height, None)
        return struct

    def select_struct(self, x, y):
        return self.map[y][x]


if __name__ == "__main__":
    # become struct1(1,1), struct2(1,1), struct3(2,2), struct4(1,3)
    struct1 = Structure(0, 1, 'HALL')
    struct2 = Structure(1, 0, 'FIELD')
    struct3 = Structure(2, 2, 'BARN')
    struct4 = Structure(6, 3, 'SILO')

    # Cannot place structure at (2,2) with size 2x2
    gmap = Map()
    gmap.place_struct(0, 0, struct1)
    gmap.place_struct(3, 3, struct2)
    gmap.place_struct(2, 2, struct3)
    gmap.place_struct(5, 5, struct4)

    struct5 = gmap.select_struct(3, 3)
    print(struct5.type, struct2.type)  # FIELD FIELD

    struct6 = gmap.select_struct(6, 6)
    print(struct6.type, struct4.type, struct1.type)  # SILO SILO HALL

    struct7 = gmap.take_struct(3, 3)
    print(struct7.type)  # FIELD

    struct8 = gmap.take_struct(3, 3)
    print(struct8)  # NONE
