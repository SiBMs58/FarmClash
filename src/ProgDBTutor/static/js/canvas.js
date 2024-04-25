import { TerrainMap } from './terrainLayer.js'
import { BuildingMap } from "./buildingLayer.js";
import { UICanvasLayer } from "./uiCanvasLayer.js";
import { generateRandomTerrainMap } from './developerFunctions.js'
import { UserInputHandler } from "./userInputHandler.js";
import { Ticker } from './ticker.js'

// Set on-screen tileSize-
export const tileSize = 50;

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

// Create building map
const buildingCanvas = document.getElementById('buildingCanvas');
const buildingCtx = buildingCanvas.getContext('2d');
let buildingMap;
if (window.friend) {
    // If friendData is available, use it in the constructor
    console.log("Friend data is available", window.friend);
    buildingMap = new BuildingMap(undefined, tileSize, buildingCtx, terrainMap, uiCanvasLayer, window.friend);
} else {
    // If friendData is not available, omit it from the constructor
    buildingMap = new BuildingMap(undefined, tileSize, buildingCtx, terrainMap, uiCanvasLayer);
}


// Create ticker
const ticker = new Ticker([terrainMap, buildingMap]);

// Create userInputHandler
const userInputHandler = new UserInputHandler([buildingMap, terrainMap]);


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

    try { // Redraw terrain after resizing
        terrainMap.drawTiles();
        buildingMap.drawTiles();
    } catch (error) {
        console.error("Resize failed:", error);
    }
}

/**
 * Initialises the game step by step in correct order.
 */
async function initializeGame(callback) {
    try {
        await terrainMap.initialize();
        await buildingMap.initialize();

        resizeCanvas(); // Initial resize and draw
        window.addEventListener('resize', resizeCanvas);

        ticker.start();

        if (typeof callback === 'function') {
            callback(); // Call the callback function if provided
        }

    } catch (error) {
        console.error('Initialization failed:', error);
        // Handle initialization error
    }
}


initializeGame(hideLoadingScreen).then(
    // Add code that is dependent on initialisation
);

function hideLoadingScreen() {
    document.getElementById('loading-screen').style.display = 'none';
}
