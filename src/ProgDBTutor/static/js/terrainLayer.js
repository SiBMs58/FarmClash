import { BaseMap } from "./baseMap.js";
import { utils } from "./utils.js";


export function getAssetDir(assetName) {
    return assetName.split('.')[0];
}

function startsWith(name, prefix) {
    return name.slice(0, prefix.length) === prefix;
}


function getNextAssetName(assetName) {
    return assetName.replace(/([12])$/, match => match === '1' ? '2' : '1');
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
     * @param username The username of the player, used to fetch the right map data.
     */
    constructor(mapData, _tileSize, _ctx, username) {

        super(mapData, _tileSize, username);

        this.tiles = mapData.terrain_tiles;
        this.ctx = _ctx;

        this.terrainAssetList = AssetList.terrain; // Bevat de json van alle asset file names die ingeladen moeten worden
        this.terrainAssets = {}; // Bevat {"pad_naar_asset": imageObject}

        this.time = 0; // amount of frames passed
        this.cycle = 2; // animation part

        this.buildingMapInstace = null;

    }

    /**
     * Initialises the terrain layer. Fetches everything that needs to be fetched from the server, and stores it.
     */
    async initialize() {
        await this.fetchTerrainAssetList();
        await this.fetchTerrainMapData();
        await new Promise((resolve) => this.preloadTerrainAssets(resolve));
        // Safe to call stuff here
    }

    addBuildingMapInstance(buildingMapInstance) {
        this.buildingMapInstace = buildingMapInstance;
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
        const BASE_URL = `${window.location.protocol}//${window.location.host}`;
        //debugger;
        try {
            // Basic test of de fetch is gelukt of niet
            let fetchLink = BASE_URL + "/api/terrain-map";
            if (this.username) {
                 fetchLink += `/${this.username}`;
            }
            console.log("fetchLink:", fetchLink);
            const response = await fetch(fetchLink);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            } else {
                console.log("Joepie terrain response is oké");
            }
            let terrainMapData = await response.json();
            if (terrainMapData.message) { // Moet niet per se
                console.log("Message from the server:", terrainMapData.message);
            }


            // Map proberen initialiseren:
            if (terrainMapData.map_width) {
                this.map_width = terrainMapData.map_width;
                console.log("map_width wordt ingeladen...");
            } else {
                console.log("map_width niet gevonden -> default wordt gebruikt"); // todo later engels maken
            }
            if (terrainMapData.map_height) {
                this.map_height = terrainMapData.map_height;
                console.log("map_height wordt ingeladen...");
            } else {
                console.log("map_height niet gevonden -> default wordt gebruikt");
            }
            if (terrainMapData.terrain_tiles) {
                this.tiles = terrainMapData.terrain_tiles;
                console.log("tiles worden ingeladen...");
            } else {
                console.log("terrain_tiles niet gevonden -> default wordt gebruikt");
            }

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

    getBuildingTileLocations(buildingInformation, buildingGeneralInformation) {
        let buildingTileLocations = [];
        for (let key in buildingInformation) {
             if (!Object.hasOwnProperty.call(buildingInformation, key)) {
                 continue;
             }
             const currBuilding = buildingInformation[key];
             const absoluteLocation = currBuilding.building_location
             const generalInfoKey = currBuilding.general_information;
             const tile_rel_locations = buildingGeneralInformation[generalInfoKey].tile_rel_locations;
             for (let index in tile_rel_locations) {
                 const tileRelLocation = tile_rel_locations[index][0];
                 const finalLocation = [tileRelLocation[0] + absoluteLocation[0], tileRelLocation[1] + absoluteLocation[1]]
                 buildingTileLocations.push(finalLocation);
             }
        }
        return buildingTileLocations;
    }

    isEdgeTile(tileName) {
        if (utils.getAssetDir(tileName) === "Grass") {
            let str = String(tileName);
            const targetLetters = ['N', 'O', 'W', 'Z'];
            return targetLetters.some(letter => str.includes(letter));
        }
        return false;
    }

    /**
     * Draws the tiles on screen using the 'this.tiles' map.
     */
    drawTiles() {
        // getAll building locations
        const buildingInformation = this.buildingMapInstace.buildingInformation;
        const buildingGeneralInformation = this.buildingMapInstace.buildingGeneralInformation;

        const buildingTileLocations = this.getBuildingTileLocations(buildingInformation, buildingGeneralInformation);

        const windowTileHeight = Math.ceil(window.innerHeight / this.tileSize);
        const windowTileWidth = Math.ceil(window.innerWidth / this.tileSize);

        for (let y_screen = 0, i_map = this.viewY; y_screen < windowTileHeight; y_screen++, i_map++) {
            for (let x_screen = 0, j_map = this.viewX; x_screen < windowTileWidth; x_screen++, j_map++) {
                const currentMapCoord = [i_map, j_map];
                const isBuildingLocation = buildingTileLocations.some(coord =>
                    coord[0] === currentMapCoord[0] && coord[1] === currentMapCoord[1]
                );

                let filePath;

                if (this.tiles[i_map] && this.tiles[i_map][j_map]) {
                    const currTile = this.tiles[i_map][j_map];
                    filePath = "/static/img/assets/terrain/" + utils.getAssetDir(currTile) + "/" + currTile + ".png";
                } else {
                    // Out-of bounds
                    filePath = "/static/img/assets/terrain/Water/Water.1.1.png";
                }

                if (isBuildingLocation) {
                    const currTile = this.tiles[i_map][j_map];
                    const assetDir = utils.getAssetDir(currTile)
                    if (assetDir !== "Water" && !this.isEdgeTile(currTile)) {
                        filePath = "/static/img/assets/terrain/Grass/Grass.0.png";
                    }
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

    /**
     * Animates water tiles by one frame
     */
    waterAnimation() {
        const animationSpeed = 36;
        if (this.time >= animationSpeed){
            this.time -= animationSpeed;

            for (let i = 0; i < this.map_height; i++) {
                for (let j = 0; j < this.map_width; j++) {
                    const currTileDir = utils.getAssetDir(this.tiles[i][j]);
                    if (currTileDir === "Water") {
                        this.tiles[i][j] = utils.getNextAssetName(this.tiles[i][j]);
                    }
                }
            }

            this.drawTiles();
        }
        else{
            this.time += 1;
        }
    }

    /*
    waterAnimation2() {
        if (this.time > 48){
            this.time -= 48;
            const windowTileHeight = Math.ceil(window.innerHeight / this.tileSize);
            const windowTileWidth = Math.ceil(window.innerWidth / this.tileSize);
            for (let y_screen = 0, i_map = this.viewY; y_screen < windowTileHeight; y_screen++, i_map++) {
                for (let x_screen = 0, j_map = this.viewX; x_screen < windowTileWidth; x_screen++, j_map++) {
                    const currTile = this.tiles[i_map][j_map];
                    if (getAssetDir(currTile) === "Water"){
                        let filePath = "/static/img/assets/terrain/Water/" + getNextAssetName(currTile, this.cycle);
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

            this.cycle = 3 - this.cycle;
        }
        else{
            this.time +=1;
        }
    }
     */

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

}