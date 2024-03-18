import { BaseMap } from "./BaseMapKlasse.js";

const EMPTY_TILE = "None";

function getAssetDir(assetName) {
    return assetName.split('.')[0];
}

const defaultMapData = {
    map_width: 50,
    map_height: 50,
    building_tiles: [
        ["None","None      ","None","None      ","None","None","None","None      ","None","None      ","None      ","None      ","None      ","None"],
        ["None","Fences.4.1","None","None      ","None","None","None","None      ","None","Fences.4.1","None      ","None      ","None      ","None"],
        ["None","None      ","None","None      ","None","None","None","None      ","None","None      ","None      ","None      ","None      ","None"],
        ["None","None      ","None","None      ","None","None","None","None      ","None","None      ","None      ","None      ","None      ","None"],
        ["None","None      ","None",["Fences.4.1", "fence2"],"None","None","None","None      ","None","None      ","None      ","None      ","None      ","None"],
        ["None","None      ","None","None      ","None","None","None","None      ","None","None      ","Fences.1.2","Fences.4.3","Fences.1.4","None"],
        ["None","None      ","None","None      ","None","None","None","None      ","None","None      ","Fences.2.1","None      ","Fences.2.1","None"],
        ["None","None      ","None","None      ","None","None","None","Fences.4.1","None","None      ","Fences.3.2","Fences.4.3","Fences.3.4","None"],
        ["None","None      ","None","None      ","None","None","None","None      ","None","None      ","None      ","None      ","None      ","None"],
    ]
    /*
    building_locations: [
        ["None","None      ","None","None      ","None","None","None","None      ","None","None      ","None      ","None      ","None      ","None"],
        ["None","fence1    ","None","None      ","None","None","None","None      ","None","fence4    ","None      ","None      ","None      ","None"],
        ["None","None      ","None","None      ","None","None","None","None      ","None","None      ","None      ","None      ","None      ","None"],
        ["None","None      ","None","None      ","None","None","None","None      ","None","None      ","None      ","None      ","None      ","None"],
        ["None","None      ","None","fence2    ","None","None","None","None      ","None","None      ","None      ","None      ","None      ","None"],
        ["None","None      ","None","None      ","None","None","None","None      ","None","None      ","fence5    ","fence5    ","fence5    ","None"],
        ["None","None      ","None","None      ","None","None","None","None      ","None","None      ","fence5    ","None      ","fence5    ","None"],
        ["None","None      ","None","None      ","None","None","None","fence3    ","None","None      ","fence5    ","fence5    ","fence5    ","None"],
        ["None","None      ","None","None      ","None","None","None","None      ","None","None      ","None      ","None      ","None      ","None"],
    ],

     */
}

/**
 * Here's an example of what the buildMap json needs to look like.
 */
