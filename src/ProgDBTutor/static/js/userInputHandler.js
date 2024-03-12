import { TerrainMap } from './terrainLayer.js'

export function handleKeyDown(event, terrainMapClass) {
    switch(event.key) {
    case 'ArrowLeft':
      terrainMapClass.scrollLeft();
      break;
    case 'ArrowUp':
      terrainMapClass.scrollUp();
      break;
    case 'ArrowRight':
      terrainMapClass.scrollRight();
      break;
    case 'ArrowDown':
      terrainMapClass.scrollDown();
      break;
    default:
      // Optional: handle any other keys
      break;
  }
}

export function handleScrollInput(event, terrainMapClass) {

}