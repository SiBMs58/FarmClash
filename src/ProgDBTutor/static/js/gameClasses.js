function getAssetDir(assetName) {
    return assetName.split('.')[0];
}

// Debug
const terrainAssetList =
    { terrain:
        {
            Grass: ["Grass.1.1","Grass.1.2","Grass.1.3","Grass.2.1","Grass.2.2","Grass.2.3","Grass.3.1","Grass.3.2","Grass.3.3","Grass.6.1","Grass.6.2","Grass.6.3","Grass.6.4","Grass.6.5","Grass.6.6","Grass.7.1","Grass.7.2","Grass.7.3","Grass.7.4","Grass.7.5","Grass.7.6"],
            Water: ["Water.1.1","Water.1.2","Water.1.3","Water.1.4"]
        }
    }


/** Tile coördinaten: (y,x)
    0 1 2 3 | x
    1
    2
    3
    —
    y
*/

export class gameTerrainMap {
    constructor(mapData, _tileSize, _ctx) {
        this.width = mapData.map_width;
        this.height = mapData.map_height;
        this.tiles = mapData.terrain_tiles;
        this.tileSize = _tileSize;
        this.ctx = _ctx;

        this.viewY = 0;
        this.viewX = 0;

        this.terrainAssetList = {}; // Bevat de json van alle asset file names die ingeladen moeten worden
        this.terrainAssets = {}; // Bevat {"pad_naar_asset": imageObject}

    }

    async initialize() {
        //this.fetchTerrainMapData();
        //await this.fetchTerrainAssetList();
        await new Promise((resolve) => this.preloadTerrainAssets(resolve));
        // Safe to call stuff here
    }

    fetchTerrainAssetList() {
        return fetch('/api/get-asset-list')
            .then(response => response.json())
            .then(data => {
                console.log(data); // DEBUG
                this.terrainAssetList =  data.terrain;
            })
            .catch(error => {
                console.error('Error:', error);
                throw error;
            });
    }

    preloadTerrainAssets(callback) {
        let assetMap = {};
        let assetList = terrainAssetList; // todo als fetch werkt veranderen door 'this.terrainAssetList'
        let totalCount = 0;
        let loadedCount = 0;

        // Is een beetje ingewikkeld doordat image loading asynchronous is
        for (const terrainType in assetList.terrain) {
            totalCount += assetList.terrain[terrainType].length;
            assetList.terrain[terrainType].forEach(asset => {
                const currPath = "/static/img/assets/terrain/" + terrainType + "/" + asset + ".png";
                const img = new Image();
                img.src = currPath;
                img.onload = () => {
                    assetMap[currPath] = img;
                    loadedCount++;
                    if (loadedCount === totalCount) {
                        this.terrainAssets = assetMap;
                        callback(); // Als alle images geladen zijn -> callback
                    }
                };
            });
        }
    }

    // Haalt de terrain_tiles uit de database en update deze klasse
    fetchTerrainMapData() {
        console.log("fetchTiles wordt opgeroepen...")
        fetch('/api/get-game-terrain-map')
            .then(response => response.json()) // Parse JSON response
            .then(data => {

                this.width = data.width;
                this.height = data.height;
                this.tiles = data.terrain_tiles;

            }).catch(error => console.error('gameTerrainMap.fetchTiles: ', error));
        this.viewX = 0;
        this.viewY = 0;
        this.drawTiles();
    }


    drawTiles() {
        const windowTileHeight = Math.ceil(window.innerHeight / this.tileSize);
        const windowTileWidth = Math.ceil(window.innerWidth / this.tileSize);

        for (let y_screen = 0, i_map = this.viewY; y_screen < windowTileHeight; y_screen++, i_map++) {
            for (let x_screen = 0, j_map = this.viewX; x_screen < windowTileWidth; x_screen++, j_map++) {
                let filePath;
                if (this.tiles[i_map] && this.tiles[i_map][j_map]) {
                    const currTile = this.tiles[i_map][j_map];
                    filePath = "/static/img/assets/terrain/" + getAssetDir(currTile) + "/" + currTile + ".png";
                } else {
                    // Out-of bounds
                    filePath = "/static/img/assets/terrain/Water/Water.1.1.png";
                }
                const img = this.terrainAssets[filePath];
                if (img) {
                    this.ctx.drawImage(img, x_screen * this.tileSize, y_screen * this.tileSize, this.tileSize, this.tileSize);
                } else {
                    console.error("drawTiles(): image does not exist")
                }
            }
        }
    }


    isValidPosition(y, x) {
        return y >= 0 && y < this.height
            && x >= 0 && x < this.width;
    }

    getTile(y, x) {
        if (this.isValidPosition(y, x)) {
            return this.tiles[y][x];
        } else {
            console.error("gameTerrainMap : Invalid position: (y:", y, ", x:", x, ")");
            return null;
        }
    }

    toJSON() {
        return {
            map_width: this.width,
            map_height: this.height,
            terrain_tiles: this.tiles
        };
    }


    // --------------
    // MOVE FUNCTIONS

    scrollLeft() {
        if (this.viewX > 0) {
            this.viewX -= 1;
            this.drawTiles()
            console.log(`pijltje naar links is ingedrukt viewY: ${this.viewX}`);
        } else {
            console.log("kan niet verder, je zit aan de rand");
        }

    }

    scrollUp() {
        if (this.viewY > 0) {
            this.viewY -= 1;
            this.drawTiles()
            console.log(`pijltje naar boven is ingedrukt viewY: ${this.viewY}`);
        } else {
            console.log("kan niet verder, je zit aan de rand");
        }
    }

    scrollRight() {
        if (this.viewX < this.width - Math.ceil(window.innerWidth/this.tileSize)) {
            this.viewX += 1;
            this.drawTiles()
            console.log(`pijltje naar rechts is ingedrukt viewY: ${this.viewX}`);
        } else {
            console.log(`kan niet verder, je zit aan de rand: viewX ${this.viewX}`);
        }

    }

    scrollDown() {
        if (this.viewY < this.height - Math.ceil(window.innerHeight/this.tileSize)) {
            this.viewY += 1;
            this.drawTiles()
            console.log(`pijltje naar beneden is ingedrukt viewY: ${this.viewY}`);
        } else {
            console.log(`kan niet verder, je zit aan de rand: viewY ${this.viewY}`);
        }

    }

}