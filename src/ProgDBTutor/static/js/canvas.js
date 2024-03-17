import { TerrainMap } from './terrainLayer.js'
import { BuildingMap} from "./buildingLayer.js";
import { generateRandomTerrainMap } from './developerFunctions.js'
import { handleKeyDown } from './userInputHandler.js'
import { Ticker } from './ticker.js'
import { handleScrollInput } from './userInputHandler.js'

const terrainCanvas = document.getElementById('terrainCanvas');
const terrainCtx = terrainCanvas.getContext('2d');

const buildingCanvas = document.getElementById('buildingCanvas');
const buildingCtx = buildingCanvas.getContext('2d');

const tileSize = 64;


const mapData = generateRandomTerrainMap(50, 50);
const terrainMap = new TerrainMap(mapData, tileSize, terrainCtx);

const buildingMap = new BuildingMap(undefined, tileSize, buildingCtx);

const ticker = new Ticker([terrainMap, buildingMap]);

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


async function initializeGame() {
    try {
        await terrainMap.initialize();
        await buildingMap.initialize();

        resizeCanvas(); // Initial resize and draw
        window.addEventListener('resize', resizeCanvas);
        document.addEventListener('keydown', (event) => {
            handleKeyDown(event, terrainMap, buildingMap);
        });
        document.addEventListener('mousedown', (event) => {
            handleScrollInput(event, terrainMap);
        });
        document.addEventListener('mousemove', (event) => {
            handleScrollInput(event, terrainMap);
        });
        document.addEventListener('mouseup', (event) => {
            handleScrollInput(event, terrainMap);
        });

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


















