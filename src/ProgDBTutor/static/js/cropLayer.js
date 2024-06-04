import {BaseMap} from "./baseMap.js";
import { utils } from "./utils.js";
import { defaultCropData } from "./Data/defaultCropData.js";


/** Tile coördinaten: (y,x)
 0 1 2 3 | x
 1
 2
 3
 —
 y
 */

/**
 * This class is responsible for the crop layer of the game. It fetches the crop data from the server, and stores it.
 * It is also responsible for drawing the crops on the screen.
 */
export class CropMap extends BaseMap {
    /**
     * @param cropData This is set to a default version of the map, if database fetch succeeds this will be overridden.
     * @param _tileSize The tile size to be displayed on screen.
     * @param _ctx context needed for drawing on-screen.
     */
    constructor(cropData = defaultCropData, _tileSize, _ctx) {
        super(cropData, _tileSize);

        this.cropInformation = cropData.crop_information; // Contains all the crop information.
        this.cropGeneralInformation = cropData.crop_general_information; // Contains all the crop general information.
        this.ctx = _ctx; // The context needed for drawing on-screen.

        this.cropAssetList = {}; // Contains json for all assets that need to be loaded.
        this.cropAssets = {}; // contains {"path_to_asset": imageObject}

        this.buildingMapInstace = null; // Reference to the buildingMapInstance

        this.tickCount = 0; // Used to keep track of the number of ticks.
    }

    /**
     * Initialises the building layer. Fetches everything that needs to be fetched from the server, and stores it.
     */
    async initialize() {
        await this.fetchCropAssetList();
        await this.fetchCropMapData();
        await new Promise((resolve) => this.preloadCropAssets(resolve));
        // Safe to call stuff here
        console.log("debug");
    }

