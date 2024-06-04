import {BaseMap} from "./baseMap.js";
import {closePopup, isPopupOpen, openPopup} from "./buildingPopup.js";
import {utils} from "./utils.js";
import {defaultBuildingMapData} from "./Data/defaultBuildingMapData.js";

/**
 * These variables are used to not have magic strings in the code.
 */
export const EMPTY_TILE = "None";
export const FIELD_GENERAL_INFO_NAME = "Field3";
export const BAY_GENERAL_INFO_NAME = "Bay";

function getAssetDir(assetName) {
    return assetName.split('.')[0];
}


/**
 * Example of the generated grid will look like:
 * This will be used to check for overlap and possibly by other classes to check the building layout.
 */
/*
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
}*/

/**

 -- Tile coordinates: (y,x) --

 0  1  2  3 | x
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
     * @param cropMapInstance This is en instance that is needed in order to call the drawTiles function when a building moves
     * @param username The username of the player. Used to fetch the right map data.
     */
    constructor(mapData = defaultBuildingMapData, _tileSize, _ctx, terrainMapInstance, cropMapInstance, username) {

        super(mapData, _tileSize, username);

        this.buildingInformation = mapData.building_information; // Contains all the building information
        this.buildingGeneralInformation = mapData.building_general_information // Contains all the general information of the buildings
        this.tiles = null; // Contains the tile map of the buildings
        this.ctx = _ctx; // The context needed for drawing on-screen

        this.buildingAssetList = {}; // Contains json of all assets that need to be fetched.
        this.relativeLocations = {} // Contains the relative locations of all the buildings.
        this.buildingAssets = {}; // Bevat {"pad_naar_asset": imageObject}

        this.terrainMapInstance = terrainMapInstance; // Instance of the terrain map
        this.cropMapInstance = cropMapInstance; // Instance of the crop map

        // Variables to remember the click state
        this.movingBuilding = false; // Boolean to check if a building is being moved
        this.buildingClickedName = ""; // The name of the building that is clicked

        // To remember building following mouse movement
        this.prevMouseMoveBuildingLoc = null; // Coordinates are always of the form: [y, x]

        this.buildingUnlockLevels = { // json with all levels and what buildings unlock at this level --> [Count, general_information]
            1: [[2, "Field"], [1, "Goatbarn"]], // This is an example of 1 level
        };

    }

    /**
     * Initialises the building layer. Fetches everything that needs to be fetched from the server, and stores it.
     * It also generates the tile map of the buildings and hides the loading screen.
     */
    async initialize() {
        await this.fetchBuildingAssetList();
        await this.fetchRelativeLocations();
        await this.fetchBuildingMapData();
        this.tiles = this.generateBuildingTileMap();
        await new Promise((resolve) => this.preloadBuildingAssets(resolve));
        // Safe to call stuff here
        this.generateBuildingUnlockLevelJson();
        hideLoadingScreen();

    }

    /**
     * Generates a javascript object with all the unlock levels and the buildings that unlock at this level.
     */
    generateBuildingUnlockLevelJson() {
        // Initialize the buildingUnlockLevels object with keys 1 to 10
        const buildingUnlockLevels = {};
        for (let i = 0; i <= 10; i++) {
            buildingUnlockLevels[i] = [];
        }

        // Temporary object to count general_information occurrences per unlock_level
        const temp_dict = {};
        for (let i = 0; i <= 10; i++) {
            temp_dict[i] = {};
        }
        // Iterate over the building information
        for (const key in this.buildingInformation) {
            if (key === "townhall") {  // Skip the townhall
                continue;
            }

            const info = this.buildingInformation[key];
            const unlock_level = info.unlock_level;
            const general_info = info.general_information;

            if (temp_dict[unlock_level][general_info]) {
                temp_dict[unlock_level][general_info] += 1;
            } else {
                temp_dict[unlock_level][general_info] = 1;
            }
        }

        // Populate the buildingUnlockLevels object
        for (const level in temp_dict) {
            for (const general_info in temp_dict[level]) {
                buildingUnlockLevels[level].push([temp_dict[level][general_info], general_info]);
            }
        }
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

            //const generalInfoKey = currBuilding.general_information
            //const tile_rel_locations = this.buildingGeneralInformation[generalInfoKey].tile_rel_locations
            const tile_rel_locations = this.getRelativeLocations(currBuilding);
            for (const currTile of tile_rel_locations) {
                let tileToDrawWithoutLevelReplaced = currTile[1];
                const buildingLevel = currBuilding.level
                let tileToDrawName = tileToDrawWithoutLevelReplaced.replace(/@/g, buildingLevel);
                const newTileMapElement = [tileToDrawName, buildingKey];
                const currMapLocationY = locationY + currTile[0][0];
                const currMapLocationX = locationX + currTile[0][1];
                toReturn[currMapLocationY][currMapLocationX] = newTileMapElement;
            }
        }

        return toReturn;
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

        console.log("fetchBuildingAssetList() success");
    }

    async fetchRelativeLocations() {
        try {
            const response = await fetch('/static/img/assets/relativeLocation.json');
            this.relativeLocations = await response.json();
        } catch (error) {
            console.error('fetchRelativeLocations() failed:', error);
            throw error;
        }

        console.log("fetchRelativeLocations() success");
    }

    /**
     * Fetches the buildingMapData json which stores the layout and other information needed.
     */
    async fetchBuildingMapData() {
        const BASE_URL = `${window.location.protocol}//${window.location.host}`;
        try {
            let fetchLink = BASE_URL + "/api/fetch-building-information";
            if (this.username) {
                fetchLink += `/${this.username}`;
            }
            console.log("fetchBuildingMapData() fetchLink: ", fetchLink);
            const response = await fetch(fetchLink);
            const mapData = await response.json();

            // Check if mapData contains building_information

            if ("building_information" in mapData) {
                this.buildingInformation = mapData.building_information;
            } else {
            // No buildings found
                await this.updateBuildingMapDB();
                console.log(mapData);
                console.log("No buildings found.");

            }

            // Resetting view coordinates
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
     * Returns the level of a fence based on the asset string.
     * @param assetString - The asset string of the fence
     * @returns {number} - The level of the fence
     */
    getFenceLevel(assetString) {
        const levelString = assetString.split('.')[1].slice(1);
        return Number(levelString);
    }

    /**
     * Adjust the fence asset based on surrounding fences.
     * @param originalAssetName - The original asset name of the fence
     * @param yLocation - The y location of the fence
     * @param xLocation - The x location of the fence
     * @returns {string} - The adjusted asset name of the fence
     */
    adjustFenceAsset(originalAssetName, yLocation, xLocation) {
        const splitAssetName = originalAssetName.split('.')
        let baseAssetName = splitAssetName[0] + '.' + splitAssetName[1] + '.';

        let assetN = "None";
        let assetO = "None";
        let assetZ = "None";
        let assetW = "None";

        if (yLocation > 0) {
            assetN = this.tiles[yLocation - 1][xLocation] === "None" ? "None" : this.tiles[yLocation - 1][xLocation][0];
        }
        if (xLocation < this.map_width - 1) {
            assetO = this.tiles[yLocation][xLocation + 1] === "None" ? "None" : this.tiles[yLocation][xLocation + 1][0];
        }
        if (yLocation < this.map_height - 1) {
            assetZ = this.tiles[yLocation + 1][xLocation] === "None" ? "None" : this.tiles[yLocation + 1][xLocation][0];
        }
        if (xLocation > 0) {
            assetW = this.tiles[yLocation][xLocation - 1] === "None" ? "None" : this.tiles[yLocation][xLocation - 1][0];
        }

        const currFenceLvl = this.getFenceLevel(originalAssetName);

        let appendedDirection = false;
        if (utils.getAssetDir(assetN) === "Fence" && currFenceLvl === this.getFenceLevel(assetN)) {
            baseAssetName += "N";
            appendedDirection = true;
        }
        if (utils.getAssetDir(assetO) === "Fence" && currFenceLvl === this.getFenceLevel(assetO)) {
            baseAssetName += "O";
            appendedDirection = true;
        }
        if (utils.getAssetDir(assetZ) === "Fence" && currFenceLvl === this.getFenceLevel(assetZ)) {
            baseAssetName += "Z";
            appendedDirection = true;
        }
        if (utils.getAssetDir(assetW) === "Fence" && currFenceLvl === this.getFenceLevel(assetW)) {
            baseAssetName += "W";
            appendedDirection = true;
        }

        if (!appendedDirection) {
            baseAssetName = baseAssetName.slice(0, -1);
        }
        return baseAssetName;
    }

    /**
     * Adjusts the field asset based on the cropMapInstance. When a crop is finished a green border appears.
     * @param originalAssetName - The original asset name of the field
     * @param fieldName - The name of the field
     * @returns {*|string} - The adjusted asset name of the field
     */
    adjustFieldAsset(originalAssetName, fieldName) {
        if (this.cropMapInstance.isHarvestable(fieldName)) {
            if (!originalAssetName.includes(".Done")) {
                return originalAssetName + ".Done";
            }
        } else {
            if (originalAssetName.includes(".Done")) {
                return originalAssetName.replace(".Done", "");
            }
        }
        return originalAssetName;
    }

    /**
     * Returns the percentage of the silo that is filled. Right now not implemented. Always returns 0%.
     * @param building_obj - The building object of the silo
     * @returns {string} - The percentage of the silo that is filled
     */
    getSiloPercentage(building_obj) {
        const key = building_obj.self_key;
        // todo Percent implementeren als ge wilt
        return "0%";
    }

    /**
     * Returns the relative locations of a building based on the building object.
     * @param building_obj - The building object
     * @param frame - The frame the code is at to animate Bay. Right now not implemented
     * @returns {*}
     */
    getRelativeLocations(building_obj, frame=null) {
        const generalInfoKey = building_obj.general_information;
        const level = building_obj.level;

        let locationsKey = generalInfoKey + ".L" + level;

        if (generalInfoKey === "Silo") {
            locationsKey += "." + this.getSiloPercentage(building_obj);
        } else if (generalInfoKey === "Bay") {
            locationsKey += ".F1";
        }

        return this.relativeLocations[locationsKey];
    }

    /**
     * Draws a building on screen.
     * @param building a building object of 'this.buildingInformation'
     */
    drawBuilding(building) {
        const windowTileHeight = Math.ceil(window.innerHeight / this.tileSize);
        const windowTileWidth = Math.ceil(window.innerWidth / this.tileSize);
        const screen_buildLocationY = building.building_location[0] - this.viewY;
        const screen_buildLocationX = building.building_location[1] - this.viewX;

        const tile_rel_locations = this.getRelativeLocations(building);

        for (const tile of tile_rel_locations) {
            const screen_currTileLocY = screen_buildLocationY + tile[0][0];
            const screen_currTileLocX = screen_buildLocationX + tile[0][1];

            if (screen_currTileLocY > windowTileHeight || screen_currTileLocX > windowTileWidth || screen_currTileLocY < 0 || screen_currTileLocX < 0) {
                continue;
            }

            let tileToDrawName = tile[1];
            if (utils.getAssetDir(tileToDrawName) === "Fence") {
                const currTileLocY = building.building_location[0] + tile[0][0];
                const currTileLocX = building.building_location[1] + tile[0][1];
                tileToDrawName = this.adjustFenceAsset(tileToDrawName, currTileLocY, currTileLocX)
            }
            if (utils.getAssetDir(tileToDrawName) === "Field3") {
                tileToDrawName = this.adjustFieldAsset(tileToDrawName, building.self_key);
            }
            const img = this.buildingAssets["/static/img/assets/buildings/" + utils.getAssetDir(tileToDrawName) + "/" + tileToDrawName + ".png"];
            if (img) {
                this.ctx.drawImage(img, screen_currTileLocX * this.tileSize, screen_currTileLocY * this.tileSize, this.tileSize, this.tileSize);
            } else {
                console.error("BuildingMap.drawTiles(): image does not exist")
            }
        }
    }

    /**
     * Draws all the buildings based of 'this.buildingInformation'
     * @param topBuilding optional: Can be set if a building needs to be drawn on top of all other buildings.
     */
    drawTiles(topBuilding = null) {
        this.tiles = this.generateBuildingTileMap();
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
        this.terrainMapInstance.drawTiles();
        this.cropMapInstance.drawTiles();
    }

    /**
     * Gets called by the Tick class with regular time intervals.
     */
    tick() {
        //console.log("building layer tick");
    }

    /**
     * Returns whether a given tile is an edge tile.
     * @param tileName - The name of the tile
     * @returns {boolean} - True if the tile is an edge tile, false if not
     */
    isEdgeTile(tileName) {
        if (utils.getAssetDir(tileName) === "Grass") {
            let str = String(tileName);
            const targetLetters = ['N', 'O', 'W', 'Z'];
            return targetLetters.some(letter => str.includes(letter));
        }
        return false;
    }

    /**
     * Returns whether a coordinate is on the building placeable rectangle of the map.
     * @param yCoord - The map y coordinate
     * @param xCoord - The map x coordinate
     * @returns {boolean} - True if the coordinate is on the building placeable rectangle, false if not
     */
    isOnGrassRectangle(yCoord, xCoord) {
        return yCoord > 3 && yCoord < this.map_height - 4  &&  xCoord > 3 && xCoord < this.map_width - 4;
    }

    /**
     * Checks whether a future move is valid
     * @param rel_y - The relative y movement compared to the previous location
     * @param rel_x - The relative x movement compared to the previous location
     * @param buildingToMove object from 'this.buildingInformation'
     * @returns {boolean} returns true if the move is to a valid location, false if the move isn't valid
     */
    checkValidMoveLocation(rel_y, rel_x, buildingToMove) {
        let forbiddenTiles = [];

        let buildingInfoCopy = structuredClone(this.buildingInformation);
        delete buildingInfoCopy[buildingToMove.self_key];
        // Finding all forbidden tiles
        for (const building of Object.values(buildingInfoCopy)) {
            const generalInfoKey = building.general_information;
            const tile_rel_locations = this.buildingGeneralInformation[generalInfoKey].tile_rel_locations;
            for (const currTile of tile_rel_locations) {
                const currYValue = building.building_location[0] + currTile[0][0];
                const currXValue = building.building_location[1] + currTile[0][1];
                forbiddenTiles.push([currYValue, currXValue]);
            }
        }

        // Finding all new tile locations
        let newLocations = [];
        const generalInfoKey = buildingToMove.general_information;
        const tile_rel_locations = this.buildingGeneralInformation[generalInfoKey].tile_rel_locations;
        for (const currTile of tile_rel_locations) {
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
            if (!this.isOnGrassRectangle(currTile[0], currTile[1])) {
                return false;
            }
        }

        return true;
    }

    /**
     * Check whether a building to move is attempted to be moved in-bound or out of bounds
     * @param rel_y - The relative y movement compared to the previous location
     * @param rel_x - The relative x movement compared to the previous location
     * @param buildingToMove object from 'this.buildingInformation'
     * @returns {boolean} returns true if the move is correctly in bounds
     */
    inBounds(rel_y, rel_x, buildingToMove) {
        // Finding all new tile locations
        let newLocations = [];
        const generalInfoKey = buildingToMove.general_information;
        const tile_rel_locations = this.buildingGeneralInformation[generalInfoKey].tile_rel_locations;
        for (const currTile of tile_rel_locations) {
        //for (const currTile of buildingToMove.tile_rel_locations) {
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
     * @param rel_y - The relative y movement compared to the previous location
     * @param rel_x - The relative x movement compared to the previous location
     * @param buildingToMove object from 'this.buildingInformation'
     * @param setToTop if marked true, sets the building being moved to the top of the screen.
     */
    moveBuilding(rel_y, rel_x, buildingToMove, setToTop = false) {
        if (this.inBounds(rel_y, rel_x, buildingToMove)) {
            if (this.checkValidMoveLocation(rel_y, rel_x, buildingToMove)) {
                console.log("Move successful");
            } else {
                console.log("Move not valid");
            }

            buildingToMove.building_location[0] += rel_y;
            buildingToMove.building_location[1] += rel_x;
            this.tiles = this.generateBuildingTileMap();
            if (isPopupOpen) {
                closePopup();
            }

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
     * Checks whether the mouse is hovering over a building.
     * @param tileX - The x tile coordinate
     * @param tileY - The y tile coordinate
     * @returns {boolean}
     */
    hoveringOverBuilding(tileX, tileY) {
        if (this.tiles[tileY][tileX] !== EMPTY_TILE) {
            return true;
        }
    }


    /**
     * Gets called by the 'UserInputHandler' class every time the mouse moves.
     * @param client_x x value on-screen
     * @param client_y y value on-screen
     */
    handleMouseMove(client_x, client_y) {
        let tileX = Math.floor(client_x/this.tileSize) + this.viewX;
        let tileY = Math.floor(client_y/this.tileSize) + this.viewY;

        if (!this.movingBuilding) {
            // Check if building is unlocked
            if (this.hoveringOverBuilding(tileX, tileY) && !isPopupOpen) {
                const buildingHoverName = this.tiles[tileY][tileX][1];
                if (!this.isBuildingUnlocked(buildingHoverName)) {
                    // Building is not unlocked
                    this.showSoftUnlockWarning();
                } else {
                    this.hideSoftUnlockWarning();
                }
            } else {
                this.hideSoftUnlockWarning();
            }
            return;
        }

        if (this.prevMouseMoveBuildingLoc === null) {
            this.prevMouseMoveBuildingLoc = [tileY, tileX];
        }

        const relDistanceY = tileY - this.prevMouseMoveBuildingLoc[0];
        const relDistanceX = tileX - this.prevMouseMoveBuildingLoc[1];

        if (relDistanceX !== 0 || relDistanceY !== 0) {
            const buildingToMove = this.buildingInformation[this.buildingClickedName];
            this.moveBuilding(relDistanceY, relDistanceX, buildingToMove, true);
            this.prevMouseMoveBuildingLoc[0] = tileY;
            this.prevMouseMoveBuildingLoc[1] = tileX;
        }
    }

    /**
     * Return the level of the town hall which corresponds to the player level.
     * @returns {number} - The level of the town hall
     */
    getTownHallLVL() {
        const townHallBuilding = this.buildingInformation["townhall"];
        return townHallBuilding.level;
    }

    /**
     * Return whether a building is unlocked based on the town hall level.
     * @param buildingName - The name of the building
     * @returns {boolean} - True if the building is unlocked, false if not.
     */
    isBuildingUnlocked(buildingName) {
        return this.buildingInformation[buildingName].unlock_level <= this.getTownHallLVL();
    }

    /**
     * Gets called when user clicks. Many possible events need to happen here. Moving a building needs a lot of checks.
     * A field possibly needs to be harvested.
     * @param client_x x click on screen
     * @param client_y y click on screen
     * @returns {boolean} Returns true when click is used by this class.
     */
    handleClick(client_x, client_y) {
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
            const buildingName = this.tiles[tileY][tileX][1];
            this.buildingClickedName = buildingName;
            // Check whether building is unlocked
            if (this.buildingInformation[buildingName].unlock_level > this.getTownHallLVL()) {
                this.showUnlockWarning(this.buildingInformation[buildingName]);
                return true;
            }
            if (this.buildingInformation[buildingName].general_information === BAY_GENERAL_INFO_NAME) {
                return true;
            }

            // Check whether building is a harvestable field
            if (this.buildingInformation[buildingName].general_information === FIELD_GENERAL_INFO_NAME) {
                const fieldName = this.buildingClickedName
                if (this.cropMapInstance.isHarvestable(fieldName)) {
                    const fieldLevel = this.buildingInformation[buildingName].level
                    this.cropMapInstance.harvestField(fieldName, fieldLevel);
                    return true; // moet gebeuren
                }
            }

            // If the username is set it means you are visiting someone else's farm meaning you can't move buildings
            if (!this.username) {
                this.movingBuilding = true;
                this.ownNextClick = true;
                return true;
            }

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
                this.updateBuildingMapDB().then(/* If something needs to happen after the update */);
            } else {
                console.error("invalid locatie om gebouw te plaatsen");
                this.showLocationWarning();

            }
        }
        return true;
    }


    /**
     * Handles the right-click input of the user. When right-clicking a building a pop-up needs to be opened.
     * When visiting a friend or attacking, nothing should happen.
     * @param client_x the x screen pixel
     * @param client_y the y screen pixel
     * @returns {boolean} returns true if the click is used, false if not
     */
    handleRightClick(client_x, client_y) {
        let tileX = Math.floor(client_x/this.tileSize) + this.viewX;
        let tileY = Math.floor(client_y/this.tileSize) + this.viewY;

        if (this.tiles[tileY][tileX] !== EMPTY_TILE && !this.username) {
            console.log(`Right click op building layer, tile x: ${tileX}, y: ${tileY} --> ${this.tiles[tileY][tileX][1]}`);
            const buildingName = this.tiles[tileY][tileX][1];
            if (this.buildingInformation[buildingName].unlock_level > this.getTownHallLVL()) {
                this.showUnlockWarning(this.buildingInformation[buildingName]);
                return true;
            }
            openPopup(this.buildingInformation, this.buildingGeneralInformation, buildingName);
            return true;
        }
        return false;

    }

    /**
     * Shows a warning when a building is placed on an invalid location.
     */
    showLocationWarning() {
        const warningElement = document.getElementById('building-placement-warning');
        // Show the element instantly
        warningElement.style.opacity = '1';
        warningElement.style.transition = 'none'; // Ensure no transition initially

        // After 1 second, fade out
        setTimeout(() => {
            warningElement.style.transition = 'opacity 1.5s ease-out'; // Apply the transition for fading out
            warningElement.style.opacity = '0';
        }, 1500);
    }

    /**
     * Hides the location warning. (Not used)
     */
    hideLocationWarning() {
        const warningElement = document.getElementById('building-placement-warning');
        warningElement.classList.remove('show');
    }

    /**
     * Shows a warning when trying to click or right-click a building that you haven't unlocked.
     * @param building - The building object.
     */
    showUnlockWarning(building) {
        this.hideSoftUnlockWarning();
        const warningElement = document.getElementById('building-unlock-warning');
        const warningElementLvlText = document.getElementById('building-unlock-warning-lvl-text');
        warningElementLvlText.innerText = building.unlock_level

        // Show the element instantly
        warningElement.style.transition = 'opacity 0.1s ease-in';
        warningElement.style.opacity = '1';

        // After 1.5 seconds, fade out
        setTimeout(() => {
            warningElement.style.transition = 'opacity 1.5s ease-out'; // Apply the transition for fading out
            warningElement.style.opacity = '0';
        }, 1500);
    }

    /**
     * Checks whether a warning popup is currently being shown.
     * @returns {boolean} - True if a warning popup is being shown, false if not.
     */
    isShowingUnlockWarning() {
        const warningPopups = document.getElementsByClassName('warning-popup');
        for (let i = 0; i < warningPopups.length; i++) {
            const computedStyle = window.getComputedStyle(warningPopups[i]);
            const opacity = computedStyle.getPropertyValue('opacity');
            if (opacity !== '0') {
                return true;
            }
        }
        return false;
    }


    /**
     * Shows a softer unlock warning. Used when user hovers over a building that is not unlocked.
     */
    showSoftUnlockWarning() {
        if (!this.isShowingUnlockWarning()) {
            const warningElement = document.getElementById('soft-building-unlock-warning');
            warningElement.classList.add('show');
        }
    }

    /**
     * Hides the soft unlock warning.
     */
    hideSoftUnlockWarning() {
        const warningElement = document.getElementById('soft-building-unlock-warning');
        warningElement.classList.remove('show');
    }



    /**
     * converts js object to json
     * @returns {string} the json
     */
    toJSON() {
        return JSON.stringify({
            map_width: this.map_width,
            map_height: this.map_height,
            building_information: this.buildingInformation
        });
    }

    /**
     * Sends the building map to the database to be updated.
     * @returns {Promise<void>} - A promise that resolves when the update is successful.
     */
    async updateBuildingMapDB() {
        const BASE_URL = `${window.location.protocol}//${window.location.host}`;
        const fetchLink = BASE_URL + "/game/update-building-map";
        const mapDataJson = this.toJSON(); // Serialize the map data to JSON
        //console.log('BuildingMap DB ', mapDataJson);
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
}