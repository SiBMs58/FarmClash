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

/** Checks all layer classes one by one to see if user clicked on something in the layer.
 *
 * @param x on screen
 * @param y on screen
 * @param layerClasses example: [UI, buildingMap, terrainMap]
 */
export function handleClickInput(x, y, layerClasses) {
    for (const currClass of layerClasses) {
        if (currClass.handleClick(x,y)) {
            break;
        }
    }
}