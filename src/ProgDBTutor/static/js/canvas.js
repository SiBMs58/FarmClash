import { TerrainMap } from './terrainLayer.js'
import { BuildingMap } from "./buildingLayer.js";
import { UICanvasLayer } from "./uiCanvasLayer.js";
import { generateRandomTerrainMap } from './developerFunctions.js'
import { UserInputHandler } from "./userInputHandler.js";
import { Ticker } from './ticker.js'

// Set on-screen tileSize-
// Retrieve the zoom size from local storage
let zoomSize = localStorage.getItem('zoomSetting');

// Set on-screen tileSize, default to 50 if zoom size is not set
export let tileSize = zoomSize ? parseInt(zoomSize) : 50;


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
async function initializeGame() {
    try {
        await terrainMap.initialize();
        await buildingMap.initialize();

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








document.addEventListener('DOMContentLoaded', function() {
const zoomUpButton = document.getElementById("zoomUpButton");
const zoomDownButton = document.getElementById("zoomDownButton");
let zoomLevel = parseInt(localStorage.getItem('zoomSetting')) / 100 || 1; // Set initial zoom from local storage
let countZoom = parseInt(localStorage.getItem('zoomSetting')) || 0; // Set countzoom into storage
let zoomNumber = document.getElementById("zoomNumber");
zoomNumber.innerText = countZoom;

zoomUpButton.addEventListener("click", zoomIn);
zoomDownButton.addEventListener("click", zoomOut);



/**
 * Zooms the game board in.
 */
function zoomIn() {
    if (countZoom < 100) {
        countZoom += 20;
        zoomNumber.innerText = countZoom;
        localStorage.setItem('zoomSetting', countZoom);
        updateZoom();
    }
}

/**
 * Zooms the game board out.
 */
function zoomOut() {
    if (countZoom > 0) {
        countZoom -= 20;
        zoomNumber.innerText = countZoom;
        localStorage.setItem('zoomSetting', countZoom);
        updateZoom();
    }
}

/**
 * Updates the zoom level and redraws the game board.
 */
function updateZoom() {
    zoomLevel = countZoom / 100; // Convert percentage to zoom level
    tileSize = 50 * zoomLevel; // Adjust tileSize based on zoom level

    // Redraw terrain and building maps with updated tileSize
    terrainMap.tileSize = tileSize;
    buildingMap.tileSize = tileSize;

    // Redraw terrain and building maps after updating zoom
    terrainMap.drawTiles();
    buildingMap.drawTiles();
}
});



