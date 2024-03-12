import { TerrainMap } from './terrainLayer.js'
import { generateRandomTerrainMap } from './developerFunctions.js'
import { handleKeyDown } from './userInputHandler.js'

const terrainCanvas = document.getElementById('terrainCanvas');
const terrainCtx = terrainCanvas.getContext('2d');

//const buildingCanvas = document.getElementById('buildingCanvas');
//const buildingCtx = buildingCanvas.getContext('2d');

const tileSize = 64;


const mapData = generateRandomTerrainMap(50, 50);
const terrainMap = new TerrainMap(mapData, tileSize, terrainCtx);

function resizeCanvas() {
    terrainCanvas.width = window.innerWidth;
    terrainCanvas.height = window.innerHeight;
    terrainCtx.imageSmoothingEnabled = false;

    //buildingCanvas.width = window.innerWidth;
    //buildingCanvas.height = window.innerHeight;
    //buildingCtx.imageSmoothingEnabled = false;

    terrainMap.drawTiles(); // Redraw terrain after resizing

}


// Game wereld initiäliseren
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


//terrainMap.fetchTiles();


















