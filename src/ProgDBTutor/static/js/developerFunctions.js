/**
 * Returns a random element from a list of any kind of elements
 * @param list can be a list of any type of elements
 * @returns {*} A random element of the given list
 */
export function getRandomElement(list) {
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex];
}

const defaultTileSet =
    ["Grass.6.1","Grass.6.2","Grass.6.3","Grass.6.4","Grass.6.5","Grass.6.6",
     "Grass.7.1","Grass.7.2","Grass.7.3","Grass.7.4","Grass.7.5","Grass.7.6",
     "Water.1.1","Water.1.2","Water.1.3","Water.1.4"]

/**
 * Is used to easily create a terrain map with a randomness aspect
 * @param width the map width
 * @param height the map height
 * @param possibleTiles a list of possible tiles the random generator can choose between
 * @returns {{map_height, map_width}} The map data
 */
export function generateRandomTerrainMap(width, height, possibleTiles = defaultTileSet) {
    const mapData = {map_width: width, map_height: height};
    mapData.terrain_tiles = Array(height).fill().map(() =>
        Array(width).fill().map(() => getRandomElement(possibleTiles))
    );
    return mapData;
}