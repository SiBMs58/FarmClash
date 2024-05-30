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
            general_information: "Fence", // Link to the general information of this building type
            level: 4, // Building level (set "None" if not relevant)
            building_location: [8, 8] // --> [y (height), x (width)], this needs to be the top-left corner of the building
        },
        fence2: {
            self_key: "fence2",
            general_information: "Fence",
            level: 3,
            building_location: [8, 9]
        },
        fence3: {
            self_key: "fence3",
            general_information: "Fence",
            level: 2,
            building_location: [8, 10]
        },
        chicken_coop: {
            self_key: "chicken_coop",
            general_information: "Chicken_house",
            level: 3,
            building_location: [5, 11]
        },

        field1: {
            self_key: "field1",
            general_information: "Field",
            level: 1,
            building_location: [10, 8]
        },
        field2: {
            self_key: "field2",
            general_information: "Field",
            level: 1,
            building_location: [10, 12]
        },
        field3: {
            self_key: "field3",
            general_information: "Field",
            level: 1,
            building_location: [10, 16]
        },

        Cowbarn: {
            self_key: "Cowbarn",
            general_information: "Cowbarn",
            level: 10,
            building_location: [10, 24]
        },
        Goatbarn: {
            self_key: "Goatbarn",
            general_information: "Goatbarn",
            level: 10,
            building_location: [15, 24]
        },
        Bay: {
            self_key: "Bay",
            general_information: "Bay",
            level: 10,
            building_location: [15, 3]
        },
        Pigpen: {
            self_key: "Pigpen",
            general_information: "Pigpen",
            level: 10,
            building_location: [5, 3]
        },
        Silo: {
            self_key: "Silo",
            general_information: "Silo",
            level: 10,
            building_location: [5, 3]
        }
    },


    building_general_information: {
        Chicken_house: {
            display_name: "Chicken House", // Name to be displayed in the popup
            explanation: "Dive into the heart of your farm's egg production with the Chicken House. " +
                "This vital building is where your feathered friends lay eggs, ready for " +
                "market sale. Upgrade to boost production. Every egg sold brings you one " +
                "step closer to agricultural dominance.",
            upgrade_costs: [500, 1000, 2000, 3500, 5000, 7000], // All costs per level starting from level 2 (in this case level1 -> level2 costs 500 coins)
            other_stats: [["Eggs/hour", [1, 2, 3, 4, 5, 6, 7]], ["Defence", [50, 100, 150, 200, 400, 470, 550]]], // All other stats specific for this building. ["Stat name display", [array of all values per level]]
            maxLevel: 10,
            tile_rel_locations: [
                [[0, 0], "Chickencoop.L@.1.1"], // location relative to 'building_location'
                [[0, 1], "Chickencoop.L@.1.2"], // [ rel_location ([y, x]), "Tile asset"]
                [[1, 0], "Chickencoop.L@.2.1"], // All the '@' will be replaced with the correct level
                [[1, 1], "Chickencoop.L@.2.2"],
                [[2, 0], "Chickencoop.3.1"],
                [[2, 1], "Chickencoop.3.2"],
            ]
        },
        Pigpen: {
            display_name: "Pigpen", // Name to be displayed in the popup
            explanation: "Dive into the heart of your farm's egg production with the Chicken House. " +
                "This vital building is where your feathered friends lay eggs, ready for " +
                "market sale. Upgrade to boost production. Every egg sold brings you one " +
                "step closer to agricultural dominance.",
            upgrade_costs: [500, 1000, 2000, 3500, 5000, 7000], // All costs per level starting from level 2 (in this case level1 -> level2 costs 500 coins)
            other_stats: [["Eggs/hour", [1, 2, 3, 4, 5, 6, 7]], ["Defence", [50, 100, 150, 200, 400, 470, 550]]], // All other stats specific for this building. ["Stat name display", [array of all values per level]]
            maxLevel: 10,
            tile_rel_locations: [
                [[0, 0], "Pigpen.L@.1.1"], // location relative to 'building_location'
                [[0, 1], "Pigpen.L@.1.2"], // [ rel_location ([y, x]), "Tile asset"]
                [[0, 2], "Pigpen.L@.1.3"],
                [[1, 0], "Pigpen.L@.2.1"], // All the '@' will be replaced with the correct level
                [[1, 1], "Pigpen.2.2"],
                [[1, 2], "Pigpen.L@.2.3"],
                [[2, 0], "Pigpen.3.1"],
                [[2, 1], "Pigpen.3.2"],
                [[2, 2], "Pigpen.3.3"]
            ]
        },
        Cowbarn: {
            display_name: "Cowbarn", // Name to be displayed in the popup
            explanation: "Dive into the heart of your farm's egg production with the Chicken House. " +
                "This vital building is where your feathered friends lay eggs, ready for " +
                "market sale. Upgrade to boost production. Every egg sold brings you one " +
                "step closer to agricultural dominance.",
            upgrade_costs: [500, 1000, 2000, 3500, 5000, 7000], // All costs per level starting from level 2 (in this case level1 -> level2 costs 500 coins)
            other_stats: [["Eggs/hour", [1, 2, 3, 4, 5, 6, 7]], ["Defence", [50, 100, 150, 200, 400, 470, 550]]], // All other stats specific for this building. ["Stat name display", [array of all values per level]]
            maxLevel: 10,
            tile_rel_locations: [
                [[0, 0], "Cowbarn.L@.1.1"], // location relative to 'building_location'
                [[0, 1], "Cowbarn.L@.1.2"], // [ rel_location ([y, x]), "Tile asset"]
                [[0, 2], "Cowbarn.L@.1.3"], // All the '@' will be replaced with the correct level
                [[1, 0], "Cowbarn.L@.2.1"],
                [[1, 1], "Cowbarn.2.2"],
                [[1, 2], "Cowbarn.L@.2.3"],
                [[2, 0], "Cowbarn.3.1"],
                [[2, 1], "Cowbarn.3.2"],
                [[2, 2], "Cowbarn.3.3"]
            ]
        },
        Goatbarn: {
            display_name: "Goat barn", // Name to be displayed in the popup
            explanation: "Dive into the heart of your farm's egg production with the Chicken House. " +
                "This vital building is where your feathered friends lay eggs, ready for " +
                "market sale. Upgrade to boost production. Every egg sold brings you one " +
                "step closer to agricultural dominance.",
            upgrade_costs: [500, 1000, 2000, 3500, 5000, 7000], // All costs per level starting from level 2 (in this case level1 -> level2 costs 500 coins)
            other_stats: [["Eggs/hour", [1, 2, 3, 4, 5, 6, 7]], ["Defence", [50, 100, 150, 200, 400, 470, 550]]], // All other stats specific for this building. ["Stat name display", [array of all values per level]]
            maxLevel: 10,
            tile_rel_locations: [
                [[0, 0], "Goatbarn.L@.1.1"], // location relative to 'building_location'
                [[0, 1], "Goatbarn.L10.1.2"], // [ rel_location ([y, x]), "Tile asset"]
                [[0, 2], "Goatbarn.L@.1.3"], // All the '@' will be replaced with the correct level
                [[1, 0], "Goatbarn.L@.2.1"],
                [[1, 1], "Goatbarn.2.2"],
                [[1, 2], "Goatbarn.L@.2.3"],
                [[2, 0], "Goatbarn.3.1"],
                [[2, 1], "Goatbarn.3.2"],
                [[2, 2], "Goatbarn.3.3"]
            ]
        },

        Townhall: {
            display_name: "Townhall", // Name to be displayed in the popup
            explanation: "This is the Townhall",
            upgrade_costs: [500, 1000, 2000, 3500, 5000, 7000], // All costs per level starting from level 2 (in this case level1 -> level2 costs 500 coins)
            other_stats: [["Defence", [50, 100, 150, 200, 400, 470, 550]]], // All other stats specific for this building. ["Stat name display", [array of all values per level]]
            maxLevel: 10,
            tile_rel_locations: [
                [[0, 0], "Townhall.L@.1.1"],
                [[0, 1], "Townhall.L@.1.2"],
                [[0, 2], "Townhall.L@.1.3"],
                [[0, 3], "Townhall.1.4"],
                [[1, 0], "Townhall.L@.2.1"],
                [[1, 1], "Townhall.L@.2.2"],
                [[1, 2], "Townhall.L@.2.3"],
                [[1, 3], "Townhall.L@.2.4"],
                [[2, 0], "Townhall.L@.3.1"],
                [[2, 1], "Townhall.L@.3.2"],
                [[2, 2], "Townhall.L@.3.3"],
                [[2, 3], "Townhall.L@.3.4"],
                [[3, 0], 'Townhall.4.1'],
                [[3, 1], 'Townhall.4.2'],
                [[3, 2], 'Townhall.4.3'],
                [[3, 3], 'Townhall.4.4'],
                [[4, 0], 'Townhall.5.1'],
                [[4, 1], 'Townhall.5.2'],
                [[4, 2], 'Townhall.5.3'],
                [[4, 3], 'Townhall.5.4']
            ]
        },
        Fence: {
            display_name: "Fence",
            explanation: "Strategically place your fences in order to defend you farm from intruders as effectively as possible.",
            upgrade_costs: [500, 1000, 2000, 3500],
            other_stats: [["Defence", [50, 100, 150, 200, 400]]],
            maxLevel: 10,
            tile_rel_locations: [
                [[0, 0], "Fence.L@"], // This will be replaced with the correct type of fence according to its neighbours.
            ]
        },/*
        Field: {
            display_name: "Field",
            explanation: "This is a field.\nSelect a crop",
            upgrade_costs: [500, 1000, 2000, 3500],
            other_stats: [["Defence", [50, 100, 150, 200, 400]]],
            maxLevel: 10,
            tile_rel_locations: [
                [[0,0], "Field2.TL"],
                [[0,1], "Field2.T"],
                [[0,2], "Field2.T"],
                [[0,3], "Field2.TR"],

                [[1,0], "Field2.L"],
                [[1,1], "Field2.M"],
                [[1,2], "Field2.M"],
                [[1,3], "Field2.R"],

                [[2,0], "Field2.L"],
                [[2,1], "Field2.M"],
                [[2,2], "Field2.M"],
                [[2,3], "Field2.R"],

                [[3,0], "Field2.BL"],
                [[3,1], "Field2.B"],
                [[3,2], "Field2.B"],
                [[3,3], "Field2.BR"],
            ]
        },*/
        Field: {
            display_name: "Field",
            explanation: "This is a field.",
            upgrade_costs: [500, 1000, 2000, 3500],
            other_stats: [["Defence", [50, 100, 150, 200, 400]]],
            maxLevel: 10,
            tile_rel_locations: [
                [[0,0], "Field3.TL"],
                [[0,1], "Field3.TR"],
                [[1,0], "Field3.BL"],
                [[1,1], "Field3.BR"],
            ]
        },
        Barn: {
            display_name: "Barn",
            explanation: "This is a barn.",
            upgrade_costs: [500, 1000, 2000, 3500],
            other_stats: [["Defence", [50, 100, 150, 200, 400]]],
            maxLevel: 10,
            tile_rel_locations: [
                [[0,0],"Barn.L@.1.1"],
                [[1,0],"Barn.L@.2.1"],
                [[2,0],"Barn.3.1"],
                [[0,1],"Barn.L@.1.2"],
                [[1,1],"Barn.2.2"],
                [[2,1],"Barn.3.2"],
                [[0,2],"Barn.L@.1.3"],
                [[1,2],"Barn.L@.2.3"],
                [[2,2],"Barn.3.3"]
            ]
        },
        Bay: {
            display_name: "Bay",
            explanation: "This is a bay.",
            upgrade_costs: [500, 1000, 2000, 3500],
            other_stats: [["Defence", [50, 100, 150, 200, 400]]],
            maxLevel: 10,
            tile_rel_locations: [
                [[1,0],"Bay.L@.2.1.F1"],
                [[2,0],"Bay.L@.3.1.F1"],
                [[3,0],"Bay.L@.4.1.F1"],
                [[1,1],"Bay.L@.2.2.F1"],
                [[2,1],"Bay.L@.3.2.F1"],
                [[3,1],"Bay.L@.4.2.F1"],
                [[4,1],"Bay.L@.5.2.F1"],
                [[1,2],"Bay.L@.2.3.F1"],
                [[2,2],"Bay.L@.3.3.F1"],
                [[3,2],"Bay.L@.4.3.F1"],
                [[0,3],"Bay.L@.1.4"],
                [[1,3],"Bay.L@.2.4"],
                [[2,3],"Bay.L@.3.4"],
                [[3,3],"Bay.L@.4.4"],
                [[4,3],"Bay.L@.5.4"],
                [[0,4],"Bay.L@.1.5"],
                [[1,4],"Bay.L@.2.5"],
                [[2,4],"Bay.L@.3.5"],
                [[3,4],"Bay.L@.4.5"],
                [[4,4],"Bay.L@.5.5"],
                [[0,5],"Bay.L@.1.6"],
                [[1,5],"Bay.L@.2.6"],
                [[2,5],"Bay.L@.3.6"],
                [[3,5],"Bay.L@.4.6"],
                [[4,5],"Bay.L@.5.6"]
            ],
        },
        Silo: {
            display_name: "Silo",
            explanation: "This is a silo.",
            upgrade_costs: [500, 1000, 2000, 3500],
            other_stats: [["Defence", [50, 100, 150, 200, 400]]],
            maxLevel: 10,
            tile_rel_locations: [
                [[0,0],"Silo.L@.1.1"],
                [[1,0],"Silo.0%.2.1"],
                [[2,0],"Silo.0%.3.1"],
                [[3,0],"Silo.0%.4.1"],
                [[4,0],"Silo.0%.5.1"],
                [[0,1],"Silo.L@.1.2"],
                [[1,1],"Silo.0%.2.2"],
                [[2,1],"Silo.0%.3.2"],
                [[3,1],"Silo.0%.4.2"],
                [[4,1],"Silo.0%.5.2"],
                [[0,2],"Silo.L@.1.3"],
                [[1,2],"Silo.0%.2.3"],
                [[2,2],"Silo.0%.3.3"],
                [[3,2],"Silo.0%.4.3"],
                [[4,2],"Silo.0%.5.3"]
            ]
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
     * @param cropMapInstance This is en instance that is needed in order to call the drawTiles function when a building moves
     * @param uiLayerInstance This instance is needed to draw the correct building UI.
     * @param username The username of the player. Used to fetch the right map data.
     */
    constructor(mapData = defaultMapData2, _tileSize, _ctx, terrainMapInstance, cropMapInstance, uiLayerInstance, username) {

        super(mapData, _tileSize, username);

        this.buildingInformation = mapData.building_information;
        this.buildingGeneralInformation = mapData.building_general_information
        this.tiles = this.generateBuildingTileMap();
        this.ctx = _ctx;

        this.buildingAssetList = {}; // Bevat de json van alle asset file names die ingeladen moeten worden
        this.buildingAssets = {}; // Bevat {"pad_naar_asset": imageObject}

        this.terrainMapInstance = terrainMapInstance;
        this.cropMapInstance = cropMapInstance;
        this.uiLayerInstance = uiLayerInstance;

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
        await this.fetchBuildingMapData();
        this.tiles = this.generateBuildingTileMap();
        await new Promise((resolve) => this.preloadBuildingAssets(resolve));
        console.log("fetchBuildingLayerList() success"); // Don't remove this
        localStorage.setItem('gameData', 'true');
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

            const generalInfoKey = currBuilding.general_information
            const tile_rel_locations = this.buildingGeneralInformation[generalInfoKey].tile_rel_locations
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
            console.error('fetchBuildingAssetList() failed:', error);
            throw error;
        }

        console.log("fetchBuildingAssetList() success");
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
                //console.log("fetchBuildingMapData() success, BuildingMapData: ", this.buildingInformation);
                //console.log("fetchBuildingMapData() success, BuildingMapData: ", this.buildingGeneralInformation);
                this.buildingInformation = mapData.building_information;
                //console.log("fetchBuildingMapData() success, BuildingMapData: ", this.buildingInformation);
                //console.log("fetchBuildingMapData() success, BuildingMapData: ", this.buildingGeneralInformation);
                //console.log("fetchBuildingMapData() success, BuildingMapData: ", this.tiles);
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

    adjustFenceAsset(originalAssetName, yLocation, xLocation) {
        debugger;
        const splitAssetName = originalAssetName.split('.')
        let baseAssetName = splitAssetName[0] + '.' + splitAssetName[1] + '.';

        const assetN = this.tiles[yLocation - 1][xLocation] === "None" ? "None" : this.tiles[yLocation - 1][xLocation][0];
        const assetO = this.tiles[yLocation][xLocation + 1] === "None" ? "None" : this.tiles[yLocation][xLocation + 1][0];
        const assetZ = this.tiles[yLocation + 1][xLocation] === "None" ? "None" : this.tiles[yLocation + 1][xLocation][0];
        const assetW = this.tiles[yLocation][xLocation - 1] === "None" ? "None" : this.tiles[yLocation][xLocation - 1][0];

        let appendedDirection = false;
        if (utils.getAssetDir(assetN) === "Fence") {
            baseAssetName += "N";
            appendedDirection = true;
        }
        if (utils.getAssetDir(assetO) === "Fence") {
            baseAssetName += "O";
            appendedDirection = true;
        }
        if (utils.getAssetDir(assetZ) === "Fence") {
            baseAssetName += "Z";
            appendedDirection = true;
        }
        if (utils.getAssetDir(assetW) === "Fence") {
            baseAssetName += "W";
            appendedDirection = true;
        }

        if (!appendedDirection) {
            baseAssetName = baseAssetName.slice(0, -1);
        }
        return baseAssetName;
    }


    /**
     * Draws a building.
     * @param building a building object of 'this.buildingInformation'
     */
    drawBuilding(building) {
        const windowTileHeight = Math.ceil(window.innerHeight / this.tileSize);
        const windowTileWidth = Math.ceil(window.innerWidth / this.tileSize);
        const screen_buildLocationY = building.building_location[0] - this.viewY;
        const screen_buildLocationX = building.building_location[1] - this.viewX;

        const generalInfoKey = building.general_information;
        const tile_rel_locations = this.buildingGeneralInformation[generalInfoKey].tile_rel_locations;

        for (const tile of tile_rel_locations) {
            const screen_currTileLocY = screen_buildLocationY + tile[0][0];
            const screen_currTileLocX = screen_buildLocationX + tile[0][1];

            if (screen_currTileLocY > windowTileHeight || screen_currTileLocX > windowTileWidth) {
                continue;
            }

            let tileToDrawWithoutLevelReplaced = tile[1];
            const buildingLevel = building.level
            let tileToDrawName = tileToDrawWithoutLevelReplaced.replace(/@/g, buildingLevel);
            if (utils.getAssetDir(tileToDrawName) === "Fence") {
                const currTileLocY = building.building_location[0] + tile[0][0];
                const currTileLocX = building.building_location[1] + tile[0][1];
                tileToDrawName = this.adjustFenceAsset(tileToDrawName, currTileLocY, currTileLocX)
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
        this.terrainMapInstance.drawTiles();
        this.cropMapInstance.drawTiles();
    }

    /**
     * Gets called by the Tick class with regular time intervals.
     */
    tick() {
        //console.log("building layer tick");
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
            const generalInfoKey = building.general_information;
            const tile_rel_locations = this.buildingGeneralInformation[generalInfoKey].tile_rel_locations;
            for (const currTile of tile_rel_locations) {
            //for (const currTile of building.tile_rel_locations) {
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
        //for (const currTile of buildingToMove.tile_rel_locations) {
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
            if (terrainType === "Water" || this.isEdgeTile(correspondingTerrainTile)) {
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
            const buildingName = this.tiles[tileY][tileX][1];
            this.buildingClickedName = buildingName;

            // Check whether building is a harvestable field
            if (this.buildingInformation[buildingName].general_information === "Field") {
                const fieldName = this.buildingClickedName
                if (this.cropMapInstance.isHarvestable(fieldName)) {
                    const fieldLevel = this.buildingInformation[buildingName].level
                    this.cropMapInstance.harvestField(fieldName, fieldLevel);
                    return true; // moet gebeuren
                }
            }

            // TODO: (Siebe) check of friend aan het bezoeken
            // Ge moet hier true returnen omdat er op een gebouw is geklikt. De twee lijnen hier onder mogen gewoon niet gebeuren (zie hierboven als voorbeeld)
             // If the username is set it means you are visitiing someone else's farm meaning you can't move buildings
            if (!this.username) {
                this.movingBuilding = true;
                this.ownNextClick = true;
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