function getRandomElement(list) {
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex];
}

const defaultTileSet =
    ["Grass.6.1","Grass.6.2","Grass.6.3","Grass.6.4","Grass.6.5","Grass.6.6",
     "Grass.7.1","Grass.7.2","Grass.7.3","Grass.7.4","Grass.7.5","Grass.7.6",
     "Water.1.1","Water.1.2","Water.1.3","Water.1.4"]

export function generateRandomTerrainMap(width, height, possibleTiles = defaultTileSet) {
    const mapData = {map_width: width, map_height: height};
    mapData.terrain_tiles = Array(height).fill().map(() =>
        Array(width).fill().map(() => getRandomElement(possibleTiles))
    );
    return mapData;
}