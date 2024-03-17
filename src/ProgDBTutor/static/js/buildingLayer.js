import { BaseMap } from "./BaseMapKlasse.js";

const EMPTY_TILE = "None";

function getAssetDir(assetName) {
    return assetName.split('.')[0];
}

const defaultMapData = {
    map_width: 50,
    map_height: 50,
    building_tiles: [
        ["None","None","None","None","None","None","None","None","None","None","None","None","None","None"],
        ["None","Fences.4.1","None","None","None","None","None","None","None","Fences.4.1","None","None","None","None"],
        ["None","None","None","None","None","None","None","None","None","None","None","None","None","None"],
        ["None","None","None","None","None","None","None","None","None","None","None","None","None","None"],
        ["None","None","None","Fences.4.1","None","None","None","None","None","None","None","None","None","None"],
        ["None","None","None","None","None","None","None","None","None","None","Fences.1.2","Fences.4.3","Fences.1.4","None"],
        ["None","None","None","None","None","None","None","None","None","None","Fences.2.1","None","Fences.2.1","None"],
        ["None","None","None","None","None","None","None","Fences.4.1","None","None","Fences.3.2","Fences.4.3","Fences.3.4","None"],
        ["None","None","None","None","None","None","None","None","None","None","None","None","None","None"],
    ]
}


/** Tile coördinaten: (y,x)
    0 1 2 3 | x
    1
    2
    3
    —
    y
*/

export class BuildingMap extends BaseMap {
    constructor(mapData = defaultMapData, _tileSize, _ctx) {

        super(mapData, _tileSize);

        this.tiles = mapData.building_tiles;
        this.ctx = _ctx;

        this.buildingAssetList = {}; // Bevat de json van alle asset file names die ingeladen moeten worden
        this.buildingAssets = {}; // Bevat {"pad_naar_asset": imageObject}
    }

    async initialize() {
        await this.fetchBuildingAssetList();
        //await this.fetchBuildingMapData();
        await new Promise((resolve) => this.preloadBuildingAssets(resolve));
        // Safe to call stuff here
    }

    async fetchBuildingAssetList() {
        try {
            const response = await fetch('/static/img/assets/assetList.json');
            const responseJson = await response.json();
            this.buildingAssetList = responseJson.buildings;
        } catch (error) {
            console.error('fetchBuildingAssetList() failed:', error);
            throw error;
        }

        console.log("fetchBuildingAssetList() success, buildingAssetList: ", this.buildingAssetList);
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

        console.log("fetchBuildingMapData() success");
    }




    preloadBuildingAssets(callback) {
        let assetMap = {};
        let assetList = this.buildingAssetList;
        let totalCount = 0;
        let loadedCount = 0;

        for (const buildingType in assetList) {
            totalCount += assetList[buildingType].length;
            assetList[buildingType].forEach(asset => {
                // noinspection DuplicatedCode
                const currPath = "/static/img/assets/buildings/" + buildingType + "/" + asset + ".png";
                const img = new Image();
                img.src = currPath;
                img.onload = () => {
                    assetMap[currPath] = img;
                    loadedCount++;
                    if (loadedCount === totalCount) {
                        this.buildingAssets = assetMap;
                        callback(); // Als alle images geladen zijn -> callback
                    }
                };
                img.onerror = () => {
                    console.error(`Failed to load image at path: ${currPath}`);
                    loadedCount++; // Increment the counter to ensure the callback is called even if some images fail to load.
                    if (loadedCount === totalCount) {
                        this.buildingAssets = assetMap;
                        callback(); // Still call the callback, but note that some images may not have loaded.
                    }
                };
            });
        }
    }

    clearTile(x_tile, y_tile) {
        this.ctx.clearRect(x_tile, y_tile, this.tileSize, this.tileSize);
    }


    drawTiles() {
        this.ctx.clearRect(0,0, window.innerWidth, window.innerHeight);

        const windowTileHeight = Math.ceil(window.innerHeight / this.tileSize);
        const windowTileWidth = Math.ceil(window.innerWidth / this.tileSize);

        for (let y_screen = 0, i_map = this.viewY; y_screen < windowTileHeight; y_screen++, i_map++) {
            for (let x_screen = 0, j_map = this.viewX; x_screen < windowTileWidth; x_screen++, j_map++) {
                let filePath;
                if (this.tiles[i_map] && this.tiles[i_map][j_map]) {
                    const currTile = this.tiles[i_map][j_map];
                    if (currTile === EMPTY_TILE) {
                        this.clearTile(x_screen * this.tileSize, y_screen * this.tileSize);
                        continue;
                    }
                    filePath = "/static/img/assets/buildings/" + getAssetDir(currTile) + "/" + currTile + ".png";
                } else { // Out-of bounds
                    continue;
                }
                const img = this.buildingAssets[filePath];
                if (img) {
                    this.ctx.drawImage(img, x_screen * this.tileSize, y_screen * this.tileSize, this.tileSize, this.tileSize);
                } else {
                    console.error("BuildingMap.drawTiles(): image does not exist")
                }
            }
        }
    }

    tick() {
        //console.log("building layer tick");
    }

    handleClick(x,y) {
        let tileX = Math.floor(x/this.tileSize) + this.viewX;
        let tileY = Math.floor(y/this.tileSize) + this.viewY;

        if (this.tiles[tileY][tileX] === EMPTY_TILE ) {
            return false;
        }

        console.log(`click op building layer, tile x: ${tileX}, y: ${tileY}`);
        return true;
    }


    getTile(y, x) {
        try {
            this.isValidTilePosition(y,x)
        } catch (error) {
            console.error(error.message)
        }

        return this.tiles[y][x];
    }

    toJSON() {
        return {
            map_width: this.width,
            map_height: this.height,
            terrain_tiles: this.tiles
        };
    }

}