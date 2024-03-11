import { gameTerrainMap } from './gameClasses.js'
import { generateRandomMap } from './developerFunctions.js'
import { handleKeyDown } from './userInputHandler.js'

const canvas = document.getElementById('terrainCanvas');
const ctx = canvas.getContext('2d');
const tileSize = 64;

//const mapData = generateRandomMap(50, 50);

const response = await fetch('/static/map.json');
const mapData = await response.json();



const terrainMap = new gameTerrainMap(mapData, tileSize, ctx);

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.imageSmoothingEnabled = false;
    terrainMap.drawTiles(); // Redraw terrain after resizing
}


// Game wereld initiäliseren
terrainMap.initialize().then(() => {
    resizeCanvas(); // Initial resize and draw
    window.addEventListener('resize', resizeCanvas);
    document.addEventListener('keydown', (event) => {
        handleKeyDown(event, terrainMap);
    });
    /*
    document.addEventListener('scroll', (event) => {
        handleScrollInput(event, terrainMap);
    });
    */
}).catch(error => {
    console.error('Initialization failed:', error);
    // todo load error page (error getekend met de map tiles)
});


//terrainMap.fetchTiles();


















