import { BaseMap } from "./BaseMapKlasse.js";

/**
 * Sets the string value of
 */
const EMPTY_TILE = "None";

function getAssetDir(assetName) {
    return assetName.split('.')[0];
}

/**
 * Example of the generated grid will look like:
 * This will be used to check for overlap and possibly by other classes to check the building layout.
 */
const defaultMapData = {
    map_width: 50,
    map_height: 50,
    building_tiles: [
        ["None","None","None","None","None","None","None","None","None","None","None","None","None","None"],
        ["None",["Fences.4.1", "fences1"],"None","None","None","None","None","None","None",["Fences.4.1", "fence4"],"None","None","None","None"],
        ["None","None","None","None","None","None","None","None",["Fences.4.1", "fence3"],"None","None","None","None","None"],
        ["None","None","None","None","None","None","None","None","None","None","None","None","None","None"],
        ["None","None","None",["Fences.4.1", "fence2"],"None","None","None","None","None","None","None","None","None","None"],
        ["None","None","None","None","None","None","None","None","None","None",["Fences.1.2", "fence5"],["Fences.4.3", "fence5"],["Fences.1.4", "fence5"],"None"],
        ["None","None","None","None","None","None","None","None","None","None",["Fences.2.1", "fence5"],"None",["Fences.2.1", "fence5"],"None"],
        ["None","None","None","None","None","None","None","None","None","None",["Fences.3.2", "fence5"],["Fences.4.3", "fence5"],["Fences.3.4", "fence5"],"None"],
        ["None","None","None","None","None","None","None","None","None","None","None","None","None","None"],
    ]
}

/**
 * Here's an example of what the buildMap json needs to look like.
 */
