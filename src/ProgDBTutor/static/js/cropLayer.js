import { BaseMap } from "./baseMap.js";
//import { openPopup, closePopup, isPopupOpen } from "./buildingPopup.js";
import { utils } from "./utils.js";

/**
 * Sets the string value of
 */
const EMPTY_TILE = "None";

/** Tile coördinaten: (y,x)
 0 1 2 3 | x
 1
 2
 3
 —
 y
 */

const defaultCropData = {
    /*
    3 fases: plantable, growth-phase, harvestable

    */


}


export class CropMap extends BaseMap {
    /**
     * @param mapData This is set to a default version of the map, if database fetch succeeds this will be overridden.
     * @param _tileSize The tile size to be displayed on screen.
     * @param _ctx context needed for drawing on-screen.
     */
    constructor(mapData = defaultCropData, _tileSize, _ctx) {
        super(mapData, _tileSize);

        this.cropInformation = mapData.crop_information;
        this.buildingGeneralInformation = mapData.building_general_information
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

    /**
     * Initialises the building layer. Fetches everything that needs to be fetched from the server, and stores it.
     */
    async initialize() {
        await this.fetchBuildingAssetList();
        //await this.fetchBuildingMapData();
        this.tiles = this.generateBuildingTileMap();
        await new Promise((resolve) => this.preloadBuildingAssets(resolve));
        // Safe to call stuff here
        console.log("debug");
    }


    /**
     * Fetches the 'assetList.json' which is used to later fetch the right assets.
     */
    async fetchBuildingAssetList() {
        try {
            const response = await fetch('/static/img/assets/assetList2.json');
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
        const fetchLink = BASE_URL + "/game/fetch-building-information";
        try {
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
     * Draws a building.
     * @param building a building object of 'this.buildingInformation'
     */
    /*
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

            const img = this.buildingAssets["/static/img/assets/buildings/" + utils.getAssetDir(tile[1]) + "/" + tile[1] + ".png"];
            if (img) {
                this.ctx.drawImage(img, screen_currTileLocX * this.tileSize, screen_currTileLocY * this.tileSize, this.tileSize, this.tileSize);
            } else {
                console.error("BuildingMap.drawTiles(): image does not exist")
            }
        }
    }
    */

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