const defaultMapData2 = {
    map_width: 50,
    map_height: 50,

    building_information: {
        fence1: {
            display_name: "Fence", // Name displayed to the user
            level: 1, // Building level
            // ... More information to come
            building_location: [5, 4], // --> [y (height), x (width)], it's best practice to take the top-left corner of the building
            tile_rel_locations: [ // location relative to 'building_location'
                [[0, 0], "Fences.4.1"], // [ rel_location ([y, x]), "Tile asset"]
            ]

        },
        fence2: {
            display_name: "Fence",
            level: 1,
            building_location: [2, 2],
            tile_rel_locations: [
                [[0, 0], "Fences.4.1"],
            ]
        },
        fence3: {
            display_name: "Fence",
            level: 1,
            building_location: [8, 8],
            tile_rel_locations: [
                [[0, 0], "Fences.4.1"],
            ]

        },
        fence_square: {
            display_name: "Fence",
            level: 1,
            building_location: [6, 11],
            tile_rel_locations: [
                [[0, 0], "Fences.1.2"],
                [[0, 1], "Fences.4.3"],
                [[0, 2], "Fences.1.4"],
                [[1, 2], "Fences.2.1"],
                [[2, 2], "Fences.3.4"],
                [[2, 1], "Fences.4.3"],
                [[2, 0], "Fences.3.2"],
                [[1, 0], "Fences.2.1"],
            ]
        },
        chicken_house: {
            display_name: "Chicken House",
            level: 1,
            building_location: [12, 11],
            tile_rel_locations: [
                [[0, 0], "ChickenHouse.1.1"],
                [[0, 1], "ChickenHouse.1.2"],
                [[0, 2], "ChickenHouse.1.3"],
                [[1, 0], "ChickenHouse.2.1"],
                [[1, 1], "ChickenHouse.2.2"],
                [[1, 2], "ChickenHouse.2.3"],
                [[2, 0], "ChickenHouse.3.1"],
                [[2, 1], "ChickenHouse.3.2"],
                [[2, 2], "ChickenHouse.3.3"],
            ]
        },
        tree: {
            display_name: "Tree",
            level: 1,
            building_location: [12, 4],
            tile_rel_locations: [
                [[0, 0], "BiomeThings.1.2"],
                [[0, 1], "BiomeThings.1.3"],
                [[1, 0], "BiomeThings.2.2"],
                [[1, 1], "BiomeThings.2.3"],
            ]
        }
    },
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
    constructor(mapData = defaultMapData2, _tileSize, _ctx) {

        super(mapData, _tileSize);

        this.buildingInformation = mapData.building_information;
        this.tiles = this.generateBuildingTileMap();
        this.ctx = _ctx;

        this.buildingAssetList = {}; // Bevat de json van alle asset file names die ingeladen moeten worden
        this.buildingAssets = {}; // Bevat {"pad_naar_asset": imageObject}


        // Variables to remember the click state
        this.movingBuilding = false;
        this.buildingClickedName = "";

        // To remember building following mouse movement
        this.prevMouseMoveBuildingLoc = null; // [y, x]
    }

    generateBuildingTileMap() {
        const toReturn = [];
        for (let i = 0; i < this.map_height; i++) {
            toReturn[i] = [];
            for (let j = 0; j < this.map_width; j++) {
                toReturn[i][j] = EMPTY_TILE;
            }
        }

        for (const buildingKey in this.buildingInformation) {
            if (!Object.hasOwnProperty.call(this.buildingInformation, buildingKey)) {
                continue;
            }
            const buildingName = buildingKey;
            const locationY = this.buildingInformation[buildingKey].building_location[0];
            const locationX = this.buildingInformation[buildingKey].building_location[1];
            for (const currTile of this.buildingInformation[buildingKey].tile_rel_locations) {
                const newTileMapElement = [currTile[1], buildingName];
                const currMapLocationY = locationY + currTile[0][0];
                const currMapLocationX = locationX + currTile[0][1];
                toReturn[currMapLocationY][currMapLocationX] = newTileMapElement;
            }
        }

        return toReturn;
    }

    async initialize() {
        await this.fetchBuildingAssetList();
        //await this.fetchBuildingMapData();
        await new Promise((resolve) => this.preloadBuildingAssets(resolve));
        // Safe to call stuff here
        debugger;
        console.log("debug");
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
            this.map_width = mapData.map_width;
            this.map_height = mapData.map_height;
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
                if (this.tiles[i_map] && this.tiles[i_map][j_map]) { // todo beter maken
                    const currTile = this.tiles[i_map][j_map];
                    if (currTile === EMPTY_TILE) {
                        this.clearTile(x_screen * this.tileSize, y_screen * this.tileSize);
                        continue;
                    }
                    filePath = "/static/img/assets/buildings/" + getAssetDir(currTile[0]) + "/" + currTile[0] + ".png"; // currTile[0] want dit bestaat uit ["tileAsset", "buildingName"]
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

    /**
     * Moves a building relative to its original location.
     * @param rel_y
     * @param rel_x
     * @param buildingName the name of the building as mentioned in the input json.
     * @param shadowMove set this to true if
     */
    moveBuilding(rel_y, rel_x, buildingName, shadowMove = false) {
        const buildingToMove = this.buildingInformation[buildingName];
        buildingToMove.building_location[0] += rel_y;
        buildingToMove.building_location[1] += rel_x;
        /*
        buildingToMove.building_location[0] += rel_y - buildingToMove.building_location[0];
        buildingToMove.building_location[1] += rel_x - buildingToMove.building_location[1];
         */

        this.tiles = this.generateBuildingTileMap();
        this.drawTiles();
    }

    handleMouseMove(client_x, client_y) {
        if (!this.movingBuilding) {
            return;
        }

        //console.log("we zijn in de functie 2")

        let tileX = Math.floor(client_x/this.tileSize) + this.viewX;
        let tileY = Math.floor(client_y/this.tileSize) + this.viewY;

        if (this.prevMouseMoveBuildingLoc === null) {
            this.prevMouseMoveBuildingLoc = [tileY, tileX];
        }

        const relDistanceY = tileY - this.prevMouseMoveBuildingLoc[0];
        const relDistanceX = tileX - this.prevMouseMoveBuildingLoc[1];

        console.log(`relDistanceY ${relDistanceY}, relDistanceX ${relDistanceX}`);

        if (relDistanceX !== 0 || relDistanceY !== 0) {
            this.moveBuilding(relDistanceY, relDistanceX, this.buildingClickedName, true);
            this.prevMouseMoveBuildingLoc[0] = tileY;
            this.prevMouseMoveBuildingLoc[1] = tileX;
            //this.prevMouseMoveBuildingLoc = null;
        }

    }

    handleClick(client_x,client_y) {
        //debugger;
        let tileX = Math.floor(client_x/this.tileSize) + this.viewX;
        let tileY = Math.floor(client_y/this.tileSize) + this.viewY;

        // No click on building and not moving building
        if (this.tiles[tileY][tileX] === EMPTY_TILE && this.movingBuilding === false) {
            return false;
        }

        // Click on building and not yet moving
        if (this.movingBuilding === false) {
            this.movingBuilding = true;
            this.ownNextClick = true;
            this.buildingClickedName = this.tiles[tileY][tileX][1];
            return true;
        }

        // Click while moving building
        if (this.movingBuilding === true) {
            //const relDistanceY = tileY - this.prevClick[0];
            //const relDistanceX = tileX - this.prevClick[1];

            //this.moveBuilding(relDistanceY, relDistanceX, this.buildingClickedName);

            this.movingBuilding = false;
            this.ownNextClick = false;
            this.prevMouseMoveBuildingLoc = null;
        }


        console.log(`click op building layer, tile x: ${tileX}, y: ${tileY} --> ${this.tiles[tileY][tileX][1]}`);
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
            map_width: this.map_width,
            map_height: this.map_height,
            terrain_tiles: this.tiles
        };
    }
}