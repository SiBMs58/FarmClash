import { BaseMap } from "./baseMap.js";
import { openPopup, closePopup, isPopupOpen } from "./buildingPopup.js";
import { utils } from "./utils.js";

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
export const defaultMapData2 = {
    map_width: 58,
    map_height: 43,

    building_information: {
        fence1: {
            self_key: "fence1", // Must be the exact key of this sub-object
            general_information: "fence", // Link to the general information of this building type
            level: 4, // Building level (set "None" if not relevant)
            building_location: [5, 4], // --> [y (height), x (width)], it's best practice to take the top-left corner of the building
            tile_rel_locations: [ // location relative to 'building_location'
                [[0, 0], "Fence.L4"], // [ rel_location ([y, x]), "Tile asset"]
            ]
        },
        fence2: {
            self_key: "fence2",
            general_information: "fence",
            level: 3,
            building_location: [5, 7],
            tile_rel_locations: [
                [[0, 0], "Fence.L5"],
            ]
        },
        fence3: {
            self_key: "fence3",
            general_information: "fence",
            level: 2,
            building_location: [8, 8],
            tile_rel_locations: [
                [[0, 0], "Fence.L3"],
            ]
        },
        fences_lv1: {
            self_key: "fences_lv1",
            general_information: "fence",
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
            general_information: "fence",
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
            general_information: "fence",
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
            general_information: "chicken_house",
            level: 5,
            building_location: [12, 11],
            tile_rel_locations: [
                [[0, 0], "Chickencoop.L1.1.1"],
                [[0, 1], "Chickencoop.L1.1.2"],
                [[1, 0], "Chickencoop.L1.2.1"],
                [[1, 1], "Chickencoop.L1.2.2"],
                [[2, 0], "Chickencoop.3.1"],
                [[2, 1], "Chickencoop.3.2"],
            ]
        }
    },

    building_general_information: {
        chicken_house: {
            display_name: "Chicken House", // Name to be displayed in the popup
            explanation: "Dive into the heart of your farm's egg production with the Chicken House. " +
                "This vital building is where your feathered friends lay eggs, ready for " +
                "market sale. Upgrade to boost production. Every egg sold brings you one " +
                "step closer to agricultural dominance.",
            upgrade_costs: [500, 1000, 2000, 3500, 5000, 7000], // All costs per level starting from level 2 (in this case level1 -> level2 costs 500 coins)
            other_stats: [["Eggs/hour", [1, 2, 3, 4, 5, 6, 7]], ["Defence", [50, 100, 150, 200, 400, 470, 550]]] // All other stats specific for this building. ["Stat name display", [array of all values per level]]
        },
        fence: {
            display_name: "Fence",
            explanation: "Strategically place your fences in order to defend you farm from intruders as effectively as possible.",
            upgrade_costs: [500, 1000, 2000, 3500],
            other_stats: [["Defence", [50, 100, 150, 200, 400]]]
        },
        tree: {
            display_name: "Tree",
            explanation: "This is just a tree."
        }
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


export class BuildingMap extends BaseMap {
    /**
     * @param mapData This is set to a default version of the map, if database fetch succeeds this will be overridden.
     * @param _tileSize The tile size to be displayed on screen.
     * @param _ctx context needed for drawing on-screen.
     * @param terrainMapInstance This is an instance that is needed for certain checks (for example to make sure a building isn't being placed on water)
     * @param uiLayerInstance This instance is needed to draw the correct building UI.
     * @param username The username of the player. Used to fetch the right map data.
     */
    constructor(mapData = defaultMapData2, _tileSize, _ctx, terrainMapInstance, uiLayerInstance, username) {

        super(mapData, _tileSize, username);

        this.buildingInformation = mapData.building_information;
        this.buildingGeneralInformation = mapData.building_general_information
        this.tiles = this.generateBuildingTileMap();
        this.ctx = _ctx;

        this.buildingAssetList = {}; // Bevat de json van alle asset file names die ingeladen moeten worden
        this.buildingAssets = {}; // Bevat {"pad_naar_asset": imageObject}

        this.terrainMapInstance = terrainMapInstance;
        this.uiLayerInstance = uiLayerInstance;


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
        await this.fetchBuildingMapData();
        this.tiles = this.generateBuildingTileMap();
        await new Promise((resolve) => this.preloadBuildingAssets(resolve));
        // Safe to call stuff here
        //debugger;
        console.log("fetchBuildingLayerList() success");
        hideLoadingScreen();
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
            debugger;
            console.error('fetchBuildingAssetList() failed:', error);
            throw error;
        }

        console.log("fetchBuildingAssetList() success, buildingAssetList: ", this.buildingAssetList);
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
            //debugger;

            if ("building_information" in mapData) {
                console.log("fetchBuildingMapData() success, BuildingMapData: ", this.buildingInformation);
                console.log("fetchBuildingMapData() success, BuildingMapData: ", this.buildingGeneralInformation);
                this.buildingInformation = mapData.building_information;
                console.log("fetchBuildingMapData() success, BuildingMapData: ", this.buildingInformation);
                console.log("fetchBuildingMapData() success, BuildingMapData: ", this.buildingGeneralInformation);
                console.log("fetchBuildingMapData() success, BuildingMapData: ", this.tiles);
            } else {
            // No buildings found
                await this.updateBuildingMapDB();
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

            /* This works but very buggy, also doesnt take in to account water and buildings beneath
            const grassImg = new Image();
            grassImg.src = "/static/img/assets/terrain/Grass/Grass.1.png";
            grassImg.onload = () => {
                this.ctx.drawImage(grassImg, screen_currTileLocX * this.tileSize, screen_currTileLocY * this.tileSize, this.tileSize, this.tileSize);
                 if (screen_currTileLocY > windowTileHeight || screen_currTileLocX > windowTileWidth) {
                continue;
            }

            const img = this.buildingAssets["/static/img/assets/buildings/" + getAssetType(tile[1]) + "/" + tile[1] + ".png"];
            if (img) {
                this.ctx.drawImage(img, screen_currTileLocX * this.tileSize, screen_currTileLocY * this.tileSize, this.tileSize, this.tileSize);
            } else {
                console.error("BuildingMap.drawTiles(): image does not exist")
            }
            };
             */

            if (screen_currTileLocY > windowTileHeight || screen_currTileLocX > windowTileWidth) {
                continue;
            }

            const img = this.buildingAssets["/static/img/assets/buildings/" + utils.getAssetDir(tile[1]) + "/" + tile[1] + ".png"];
            if (img) {
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
            const terrainType = utils.getAssetDir(correspondingTerrainTile);
            if (terrainType === "Water") {
                return false;
            }
        }

        return true;
    }

    /**
     * Check whether a building to move is attempted to be moved in-bound or out of bounds
     * @param rel_y
     * @param rel_x
     * @param buildingToMove object from 'this.buildingInformation'
     * @returns {boolean} returns true if the move is correctly in bounds
     */
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

    hoveringOverBuilding(tileX, tileY) {

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
            if (this.hoveringOverBuilding(tileX, tileY)) {
                const buildingHoverName = this.tiles[tileY][tileX][1];
                this.uiLayerInstance.drawHoverUI(buildingHoverName, this.viewX, this.viewY);
            }
            return;
        }


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
                this.updateBuildingMapDB().then(/* If something needs to happen after the update */);
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


    /**
     * Handles the right-click input of the user. When right-clicking a building a pop-up needs to be opened.
     * @param client_x the x screen pixel
     * @param client_y the y screen pixel
     * @returns {boolean} returns true if the click is used, false if not
     */
    handleRightClick(client_x, client_y) {
        let tileX = Math.floor(client_x/this.tileSize) + this.viewX;
        let tileY = Math.floor(client_y/this.tileSize) + this.viewY;

        if (this.tiles[tileY][tileX] !== EMPTY_TILE) {
            console.log(`Right click op building layer, tile x: ${tileX}, y: ${tileY} --> ${this.tiles[tileY][tileX][1]}`);
            const buildingName = this.tiles[tileY][tileX][1];
            openPopup(this.buildingInformation, this.buildingGeneralInformation, buildingName);
            return true;
        }
        return false;

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
     * @returns {Promise<void>}
     */
    async updateBuildingMapDB() {
        const BASE_URL = `${window.location.protocol}//${window.location.host}`;
        const fetchLink = BASE_URL + "/game/update-building-map";
        const mapDataJson = this.toJSON(); // Serialize the map data to JSON
        console.log('BuildingMap DB ', mapDataJson);
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