const defaultMapData2 = {
    map_width: 58,
    map_height: 43,

    building_information: {
        fence1: {
            self_key: "fence1", // Must be the exact key of this sub-object
            display_name: "Fence", // Name displayed to the user
            level: 1, // Building level
            // ... More information to come
            building_location: [5, 4], // --> [y (height), x (width)], it's best practice to take the top-left corner of the building
            tile_rel_locations: [ // location relative to 'building_location'
                [[0, 0], "Fence.L4"], // [ rel_location ([y, x]), "Tile asset"]
            ]

        },
        fence2: {
            self_key: "fence2",
            display_name: "Fence",
            level: 1,
            building_location: [5, 7],
            tile_rel_locations: [
                [[0, 0], "Fence.L5"],
            ]
        },
        fence3: {
            self_key: "fence3",
            display_name: "Fence",
            level: 1,
            building_location: [8, 8],
            tile_rel_locations: [
                [[0, 0], "Fence.L3"],
            ]

        },
        fences_lv1: {
            self_key: "fences_lv1",
            display_name: "Fence",
            level: 1,
            building_location: [6, 11],
            tile_rel_locations: [
                [[0, 0], "Fence.L1.OZ"],
                [[0, 1], "Fence.L1.OW"],
                [[0, 2], "Fence.L1.ZW"],
                [[1, 2], "Fence.L1.NZ"],
                [[2, 2], "Fence.L1.NW"],
                [[2, 1], "Fence.L1.OW"],
                [[2, 0], "Fence.L1.NO"],
                [[1, 0], "Fence.L1.NZ"],
            ]
        },
        fences_lv9: {
            self_key: "fences_lv9",
            display_name: "Fence",
            level: 9,
            building_location: [6, 15],
            tile_rel_locations: [
                [[0, 0], "Fence.L9.OZ"],
                [[0, 1], "Fence.L9.OW"],
                [[0, 2], "Fence.L9.ZW"],
                [[1, 2], "Fence.L9.NZ"],
                [[2, 2], "Fence.L9.NW"],
                [[2, 1], "Fence.L9.OW"],
                [[2, 0], "Fence.L9.NO"],
                [[1, 0], "Fence.L9.NZ"],
            ]
        },
        fences_lv10: {
            self_key: "fences_lv10",
            display_name: "Fence",
            level: 10,
            building_location: [6, 19],
            tile_rel_locations: [
                [[0, 0], "Fence.L10.OZ"],
                [[0, 1], "Fence.L10.OW"],
                [[0, 2], "Fence.L10.ZW"],
                [[1, 2], "Fence.L10.NZ"],
                [[2, 2], "Fence.L10.NW"],
                [[2, 1], "Fence.L10.OW"],
                [[2, 0], "Fence.L10.NO"],
                [[1, 0], "Fence.L10.NZ"],
            ]
        },
        chicken_coop: {
            self_key: "chicken_coop",
            display_name: "Chicken Coop",
            level: 5,
            building_location: [12, 11],
            tile_rel_locations: [
                [[0, 0], "Chickencoop.L1.1.1"],
                [[0, 1], "Chickencoop.L1.1.2"],
                [[1, 0], "Chickencoop.L1.2.1"],
                [[1, 1], "Chickencoop.L1.2.2"],
                [[2, 0], "Chickencoop.L1.3.1"],
                [[2, 1], "Chickencoop.L1.3.2"],
            ]
        },
        Coin_well: {
            self_key: "Coin_well",
            display_name: "Coin well",
            level: 1,
            building_location: [12, 4],
            tile_rel_locations: [
                [[0, 0], "Coinwell.0%.1.1"],
                [[0, 1], "Coinwell.0%.1.2"],
                [[1, 0], "Coinwell.0%.2.1"],
                [[1, 1], "Coinwell.0%.2.2"],
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
    /**
     * @param mapData This is set to a default version of the map, if database fetch succeeds this will be overridden.
     * @param _tileSize The tile size to be displayed on screen.
     * @param _ctx context needed for drawing on-screen.
     * @param terrainMapInstance This is an instance that is needed for certain checks (for example to make sure a building isn't being placed on water)
     */
    constructor(mapData = defaultMapData2, _tileSize, _ctx, terrainMapInstance) {

        super(mapData, _tileSize);

        this.buildingInformation = mapData.building_information;
        this.tiles = this.generateBuildingTileMap();
        this.ctx = _ctx;

        this.buildingAssetList = {}; // Bevat de json van alle asset file names die ingeladen moeten worden
        this.buildingAssets = {}; // Bevat {"pad_naar_asset": imageObject}

        this.terrainMapInstance = terrainMapInstance;


        // Variables to remember the click state
        this.movingBuilding = false;
        this.buildingClickedName = "";

        // To remember building following mouse movement
        this.prevMouseMoveBuildingLoc = null; // [y, x]
    }

    /**
     * Looks like:
     * [["None"  ,     "None"         ,["Fence.1.1", fence5], "None"],
     * ["None"  ,["Fence.1.2", fence6],       "None"        , "None],
     * ... ]
     *
     *  --> ["tileAsset", "buildingName"] or "None"
     *
     */
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
            const currBuilding = this.buildingInformation[buildingKey];
            const locationY = currBuilding.building_location[0];
            const locationX = currBuilding.building_location[1];
            for (const currTile of currBuilding.tile_rel_locations) {
                const newTileMapElement = [currTile[1], buildingKey];
                const currMapLocationY = locationY + currTile[0][0];
                const currMapLocationX = locationX + currTile[0][1];
                toReturn[currMapLocationY][currMapLocationX] = newTileMapElement;
            }
        }

        return toReturn;
    }

    /**
     * Initialises the building layer. Fetches everything that needs to be fetched from the server, and stores it.
     */
    async initialize() {
        await this.fetchBuildingAssetList();
        //await this.fetchBuildingMapData();
        await new Promise((resolve) => this.preloadBuildingAssets(resolve));
        // Safe to call stuff here
        //debugger;
        console.log("debug");
    }

    /**
     * Fetches the 'assetList.json' which is used to later fetch the right assets.
     */
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

    /**
     * Fetches the buildingMapData json which stores the layout and other information needed.
     */
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

    /**
     * Preloads the assets from the server and stores it in 'this.buildingAssets'.
     * 'callback' function is called when the function is done fetching.
     */
    preloadBuildingAssets(callback) {
        let assetMap = {};
        let assetList = this.buildingAssetList;
        let totalCount = 0;
        let loadedCount = 0;

        for (const buildingType in assetList) {
            totalCount += assetList[buildingType].length;
            assetList[buildingType].forEach(asset => {
                const currPath = "/static/img/assets/buildings/" + buildingType + "/" + asset + ".png";
                const img = new Image();
                img.src = currPath;
                img.onload = () => {
                    assetMap[currPath] = img;
                    loadedCount++;
                    if (loadedCount === totalCount) {
                        this.buildingAssets = assetMap;
                        callback(); // If all images are loaded -> callback
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


    /**
     * Clears a specific tile relative to the screen (not the buildingMap)
     * @param x_tile_screen
     * @param y_tile_screen
     */
    clearTile(x_tile_screen, y_tile_screen) {
        this.ctx.clearRect(x_tile_screen, y_tile_screen, this.tileSize, this.tileSize);
    }

    /**
     * Old draw function. Draws using the generated 'this.tiles'.
     */
    /*
    drawTiles2() {
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
     */

    /**
     * Draws a building.
     * @param building a building object of 'this.buildingInformation'
     */
    drawBuilding(building) {
        const windowTileHeight = Math.ceil(window.innerHeight / this.tileSize);
        const windowTileWidth = Math.ceil(window.innerWidth / this.tileSize);
        const screen_buildLocationY = building.building_location[0] - this.viewY;
        const screen_buildLocationX = building.building_location[1] - this.viewX;

        for (const tile of building.tile_rel_locations) {
            const screen_currTileLocY = screen_buildLocationY + tile[0][0];
            const screen_currTileLocX = screen_buildLocationX + tile[0][1];
            if (screen_currTileLocY > windowTileHeight || screen_currTileLocX > windowTileWidth) {
                continue;
            }
            const filePath = "/static/img/assets/buildings/" + getAssetDir(tile[1]) + "/" + tile[1] + ".png";
            const img = this.buildingAssets[filePath];

            const grassPath = "/static/img/assets/terrain/Water/Water.1.png";
            const grassImage = this.buildingAssets[grassPath];
            if (img) {
                this.ctx.drawImage(grassImage, screen_currTileLocX * this.tileSize, screen_currTileLocY * this.tileSize, this.tileSize, this.tileSize);
                this.ctx.drawImage(img, screen_currTileLocX * this.tileSize, screen_currTileLocY * this.tileSize, this.tileSize, this.tileSize);
            } else {
                console.error("BuildingMap.drawTiles(): image does not exist")
            }
        }
    }

    /**
     * Draws the buildings. 'this.buildingInformation'
     * @param topBuilding optional: Can be set if a building needs to be drawn on top of all other buildings.
     */
    drawTiles(topBuilding = null) {
        this.ctx.clearRect(0,0, window.innerWidth, window.innerHeight);
        for (const buildingKey in this.buildingInformation) {
            if (!Object.hasOwnProperty.call(this.buildingInformation, buildingKey)) {
                continue;
            }
            const currBuilding = this.buildingInformation[buildingKey];

            this.drawBuilding(currBuilding);
        }
        // Draw top again
        if (topBuilding !== null) {
            this.drawBuilding(topBuilding);
        }

    }

    /**
     * Gets called by the Tick class with regular time intervals.
     */
    tick() {
        //console.log("building layer tick");
    }

    /**
     *
     * @param rel_y
     * @param rel_x
     * @param buildingToMove object from 'this.buildingInformation'
     * @returns {boolean} returns true if the move is to a valid location, false if the move isn't valid
     */
    checkValidMoveLocation(rel_y, rel_x, buildingToMove) {
        let forbiddenTiles = [];

        let buildingInfoCopy = structuredClone(this.buildingInformation);
        delete buildingInfoCopy[buildingToMove.self_key];
        // Finding all forbidden tiles
        for (const building of Object.values(buildingInfoCopy)) {
            for (const currTile of building.tile_rel_locations) {
                const currYValue = building.building_location[0] + currTile[0][0];
                const currXValue = building.building_location[1] + currTile[0][1];
                forbiddenTiles.push([currYValue, currXValue]);
            }
        }

        // Finding all new tile locations
        let newLocations = [];
        for (const currTile of buildingToMove.tile_rel_locations) {
            const currNewYValue = buildingToMove.building_location[0] + rel_y + currTile[0][0];
            const currNewXValue = buildingToMove.building_location[1] + rel_x + currTile[0][1];
            newLocations.push([currNewYValue, currNewXValue]);
        }

        // Check for other building overlap
        for (const currTile of newLocations) {
            let existsInForbiddenTiles = forbiddenTiles.some(([y, x]) =>
                y === currTile[0] && x === currTile[1]
            );
            if (existsInForbiddenTiles) {
                return false;
            }
        }

        // Check for forbidden terrain overlap
        for (const currTile of newLocations) {
            const correspondingTerrainTile = this.terrainMapInstance.tiles[currTile[0]][currTile[1]];
            const terrainType = getAssetDir(correspondingTerrainTile);
            if (terrainType === "Water") {
                return false;
            }
        }

        return true;
    }

    inBounds(rel_y, rel_x, buildingToMove) {
        // Finding all new tile locations
        let newLocations = [];
        for (const currTile of buildingToMove.tile_rel_locations) {
            const currNewYValue = buildingToMove.building_location[0] + rel_y + currTile[0][0];
            const currNewXValue = buildingToMove.building_location[1] + rel_x + currTile[0][1];
            newLocations.push([currNewYValue, currNewXValue]);
        }

        for (const currTile of newLocations) {
            if (currTile[0] < 0 || currTile[0] >= this.map_height || currTile[1] < 0 || currTile[1] >= this.map_width) {
                return false;
            }
        }
        return true;
    }

    /**
     * Moves a building relative to its original location.
     * @param rel_y
     * @param rel_x
     * @param buildingToMove object from 'this.buildingInformation'
     * @param setToTop if marked true, sets the building being moved to the top of the screen.
     */
    moveBuilding(rel_y, rel_x, buildingToMove, setToTop = false) {
        if (this.inBounds(rel_y, rel_x, buildingToMove)) {
            if (this.checkValidMoveLocation(rel_y, rel_x, buildingToMove)) {
                console.log("Move successful");
                // zet ui op groen
            } else {
                console.log("Move not valid");
                // zet ui op rood
            }

            buildingToMove.building_location[0] += rel_y;
            buildingToMove.building_location[1] += rel_x;
            this.tiles = this.generateBuildingTileMap();

            if (setToTop) {
                this.drawTiles(buildingToMove);
            } else {
                this.drawTiles();
            }

        } else {
            console.log("can't move out of bounds");
        }
    }

    /**
     * Gets called by the 'UserInputHandler' class every time the mouse moves.
     * @param client_x x value on-screen
     * @param client_y y value on-screen
     */
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

        //console.log(`relDistanceY ${relDistanceY}, relDistanceX ${relDistanceX}`);

        if (relDistanceX !== 0 || relDistanceY !== 0) {
            const buildingToMove = this.buildingInformation[this.buildingClickedName];
            this.moveBuilding(relDistanceY, relDistanceX, buildingToMove, true);
            this.prevMouseMoveBuildingLoc[0] = tileY;
            this.prevMouseMoveBuildingLoc[1] = tileX;
        }
    }

    /**
     * Gets called when user clicks.
     * @param client_x x click on screen
     * @param client_y y click on screen
     * @returns {boolean} Returns true when click is used by this class.
     */
    handleClick(client_x,client_y) {
        //debugger;
        let tileX = Math.floor(client_x/this.tileSize) + this.viewX;
        let tileY = Math.floor(client_y/this.tileSize) + this.viewY;

        // No click on building and not moving building
        if (this.tiles[tileY][tileX] === EMPTY_TILE && this.movingBuilding === false) {
            return false;
        }

        console.log(`click op building layer, tile x: ${tileX}, y: ${tileY} --> ${this.tiles[tileY][tileX][1]}`);

        // Click on building and not yet moving
        if (this.movingBuilding === false) {
            this.movingBuilding = true;
            this.ownNextClick = true;
            this.buildingClickedName = this.tiles[tileY][tileX][1];
            this.currBuildingOrgLocation = Array.from(this.buildingInformation[this.buildingClickedName].building_location);
            return true;
        }

        // Click while moving building
        if (this.movingBuilding === true) {
            const buildingToMove = this.buildingInformation[this.buildingClickedName];

            if (this.checkValidMoveLocation(0,0, buildingToMove)) {
                this.movingBuilding = false;
                this.ownNextClick = false;
                this.prevMouseMoveBuildingLoc = null;
                console.log("Op een juiste plek geplaatst");
                this.updateBuildingMapDB();
            } else {
                //const revertRelY = this.currBuildingOrgLocation[0] - buildingToMove.building_location[0];
                //const revertRelX = this.currBuildingOrgLocation[1] - buildingToMove.building_location[1];
                //this.moveBuilding(revertRelY, revertRelX, buildingToMove);
                console.error("invalid locatie om gebouw te plaatsen");

            }
            // check of move valid is met rel_x, rel_y = 0
            // Terug naar originele locatie
        }
        return true;
    }


    toJSON() {
        return JSON.stringify({
            map_width: this.map_width,
            map_height: this.map_height,
            building_information: this.buildingInformation
        });
    }

    async updateBuildingMapDB() {
        const BASE_URL = `${window.location.protocol}//${window.location.host}`;
        const fetchLink = BASE_URL + "/game/update-building-map";
        const mapDataJson = this.toJSON(); // Serialize the map data to JSON
        try {
            const response = await fetch(fetchLink, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: mapDataJson // Send the serialized map data as the request body
            });

            if (response.ok) {
                const jsonResponse = await response.json();
                console.log('BuildingMap DB update successful:', jsonResponse);
            } else {
                console.error('BuildingMap DB update failed with status:', response.status);
            }
        } catch (error) {
            console.error('Failed to update map in database:', error);
        }
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

    */
}