// todo documentatie updaten

import {BaseMap} from "./baseMap.js";
//import { openPopup, closePopup, isPopupOpen } from "./buildingPopup.js";
import { utils } from "./utils.js";
import { buildingMap } from "./canvas.js";

/**
 * Sets the string value of
 */
//const EMPTY_TILE = "None";

/** Tile coördinaten: (y,x)
 0 1 2 3 | x
 1
 2
 3
 —
 y
 */

const defaultCropData = {
    map_width: 58,
    map_height: 43,
    // 3 phases: empty (1), growth (2), harvest (3)
    crop_information: {
        field1: {
            building_name: "field1", // to link to the field building
            phase: 2, // growth phase
            crop: "Wheat", // can be null
            assetPhase: 3, // asset phases 1-4. Set's the correct growth phase of the asset
            time_planted: 43516688, // time in seconds since random day (can be null)
        },
        field2: {
            building_name: "field2", // to link to the field building
            phase: 1, // empty phase
            crop: null, // can be null
            assetPhase: null,
            time_planted: null, // can be null
        },
        field3: {
            building_name: "field3",
            phase: 3,
            crop: "Carrot",
            assetPhase: 4,
            time_planted: 43516688
        }
    }
}


export class CropMap extends BaseMap {
    /**
     * @param cropData This is set to a default version of the map, if database fetch succeeds this will be overridden.
     * @param _tileSize The tile size to be displayed on screen.
     * @param _ctx context needed for drawing on-screen.
     */
    constructor(cropData = defaultCropData, _tileSize, _ctx) {
        super(cropData, _tileSize);

        this.cropInformation = cropData.crop_information;
        this.ctx = _ctx;

        this.cropAssetList = {}; // Bevat de json van alle asset file names die ingeladen moeten worden
        this.cropAssets = {}; // Bevat {"pad_naar_asset": imageObject}

        this.buildingMapInstace = null;
    }

    /**
     * Initialises the building layer. Fetches everything that needs to be fetched from the server, and stores it.
     */
    async initialize() {
        await this.fetchCropAssetList();
        //await this.fetchCropMapData();
        await new Promise((resolve) => this.preloadCropAssets(resolve));
        // Safe to call stuff here
        console.log("debug");
    }

    addBuildingMapInstance(buildingMapInstance) {
        this.buildingMapInstace = buildingMapInstance;
    }


    /**
     * Fetches the 'assetList.json' which is used to later fetch the right assets.
     */
    async fetchCropAssetList() {
        try {
            const response = await fetch('/static/img/assets/assetList.json');
            const responseJson = await response.json();
            this.cropAssetList = responseJson.crops;
        } catch (error) {
            debugger;
            console.error('fetchCropAssetList() failed:', error);
            throw error;
        }
        console.log("fetchCropAssetList() success, cropAssetList: ", this.buildingAssetList);
    }

    /**
     * Fetches the buildingMapData json which stores the layout and other information needed.
     */
    async fetchCropMapData() {
        const BASE_URL = `${window.location.protocol}//${window.location.host}`;
        const fetchLink = BASE_URL + "/game/fetch-crop-information";
        try {
            const response = await fetch(fetchLink);
            const mapData = await response.json();

            if ("crop_information" in mapData) {
                this.cropInformation = mapData.crop_information;
            } else {
            // No crops found
                await this.updateCropMapDB();
                console.log("No buildings found.");

            }
            // Resetting view coordinates
            this.viewX = 0;
            this.viewY = 0;
        } catch(error) {
            console.error('fetchCropMapData() failed:', error);
            throw error;
        }

        console.log("fetchCropMapData() success");
    }

    /**
     * Preloads the assets from the server and stores it in 'this.buildingAssets'.
     * 'callback' function is called when the function is done fetching.
     */
    preloadCropAssets(callback) {
        let assetMap = {};
        let assetList = this.cropAssetList;
        let totalCount = 0;
        let loadedCount = 0;

        for (const cropType in assetList) {
            totalCount += assetList[cropType].length;
            assetList[cropType].forEach(asset => {
                const currPath = "/static/img/assets/crops/" + cropType + "/" + asset + ".png";
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

    getSecondsSinceDay0() {
        let startDate = new Date(2023, 0, 1); // months are 0-indexed
        let currentDate = new Date();
        let differenceInMilliseconds = currentDate - startDate;
        return Math.floor(differenceInMilliseconds / 1000);
    }


    /**
     * Clears a specific tile relative to the screen (not the buildingMap)
     * @param x_tile_screen
     * @param y_tile_screen
     */
    clearTile(x_tile_screen, y_tile_screen) {
        this.ctx.clearRect(x_tile_screen, y_tile_screen, this.tileSize, this.tileSize);
    }


    drawOneCrop(field) {
        const windowTileHeight = Math.ceil(window.innerHeight / this.tileSize);
        const windowTileWidth = Math.ceil(window.innerWidth / this.tileSize);

        const buildingInformation = this.buildingMapInstace.buildingInformation;

        const linkedBuilding = buildingInformation[field.building_name];
        const screen_buildLocationY = linkedBuilding.building_location[0] - this.viewY;
        const screen_buildLocationX = linkedBuilding.building_location[1] - this.viewX;

        // Calculate coordinates to place crops
        const cropY = screen_buildLocationY + 1;
        const cropX = screen_buildLocationX + 1;

        const cropCoords = [[cropY, cropX], [cropY + 1, cropX], [cropY, cropX + 1], [cropY + 1, cropX + 1]];

        // Draw crops
        for (let index in cropCoords) {
            
        }

        /*
        for (const tile of linkedBuilding.tile_rel_locations) {
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

         */
    }

    /**
     * Draws the crops on top of the fields.
     */
    drawCrops() {
        this.ctx.clearRect(0,0, window.innerWidth, window.innerHeight);
        for (const cropKey in this.cropInformation) {
            if (!Object.hasOwnProperty.call(this.cropInformation, cropKey)) {
                continue;
            }
            const currCrop = this.cropInformation[cropKey];

            this.drawOneCrop(currCrop);
        }
    }


    /**
     * Gets called by the Tick class with regular time intervals.
     */
    tick() {
        //console.log("building layer tick");
    }


    /**
     * converts js object to json
     * @returns {string} the json
     */
    toJSON() {
        return JSON.stringify({
            map_width: this.map_width,
            map_height: this.map_height,
            crop_information: this.cropInformation
        });
    }

    /**
     * Sends the building map to the database to be updated.
     * @returns {Promise<void>}
     */
    async updateCropMapDB() {
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