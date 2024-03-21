import { BaseMap } from "./BaseMapKlasse.js";

function getAssetDir(assetName) {
    return assetName.split('.')[0];
}

/**
 * This is the asset list that isn't fetched from the database and is used for debugging purposes.
 */
const AssetList =
    {
        terrain:
            {
                Grass: ["Grass.1.1","Grass.1.2","Grass.1.3","Grass.2.1","Grass.2.2","Grass.2.3","Grass.3.1","Grass.3.2","Grass.3.3","Grass.6.1","Grass.6.2","Grass.6.3","Grass.6.4","Grass.6.5","Grass.6.6","Grass.7.1","Grass.7.2","Grass.7.3","Grass.7.4","Grass.7.5","Grass.7.6"],
                Water: ["Water.1.1","Water.1.2","Water.1.3","Water.1.4"]
            },
        buildings:
            {
                Fences: ["Fences.1.1","Fences.1.2","Fences.1.3","Fences.1.4","Fences.2.1","Fences.2.2","Fences.2.3","Fences.2.4","Fences.3.1","Fences.3.2","Fences.3.3","Fences.3.4","Fences.4.1","Fences.4.2","Fences.4.3","Fences.4.4"]
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

export class TerrainMap extends BaseMap {
    /**
     * @param mapData This is set to a default version of the map, if database fetch succeeds this will be overridden.
     * @param _tileSize The tile size to be displayed on screen.
     * @param _ctx context needed for drawing on-screen.
     * @param time amount of frames passed
     * @param cycle animation part
     */
    constructor(mapData, _tileSize, _ctx) {

        super(mapData, _tileSize);

        this.tiles = mapData.terrain_tiles;
        this.ctx = _ctx;

        this.terrainAssetList = AssetList.terrain; // Bevat de json van alle asset file names die ingeladen moeten worden
        this.terrainAssets = {}; // Bevat {"pad_naar_asset": imageObject}
        this.time = 0;
        this.cycle = 1;

    }

    /**
     * Initialises the terrain layer. Fetches everything that needs to be fetched from the server, and stores it.
     */
    async initialize() {
        await this.fetchTerrainAssetList();
        //await this.fetchTerrainMapData();
        await new Promise((resolve) => this.preloadTerrainAssets(resolve));
        // Safe to call stuff here
    }

    /**
     * Fetches the 'assetList.json' which is used to later fetch the right assets.
     */
    async fetchTerrainAssetList() {
        try {
            const response = await fetch('/static/img/assets/assetList.json');
            const responseJson = await response.json();
            this.terrainAssetList = responseJson.terrain;
        } catch (error) {
            console.error('fetchTerrainAssetList() failed:', error);
            throw error;
        }

        console.log("fetchTerrainAssetList() success, terrainAssetList: ", this.terrainAssetList);
        //console.log(this.terrainAssetList);
    }

    /**
     * Fetches the terrainMapData json which stores the layout and other information needed.
     */
    async fetchTerrainMapData() {
        try {
            const response = await fetch('/static/map.json');
            let mapData = await response.json();
            this.map_width = mapData.map_width;
            this.map_height = mapData.map_height;
            this.tiles = mapData.terrain_tiles;
            this.viewX = 0;
            this.viewY = 0;
        } catch(error) {
            console.error('fetchTerrainAssetList() failed:', error);
            throw error;
        }

        console.log("fetchTerrainMapData() success");
    }

    /**
     * Preloads the assets from the server and stores it in 'this.terrainAssets'.
     * 'callback' function is called when the function is done fetching.
     */
    preloadTerrainAssets(callback) {
        let assetMap = {};
        let assetList = this.terrainAssetList;
        let totalCount = 0;
        let loadedCount = 0;

        for (const terrainType in assetList) {
            totalCount += assetList[terrainType].length;
            assetList[terrainType].forEach(asset => {
                // noinspection DuplicatedCode
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
                img.onerror = () => {
                    console.error(`Failed to load image at path: ${currPath}`);
                    loadedCount++; // Increment the counter to ensure the callback is called even if some images fail to load.
                    if (loadedCount === totalCount) {
                        this.terrainAssets = assetMap;
                        callback(); // Still call the callback, but note that some images may not have loaded.
                    }
                };
            });
        }
    }

    /**
     * Draws the tiles on screen using the 'this.tiles' map.
     */
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
                    console.error("TerrainMap.drawTiles(): image does not exist")
                }
            }
        }
    }

    waterAnimation() {
        if (this.time > 24){
            this.time -= 24;
            const windowTileHeight = Math.ceil(window.innerHeight / this.tileSize);
            const windowTileWidth = Math.ceil(window.innerWidth / this.tileSize);
            for (let y_screen = 0, i_map = this.viewY; y_screen < windowTileHeight; y_screen++, i_map++) {
                for (let x_screen = 0, j_map = this.viewX; x_screen < windowTileWidth; x_screen++, j_map++) {
                    const currTile = this.tiles[i_map][j_map];
                    if (getAssetDir(currTile) == "Water"){
                        let filePath = "/static/img/assets/terrain/" + getAssetDir(currTile) + "/" + "Water.1."+ this.cycle.toString() + ".png";
                        const img = this.terrainAssets[filePath];
                        if (img) {
                            this.ctx.drawImage(img, x_screen * this.tileSize, y_screen * this.tileSize, this.tileSize, this.tileSize);
                        } else {
                            console.error("waterAnimation : TerrainMap.drawTiles(): image does not exist")
                            console.error(filePath)
                        }
                    }
                }
            }
            this.cycle +=1;
            if (this.cycle == 5){
                this.cycle = 1;
            }
        }
        else{
            this.time +=1;
        }
    }

    /**
     * Gets called by the Tick class with regular time intervals.
     */
    tick() {
        //console.log("Terrain layer tick");
        this.waterAnimation();

    }

    /**
     * Handles click from user.
     * @param x
     * @param y
     * @returns {boolean} returns true if the click is used by this class.
     */
    handleClick(x,y) {
        let tileX = Math.floor(x/this.tileSize) + this.viewX;
        let tileY = Math.floor(y/this.tileSize) + this.viewY;

        console.log(`click op terrain layer, tile x: ${tileX}, y: ${tileY}`);
        return true;
    }

    /*
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
            map_width: this.map_width,
            map_height: this.map_height,
            terrain_tiles: this.tiles
        };
    }

    */
}