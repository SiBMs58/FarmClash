import { TerrainMap } from './terrainLayer.js'

export function handleKeyDown(event, terrainMapClass, buildingMapClass) {
    switch(event.key) {
    case 'ArrowLeft':
      terrainMapClass.scrollLeft();
      buildingMapClass.scrollLeft();
      break;
    case 'ArrowUp':
      terrainMapClass.scrollUp();
      buildingMapClass.scrollUp();
      break;
    case 'ArrowRight':
      terrainMapClass.scrollRight();
      buildingMapClass.scrollRight();
      break;
    case 'ArrowDown':
      terrainMapClass.scrollDown();
      buildingMapClass.scrollDown();
      break;
    default:
      // Optional: handle any other keys
      break;
  }
}

export function handleScrollInput(event, terrainMapClass) {

}