import { TerrainMap } from './terrainLayer.js'
import { BuildingMap} from "./buildingLayer.js";
import { generateRandomTerrainMap } from './developerFunctions.js'
import { UserInputHandler} from "./userInputHandler.js";
import { Ticker } from './ticker.js'

// Set on-screen tileSize-
export let tileSize = 50;

// Create terrain map
const terrainCanvas = document.getElementById('terrainCanvas');
const terrainCtx = terrainCanvas.getContext('2d');
const mapData = generateRandomTerrainMap(50, 50);
export let terrainMap = new TerrainMap(mapData, tileSize, terrainCtx);

// Create building map
const buildingCanvas = document.getElementById('buildingCanvas');
const buildingCtx = buildingCanvas.getContext('2d');
export let buildingMap = new BuildingMap(undefined, tileSize, buildingCtx, terrainMap);

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




//export function updateTileSize(){
 //   tileSize +=  countZoom; // Adjust tileSize based on countZoom
 //   terrainMap.setTileSize(tileSize);
  //  buildingMap.setTileSize(tileSize);

//}



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

// Event listeners for zooming

