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

let isMouseDown = false;
let lastMouseX = 0;
let lastMouseY = 0;

export function handleScrollInput(event, terrainMapClass) {
    switch (event.type) {
        case 'mousedown':
            isMouseDown = true;
            lastMouseX = event.clientX;
            lastMouseY = event.clientY;
            break;
        case 'mouseup':
            isMouseDown = false;
            break;
        case 'mousemove':
            if (isMouseDown) {
                const deltaX = (event.clientX - lastMouseX);
                const deltaY = (event.clientY - lastMouseY);
                if (deltaX > 10 ){
                    lastMouseX = event.clientX;
                    terrainMapClass.scrollLeft();
                }

                else if (deltaX < -10){
                    lastMouseX = event.clientX;
                    terrainMapClass.scrollRight();
                }
                if (deltaY > 10 ){
                    lastMouseY = event.clientY;
                    terrainMapClass.scrollUp();
                }

                else if (deltaY < -10){
                    lastMouseY = event.clientY;
                    terrainMapClass.scrollDown();
                }



            }
            break;
        default:
            break;
    }
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