function getAssetDir(assetName) {
  return assetName.split('.')[0];
}


export class gameTerrainMap {
  constructor(mapData) {
    this.width = mapData.map_width;
    this.height = mapData.map_height;
    this.tiles = mapData.terrain_tiles;
  }

/*
    Tile coördinaten: (y,x)
    0 1 2 3 | x
    1
    2
    3
    —
    y
*/
  getTile(y, x) {
    if (this.isValidPosition(y, x)) {
      return this.tiles[y][x];
    } else {
      console.error("gameTerrainMap : Invalid position: (y:", y, ", x:", x, ")");
      return null;
    }
  }

  drawTiles(ctx, tileSize) {
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        const currTile = this.tiles[i][j];
        const filePath = "/static/img/assets/tiles/" + getAssetDir(currTile) + "/" + currTile + ".png";
        const img = new Image();
        img.src = filePath;
        img.onload = (function(y, x) { // (i, j) capturen zodat deze niet veranderen tijdens uitvoering
                return function() {
                    ctx.drawImage(img, x * tileSize, y * tileSize, tileSize, tileSize);
                };
            })(i, j); // IIFE
      }
    }
  }

  isValidPosition(y, x) {
    return y >= 0 && y < this.height
        && x >= 0 && x < this.width;
  }

  // Haalt de terrain_tiles uit de database en update deze klasse
  fetchTiles() {
    fetch('/api/get-game-state')
    .then(response => response.json()) // Parse JSON response
    .then(data => {

      this.width = data.width;
      this.height = data.height;
      this.tiles = data.terrain_tiles;

    }).catch(error => console.error('gameTerrainMap.fetchTiles: ', error));
  }

  toJSON() {
    return {
      map_width: this.width,
      map_height: this.height,
      terrain_tiles: this.tiles
    };
  }
}