    /**
     * Adds the buildingMapInstance to the cropMapInstance. Used in initializing of the game.
     * @param buildingMapInstance - The buildingMapInstance to be added.
     */
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
        const fetchLink = BASE_URL + "/api/fetch-crop-information";
        try {
            const response = await fetch(fetchLink);
            const mapData = await response.json();

            if (Object.keys(mapData.crop_information).length !== 0) {
                this.cropInformation = mapData.crop_information;
                console.log("fields found.");
            } else { // No crops found
                await this.updateCropMapDB();
                this.cropInformation = defaultCropData.crop_information;
                console.log("no fields found.");

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
     * Preloads the assets from the server and stores it in 'this.cropAssets'.
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
                        this.cropAssets = assetMap;
                        callback(); // If all images are loaded -> callback
                    }
                };
                img.onerror = () => {
                    console.error(`Failed to load image at path: ${currPath}`);
                    loadedCount++; // Increment the counter to ensure the callback is called even if some images fail to load.
                    if (loadedCount === totalCount) {
                        this.cropAssets = assetMap;
                        callback(); // Still call the callback, but note that some images may not have loaded.
                    }
                };
            });
        }
    }

    /**
     * This gives an amount of seconds since a randomly chosen day 0 that is used as a reference point.
     * @returns {number} - The amount of seconds since day 0.
     */
    getSecondsSinceDay0() {
        let startDate = new Date(2023, 0, 1); // months are 0-indexed
        let currentDate = new Date();
        let differenceInMilliseconds = currentDate - startDate;
        return Math.floor(differenceInMilliseconds / 1000);
    }

    /**
     * Checks if a field is empty. (has no crops on it)
     * @param fieldName - The name of the field to be checked.
     * @returns {boolean} - True if the field is empty, false otherwise.
     */
    isFieldEmpty(fieldName) {
        const phase = this.cropInformation[fieldName].phase;
        return phase === 1;
    }

    /**
     * Checks if a field is harvestable. (has crops that are ready to be harvested)
     * @param fieldName - The name of the field to be checked.
     * @returns {boolean} - True if the field is harvestable, false otherwise.
     */
    isHarvestable(fieldName) {
        const phase = this.cropInformation[fieldName].phase;
        return phase === 3;
    }

    /**
     * Harvests a field. This means that the crops are removed from the field and the player receives the crops.
     * @param fieldName - The name of the field to be harvested.
     * @param fieldLevel - The level of the field. --> Decides how man crops the player receives.
     */
    harvestField(fieldName, fieldLevel) {
        const field = this.cropInformation[fieldName];
        let cropName = field.crop;
        let amount = fieldLevel*4;
        field.phase = 1;
        field.crop = null;
        field.assetPhase = null;
        field.time_planted =  null;
        this.updateCropMapDB();
        this.drawTiles();
        this.buildingMapInstace.drawTiles();

        updateResources(cropName, amount);
    }


    /**
     * Plants a crop on a field. This means that the field is no longer empty and the crop is planted.
     * @param cropType - The type of crop to be planted. (e.g. "Wheat")
     * @param fieldName - The name of the field to be planted on.
     */
    plantCrop(cropType, fieldName) {
        const field = this.cropInformation[fieldName];
        field.phase = 2;
        field.crop = cropType;
        field.assetPhase = 1;
        field.time_planted = this.getSecondsSinceDay0()
        this.updateCropMapDB();
        this.drawTiles();
    }

    /**
     * Checks if the crop tiles need to be updated. This is called continuously by the tick function.
     */
    checkCropGrowth() {
        for (let key in this.cropInformation) {
            const currField = this.cropInformation[key];
            if (currField.phase !== 2) {
                continue;
            }
            const cropType = currField.crop;
            const currTime = this.getSecondsSinceDay0();
            const deltaTime = currTime - currField.time_planted;
            const growthTime = this.cropGeneralInformation[cropType].growth_time;
            const timeFraction = deltaTime/growthTime;
            const prevAssetPhase = currField.assetPhase;
            if (timeFraction < 1/3) {
                currField.assetPhase = 1;
            } else if (timeFraction < 2/3 && timeFraction >= 1/3) {
                currField.assetPhase = 2;
            } else if (timeFraction < 1 && timeFraction >= 2/3) {
                currField.assetPhase = 3;
            } else if (timeFraction >= 1) {
                // Asset is ready
                currField.phase = 3;
                currField.assetPhase = 4;
            }
            if (prevAssetPhase !== currField.assetPhase) {
                this.drawTiles();
                this.buildingMapInstace.drawTiles();
            }
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
     * Draws a single crop for a field on the screen.
     * @param field - The field to draw the crop for.
     */
    drawOneCrop(field) {
        if (field.phase === 1) {
            return;
        }

        const windowTileHeight = Math.ceil(window.innerHeight / this.tileSize);
        const windowTileWidth = Math.ceil(window.innerWidth / this.tileSize);

        const buildingInformation = this.buildingMapInstace.buildingInformation;

        let linkedBuilding;
        if (field.building_name in buildingInformation) {
            linkedBuilding = buildingInformation[field.building_name];
        } else {
            console.error("There isn't a corresponding building for field: " + field.building_name);
            return;
        }

        const screen_buildLocationY = linkedBuilding.building_location[0] - this.viewY;
        const screen_buildLocationX = linkedBuilding.building_location[1] - this.viewX;

        const assetName = field.crop + "." + field.assetPhase

        // Calculate coordinates to place crops
        const screen_cropY = screen_buildLocationY;
        const screen_cropX = screen_buildLocationX;

        const offset = 1;
        const cropCoords = [[screen_cropY, screen_cropX], [screen_cropY + offset, screen_cropX], [screen_cropY, screen_cropX + offset], [screen_cropY + offset, screen_cropX + offset]];

        // Draw crops
        for (let cropCoord of cropCoords) {
            const img = this.cropAssets["/static/img/assets/crops/" + utils.getAssetDir(assetName) + "/" + assetName + ".png"];
            if (img) {
                if (field.crop === "Wheat") {
                    this.ctx.drawImage(img, cropCoord[1] * this.tileSize, (cropCoord[0] - 1 - 2/16) * this.tileSize, this.tileSize, this.tileSize * 2);
                } else {
                    this.ctx.drawImage(img, cropCoord[1] * this.tileSize, (cropCoord[0] - 2/16) * this.tileSize, this.tileSize, this.tileSize);
                }
            } else {
                console.error("BuildingMap.drawTiles(): image does not exist")
            }
        }
    }

    /**
     * Draws all the crops on top of the fields.
     */
    drawTiles() {
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
        this.tickCount += 1
        if (this.tickCount >= 5) {
            this.tickCount = 0;
            this.checkCropGrowth();
        }
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
     * Sends the crop map to the database to be updated.
     * @returns {Promise<void>}
     */
    async updateCropMapDB() {
        const BASE_URL = `${window.location.protocol}//${window.location.host}`;
        const fetchLink = BASE_URL + "/api/update-fields";
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


    /**
     * updates the resource to the db, is used when farming crops
     * @returns {Promise<void>} - The promise that is resolved when the fetch is done.
     * @param resource - The resource to be updated.
     * @param count - The amount to update the resource by.
     */
    async function updateResources(resource, count) {
        const resources = {
            [resource]: count // Use the resource as the key and the count as the value
        };
        const BASE_URL = `${window.location.protocol}//${window.location.host}`;
        const fetchLink = `${BASE_URL}/api/add-resources`;

        try {
            const response = await fetch(fetchLink, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(resources) // Send the serialized resource data as the request body
            });

            if (response.ok) {
                const jsonResponse = await response.json();
                console.log('Resources DB update successful:', jsonResponse);
            } else {
                console.error('Add-resources DB update failed with status:', response.status);
            }
        } catch (error) {
            console.error('Failed to update resources:', error);
        }
    }