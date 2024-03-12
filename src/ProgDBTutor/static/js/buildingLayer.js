function getAssetDir(assetName) {
    return assetName.split('.')[0];
}


/** Tile coördinaten: (y,x)
    0 1 2 3 | x
    1
    2
    3
    —
    y
*/

export class BuildingMap {
    constructor(mapData, _tileSize, _ctx) {
        this.width = mapData.map_width;
        this.height = mapData.map_height;
        this.tiles = mapData.building_tiles;
        this.tileSize = _tileSize;
        this.ctx = _ctx;

        this.viewY = 0;
        this.viewX = 0;

        this.buildingAssetList = {}; // Bevat de json van alle asset file names die ingeladen moeten worden
        this.buildingAssets = {}; // Bevat {"pad_naar_asset": imageObject}
    }

    async initialize() {
        await this.fetchBuildingMapData();
        await this.fetchBuildingAssetList();
        await new Promise((resolve) => this.preloadBuildingAssets(resolve));
        // Safe to call stuff here
    }

    // Haalt de terrain_tiles uit de database en update deze klasse
    async fetchBuildingMapData() {
        try {
            const response = await fetch('/static/JorenStaticTestFiles/testBuildingMap.json');
            let mapData = await response.json();
            this.width = mapData.map_width;
            this.height = mapData.map_height;
            this.tiles = mapData.building_tiles;
            this.viewX = 0;
            this.viewY = 0;
        } catch(error) {
            console.error('fetchBuildingAssetList() failed:', error);
            throw error;
        }

        console.log("fetchBuildingMapData() succes");
    }


    async fetchBuildingAssetList() {
        try {
            const response = await fetch('/static/img/assets/assetList.json');
            const responseJson = await response.json();
            this.BuildingAssetList = responseJson.buildings;
        } catch (error) {
            console.error('fetchBuildingAssetList() failed:', error);
            throw error;
        }

        console.log("fetchBuildingAssetList() succes");
    }

    preloadBuildingAssets(callback) {
        let assetMap = {};
        let assetList = buildingAssetList; // todo als fetch werkt veranderen door 'this.terrainAssetList'
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