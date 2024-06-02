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
        field1: { // moet dezelfde naam hebben als 'building_name'
            building_name: "field1", // to link to the field building
            phase: 1, // growth phase
            crop: null, // can be null
            assetPhase: null, // asset phases 1-4. Set's the correct growth phase of the asset
            time_planted: null, // time in seconds since random day (can be null)
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
            phase: 1,
            crop: null,
            assetPhase: null,
            time_planted: null
        }
    },
    crop_general_information: {
        Wheat: {
            growth_time: 30
        },
        Carrot: {
            growth_time: 30
        },
        Corn: {
            growth_time: 30
        },
        Lettuce: {
            growth_time: 30
        },
        Tomato: {
            growth_time: 30
        },
        Turnip: {
            growth_time: 30
        },
        Zucchini: {
            growth_time: 30
        },
        Parsnip: {
            growth_time: 30
        },
        Cauliflower: {
            growth_time: 30
        },
        Eggplant: {
            growth_time: 30
        },

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
        this.cropGeneralInformation = cropData.crop_general_information;
        this.ctx = _ctx;

        this.cropAssetList = {}; // Bevat de json van alle asset file names die ingeladen moeten worden
        this.cropAssets = {}; // Bevat {"pad_naar_asset": imageObject}

        this.buildingMapInstace = null;

        this.tickCount = 0;
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
            } else {
            // No crops found
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

    isFieldEmpty(fieldName) {
        const phase = this.cropInformation[fieldName].phase;
        return phase === 1;
    }

    isHarvestable(fieldName) {
        const phase = this.cropInformation[fieldName].phase;
        return phase === 3;
    }

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

        updateResources(cropName, amount);
    }



    plantCrop(cropType, fieldName) {
        const field = this.cropInformation[fieldName];
        field.phase = 2;
        field.crop = cropType;
        field.assetPhase = 1;
        field.time_planted = this.getSecondsSinceDay0()
        this.updateCropMapDB();
        this.drawTiles();
    }

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

        const screen_buildLocationY = linkedBuilding.building_location[0] - this.viewY; // todo check of ' - this.viewY' klopt
        const screen_buildLocationX = linkedBuilding.building_location[1] - this.viewX;

        const assetName = field.crop + "." + field.assetPhase

        // Calculate coordinates to place crops
        const screen_cropY = screen_buildLocationY;
        const screen_cropX = screen_buildLocationX;

        const offset = 1;
        const cropCoords = [[screen_cropY, screen_cropX], [screen_cropY + offset, screen_cropX], [screen_cropY, screen_cropX + offset], [screen_cropY + offset, screen_cropX + offset]];

        // Draw crops
        for (let cropCoord of cropCoords) {
            // todo checken de image binnen het canvas is

            const img = this.buildingAssets["/static/img/assets/crops/" + utils.getAssetDir(assetName) + "/" + assetName + ".png"];
            if (img) {
                // todo de exacte plant locatie een beetje meer random maken
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
     * Draws the crops on top of the fields.
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
     * Sends the building map to the database to be updated.
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
 * @param resource, name as string
 * @param count, increase or decreas amount
 * @returns {Promise<void>}
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