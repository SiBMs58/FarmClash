import { gameTerrainMap } from './gameClasses.js'

const canvas = document.getElementById('worldCanvas');
const ctx = canvas.getContext('2d');
const tileSize = 64;

const mapData = {
  map_width: 3,
  map_height: 3,
  terrain_tiles: [
    ["Grass.6.6", "Grass.6.4", "Grass.6.6"],
    ["Grass.6.4", "Water.1.2", "Grass.6.6"],
    ["Grass.6.6", "Grass.6.4", "Grass.6.4"]
  ]
};



const terrainMap = new gameTerrainMap(mapData);
//terrainMap.fetchTiles();

/*
function drawTiles() {
    for (let j = 0; j < Math.ceil(window.innerHeight / tileSize); j++) {
        for (let i = 0; i < Math.ceil(window.innerWidth / tileSize); i++) {
            const img = new Image();
            let randomInteger = Math.floor(Math.random() * 6) + 1;
            if (randomInteger === 5) {
                randomInteger = 3;
            }
            const filePath = "/static/img/assets/tiles/Grass/Grass.6." + randomInteger.toString() + ".png";
            img.src = filePath;
            img.onload = (function(x, y) {
                return function() {
                    ctx.drawImage(img, x * tileSize, y * tileSize, tileSize, tileSize);
                };
            })(i, j); // IIFE
        }
    }
}
*/


function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.imageSmoothingEnabled = false;
    terrainMap.drawTiles(ctx, tileSize); // Redraw tiles after resizing
}

// Initial resize and draw
resizeCanvas();

window.addEventListener('resize', resizeCanvas);







