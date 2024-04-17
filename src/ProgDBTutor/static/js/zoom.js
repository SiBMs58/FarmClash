import { buildingMap, terrainMap, tileSize } from "./canvas";



let zoomLevel = 1; // Initial zoom level

export function zoomIn() {
    zoomLevel += 0.1; // Increase zoom level
    updateZoom();
}

export function zoomOut() {
    zoomLevel -= 0.1; // Decrease zoom level
    updateZoom();
}

function updateZoom() {
    // Adjust tileSize based on zoom level
    tileSize = 50 * zoomLevel;

    // Update terrain map
    terrainMap.tileSize = tileSize;
    terrainMap.drawTiles();

    // Update building map
    buildingMap.tileSize = tileSize;
    buildingMap.drawTiles();
}

zoomUpButton.addEventListener("click", zoomIn);
zoomDownButton.addEventListener("click", zoomOut);


