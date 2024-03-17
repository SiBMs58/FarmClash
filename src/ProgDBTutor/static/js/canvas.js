import { TerrainMap } from './terrainLayer.js'
import { BuildingMap} from "./buildingLayer.js";
import { generateRandomTerrainMap } from './developerFunctions.js'
import { UserInputHandler} from "./userInputHandler.js";
import { Ticker } from './ticker.js'

// Set on-screen tileSize-
const tileSize = 64;

// Create terrain map
const terrainCanvas = document.getElementById('terrainCanvas');
const terrainCtx = terrainCanvas.getContext('2d');
const mapData = generateRandomTerrainMap(50, 50);
const terrainMap = new TerrainMap(mapData, tileSize, terrainCtx);

// Create building map
const buildingCanvas = document.getElementById('buildingCanvas');
const buildingCtx = buildingCanvas.getContext('2d');
const buildingMap = new BuildingMap(undefined, tileSize, buildingCtx);

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

// Initialises the game step by step in correct order.
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

initializeGame();





/*
terrainMap.initialize().then(() => {
    resizeCanvas(); // Initial resize and draw
    window.addEventListener('resize', resizeCanvas);
    document.addEventListener('keydown', (event) => {
        handleKeyDown(event, terrainMap);
    });
}).catch(error => {
    console.error('terrainMap initialization failed:', error);
    // todo load error page (error getekend met de map tiles)
});
*/

//terrainMap.fetchTiles();


















