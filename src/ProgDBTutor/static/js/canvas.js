import { TerrainMap } from './terrainLayer.js'
import { BuildingMap} from "./buildingLayer.js";
import { generateRandomTerrainMap } from './developerFunctions.js'
import * as inputHandler from './userInputHandler.js'
import { Ticker } from './ticker.js'

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

function handleClick(x, y) {
    console.log(`click on x: ${x}, y: ${y}`);
}


async function initializeGame() {
    try {
        await terrainMap.initialize();
        await buildingMap.initialize();

        resizeCanvas(); // Initial resize and draw
        window.addEventListener('resize', resizeCanvas);
        document.addEventListener('keydown', (event) => {
            inputHandler.handleKeyDown(event, terrainMap, buildingMap);
        });

        document.addEventListener('click', (event) => {
            const x = event.clientX;
            const y = event.clientY;

            inputHandler.handleClickInput(x, y, [buildingMap, terrainMap]);
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


















