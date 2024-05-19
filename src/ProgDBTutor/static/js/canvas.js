import { TerrainMap } from './terrainLayer.js'
import { BuildingMap } from "./buildingLayer.js";
import { CropMap } from "./cropLayer.js";
import { UICanvasLayer } from "./uiCanvasLayer.js";
import { generateRandomTerrainMap } from './developerFunctions.js'
import { UserInputHandler } from "./userInputHandler.js";
import { Ticker } from './ticker.js'

// Set on-screen tileSize-
// Function to safely get zoom size from local storage
function getZoomSize() {
    try {
        let zoomSize = localStorage.getItem('zoomSetting');
        if (zoomSize !== null) {
            let parsedZoomSize = parseInt(zoomSize);
            if (!isNaN(parsedZoomSize) && parsedZoomSize > 0) {
                return parsedZoomSize;
            }
        }
    } catch (e) {
        console.error('Error accessing local storage:', e);
    }
    return 50; // Default to 50 if value is not set or invalid
}

// Set on-screen tileSize, default to 50 if zoom size is not set
export let tileSize = getZoomSize();

// Create terrain map
const terrainCanvas = document.getElementById('terrainCanvas');
const terrainCtx = terrainCanvas.getContext('2d');
const mapData = generateRandomTerrainMap(50, 50);
let terrainMap;
if (window.friend) {
    // If friendData is available, use it in the constructor
    console.log("Friend data is available", window.friend);
    terrainMap = new TerrainMap(mapData, tileSize, terrainCtx, window.friend);
} else {
    // If friendData is not available, omit it from the constructor
    terrainMap = new TerrainMap(mapData, tileSize, terrainCtx);
}
console.log(terrainMap);

// Create UI canvas
const uiCanvas = document.getElementById('uiCanvas');
const uiCtx = uiCanvas.getContext('2d');
const uiCanvasLayer = new UICanvasLayer(tileSize, uiCtx);

// Create CropMap
const cropCanvas = document.getElementById('cropCanvas');
const cropCtx = cropCanvas.getContext('2d');
export const cropMap = new CropMap(undefined, tileSize, cropCtx);

// Create building map
const buildingCanvas = document.getElementById('buildingCanvas');
const buildingCtx = buildingCanvas.getContext('2d');
export let buildingMap;
if (window.friend) {
    // If friendData is available, use it in the constructor
    console.log("Friend data is available", window.friend);
    buildingMap = new BuildingMap(undefined, tileSize, buildingCtx, terrainMap, cropMap, uiCanvasLayer, window.friend);
} else {
    // If friendData is not available, omit it from the constructor
    buildingMap = new BuildingMap(undefined, tileSize, buildingCtx, terrainMap, cropMap, uiCanvasLayer);
}

// Add buildingMap instance to classes that need it
terrainMap.addBuildingMapInstance(buildingMap);
cropMap.addBuildingMapInstance(buildingMap);


// Create ticker
const ticker = new Ticker([terrainMap, buildingMap, cropMap]);

// Create userInputHandler
const userInputHandler = new UserInputHandler([buildingMap, terrainMap, cropMap]);


/**
 * Gets called everytime window dimensions change.
 */
function resizeCanvas() {
    terrainCanvas.width = window.innerWidth;
    terrainCanvas.height = window.innerHeight;
    terrainCtx.imageSmoothingEnabled = false;

    buildingCanvas.width = window.innerWidth;
    buildingCanvas.height = window.innerHeight;
    buildingCtx.imageSmoothingEnabled = false;

    uiCanvas.width = window.innerWidth;
    uiCanvas.height = window.innerHeight;
    uiCtx.imageSmoothingEnabled = false;

    cropCanvas.width = window.innerWidth;
    cropCanvas.height = window.innerHeight;
    cropCtx.imageSmoothingEnabled = false;

    try { // Redraw terrain after resizing
        terrainMap.drawTiles();
        buildingMap.drawTiles();
        cropMap.drawTiles();
    } catch (error) {
        console.error("Resize failed:", error);
    }
}


/**
 * Initialises the game step by step in correct order.
 */
async function initializeGame() {
    try {
        await terrainMap.initialize();
        await buildingMap.initialize();
        await cropMap.initialize();

        resizeCanvas(); // Initial resize and draw
        window.addEventListener('resize', resizeCanvas);

        ticker.start();
    } catch (error) {
        console.error('Initialization failed:', error);
        // Handle initialization error
    }
}


initializeGame().then(
    // Add code that is dependent on initialisation
);