import random

border = 4
height = 35
width = 50

number_of_lakes = 10
min_lake_size = 5
max_lake_size = 15


def generate_map():
    water_positions = generate_water_positions(width - 1, height - 1, number_of_lakes, min_lake_size, max_lake_size)

    game_map = [['Grass' for _ in range(width + 2 * border)] for _ in range(height + 2 * border)]

    for y in range(len(game_map)):
        for x in range(len(game_map[0])):
            if y < border - 1 or x < border - 1 or y > height + border or x > width + border:
                game_map[y][x] = "Water." + random_water(True) + ".1"

            elif y == border - 1 and x == border - 1:
                game_map[y][x] = "Grass.NW." + random_grass_border(True)

            elif y == border - 1 and x == width + border:
                game_map[y][x] = "Grass.NO." + random_grass_border(True)

            elif y == height + border and x == width + border:
                game_map[y][x] = "Grass.ZO." + random_grass_border(True)

            elif y == height + border and x == border - 1:
                game_map[y][x] = "Grass.ZW." + random_grass_border(True)

            elif y == border - 1:
                game_map[y][x] = "Grass.N." + random_grass_border()

            elif y == height + border:
                game_map[y][x] = "Grass.Z." + random_grass_border()

            elif x == border - 1:
                game_map[y][x] = "Grass.W." + random_grass_border()

            elif x == width + border:
                game_map[y][x] = "Grass.O." + random_grass_border()

            elif x == border or x == width + border - 1 or y == border or y == height + border - 1:
                game_map[y][x] = "Grass." + random_grass(True)

            else:
                if (x - border, y - border) in water_positions:
                    game_map[y][x] = "Water"

                if game_map[y][x] == "Water":
                    game_map[y][x] += "." + random_water(False) + ".1"
                else:
                    game_map[y][x] += "." + random_grass(True)
    return game_map


def generate_water_positions(width, height, num_lakes=8, min_lake_size=3, max_lake_size=10):
    water_positions = set()

    # Define the middle region to exclude
    exclude_start_x = 0
    exclude_end_x = 10
    exclude_start_y = 10
    exclude_end_y = 24

    # Track the number of water tiles generated
    water_tiles_generated = 0

    for _ in range(num_lakes):
        lake_size = random.randint(min_lake_size, max_lake_size)
        start_x = random.randint(0, width - 1)
        start_y = random.randint(0, height - 1)

        for _ in range(lake_size):

            # Check if the position falls within the excluded region
            if exclude_start_x <= start_x <= exclude_end_x and exclude_start_y <= start_y <= exclude_end_y:
                continue

            # Add the position to water_positions
            water_positions.add((start_x, start_y))
            water_tiles_generated += 1

            # Move to the next position
            direction = random.choice([(0, 1), (1, 0), (0, -1), (-1, 0)])
            start_x += direction[0]
            start_y += direction[1]
            start_x = max(0, min(start_x, width - 1))
            start_y = max(0, min(start_y, height - 1))

    return water_positions


def random_grass(specials=False):
    grass_tiles = [str(i) for i in range(1, 21)]
    probabilities = [0.5] * 20

    if specials:
        extra_grass_tiles = ["S" + str(i) for i in range(1, 41)]
        grass_tiles.extend(extra_grass_tiles)
        probabilities.extend([0.045] * 40)

    return random.choices(grass_tiles, weights=probabilities)[0]


def random_water(specials=False):
    water_tiles = ['1', '2', '3', '4']
    probabilities = [0.5] * 4

    if specials:
        water_tiles.extend(["S" + str(i) for i in range(1, 20)])
        probabilities.extend([0.04] * 7 + [0.005] + [0.04] * 11)

    return random.choices(water_tiles, weights=probabilities)[0]


def random_grass_border(corner=False):
    grass_borders_tiles = ['1', '2', '3', '4', '5', 'S1', 'S2', 'S3', 'S4', 'S5']
    probabilities = [0.5] * 5 + 5 * [0.3]

    if corner:
        grass_borders_tiles = ['1', '2', 'S1', 'S2']
        probabilities = [0.5] * 2 + 2 * [0.4]

    return random.choices(grass_borders_tiles, weights=probabilities)[0]
