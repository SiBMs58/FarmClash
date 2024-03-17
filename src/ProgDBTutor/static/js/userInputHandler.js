import { TerrainMap } from './terrainLayer.js'


export class UserInputHandler {
    constructor(_classes) {
        this.classes = _classes;

        this.isMouseDown = false;
        this.lastMouseX = 0;
        this.lastMouseY = 0;


        // Add event listeners:

        document.addEventListener('keydown', (event) => {
            this.handleKeyDown(event);
        });

        document.addEventListener('click', (event) => {
            const x = event.clientX;
            const y = event.clientY;

            this.handleClickInput(x, y);
        });
        document.addEventListener('mousedown', (event) => {
            this.handleScrollInput(event);
        });
        document.addEventListener('mousemove', (event) => {
            this.handleScrollInput(event);
        });
        document.addEventListener('mouseup', (event) => {
            this.handleScrollInput(event);
        });
    }

    sendScrollMessage(direction) {
        switch (direction) {
            case 'Left':
                for (const _class of this.classes) {
                    _class.scrollLeft();
                }
                break;
            case 'Up':
                for (const _class of this.classes) {
                    _class.scrollUp();
                }
                break;
            case 'Right':
                for (const _class of this.classes) {
                    _class.scrollRight();
                }
                break;
            case 'Down':
                for (const _class of this.classes) {
                    _class.scrollDown();
                }
                break;
        }
    }

    handleKeyDown(event, terrainMapClass, buildingMapClass) {
        switch(event.key) {
            case 'ArrowLeft':
                this.sendScrollMessage('Left');
                break;
            case 'ArrowUp':
                this.sendScrollMessage('Up');
                break;
            case 'ArrowRight':
                this.sendScrollMessage('Right');
                break;
            case 'ArrowDown':
                this.sendScrollMessage('Down');
                break;
            default:
                // Optional: handle any other keys
                break;
        }
    }

    handleScrollInput(event, terrainMapClass) {
        let movementSensitivity = 50;

        switch (event.type) {
            case 'mousedown':
                this.isMouseDown = true;
                this.lastMouseX = event.clientX;
                this.lastMouseY = event.clientY;
                break;
            case 'mouseup':
                this.isMouseDown = false;
                break;
            case 'mousemove':
                if (this.isMouseDown) {
                    const deltaX = (event.clientX - this.lastMouseX);
                    const deltaY = (event.clientY - this.lastMouseY);
                    if (deltaX > movementSensitivity ){
                        this.lastMouseX = event.clientX;
                        this.sendScrollMessage('Left');
                    }

                    else if (deltaX < -movementSensitivity){
                        this.lastMouseX = event.clientX;
                        this.sendScrollMessage('Right');
                    }
                    if (deltaY > movementSensitivity ){
                        this.lastMouseY = event.clientY;
                        this.sendScrollMessage('Up');
                    }

                    else if (deltaY < -movementSensitivity){
                        this.lastMouseY = event.clientY;
                        this.sendScrollMessage('Down');
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
     */
    handleClickInput(x, y) {
        for (const currClass of this.classes) {
            if (currClass.handleClick(x,y)) {
                break;
            }
        }
    }

}







