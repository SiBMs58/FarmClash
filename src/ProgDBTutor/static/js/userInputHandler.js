import { tileSize } from './canvas.js'

export class UserInputHandler {
    /**
     * @param _classes all the classes that need to react to some kind of input
     */
    constructor(_classes) {
        this.classes = _classes;

        this.isMouseDown = false;
        this.lastMouseX = 0;
        this.lastMouseY = 0;

        this.mouseScrollSensitivity = Math.floor(0.8 * tileSize);

        this.priorityClickClass = null;

        const canvas = document.getElementById('buildingCanvas');
        const rect = canvas.getBoundingClientRect();


        // ———————————————————
        // Add event listeners:

        document.addEventListener('keydown', (event) => {
            this.handleKeyDown(event);
        });
        // To check whether to register click or drag
        let clickStartPosition = null;
        document.addEventListener('mousedown', (event) => {
            clickStartPosition = { x: event.clientX - rect.left, y: event.clientY - rect.top};
            this.handleScrollInput(event);
        });
        document.addEventListener('mouseup', (event) => {
            this.handleScrollInput(event);

            if (clickStartPosition !== null) {
                const dx = Math.abs((event.clientX - rect.left) - clickStartPosition.x);
                const dy = Math.abs((event.clientY - rect.top) - clickStartPosition.y);

                const threshold = 5; // Adjust as needed

                if (dx > threshold || dy > threshold) {
                    clickStartPosition = null;
                    return;
                }

                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                this.handleClickInput(x, y);
            }
        });
        document.addEventListener('mousemove', (event) => {
            this.handleScrollInput(event);
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            this.handleMouseMove(x, y);
        });
        document.addEventListener('contextmenu', function(event) {
            event.preventDefault(); // Prevents the default context menu from appearing
        });
    }

    /**
     * Sends the right display scroll message to all subscribed classes.
     */
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

    /**
     * Handles the keyDown event.
     */
    handleKeyDown(event) {
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

    /**
     * Handles when screen is dragged ——> needs to scroll
     * @param event the event object
     */
    handleScrollInput(event) {
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
                    if (deltaX > this.mouseScrollSensitivity ){
                        this.lastMouseX = event.clientX;
                        this.sendScrollMessage('Left');
                    }
                    else if (deltaX < -this.mouseScrollSensitivity){
                        this.lastMouseX = event.clientX;
                        this.sendScrollMessage('Right');
                    }
                    if (deltaY > this.mouseScrollSensitivity ){
                        this.lastMouseY = event.clientY;
                        this.sendScrollMessage('Up');
                    }
                    else if (deltaY < -this.mouseScrollSensitivity){
                        this.lastMouseY = event.clientY;
                        this.sendScrollMessage('Down');
                    }
                }
                break;
            default:
                break;
        }
    }

    /** Checks all layer classes one by one to see if the user clicked on something in the layer.
     * Classes have the ability to set themselves as a priorityClickClass such that next click will be sent to them
     * regardless of class order.
     *
     * @param x on screen
     * @param y on screen
     */
    handleClickInput(x, y) {
        // check for possible priority class
        if (this.priorityClickClass !== null) {
            this.priorityClickClass.handleClick(x,y);
            if (!this.priorityClickClass.ownNextClick) {
                this.priorityClickClass = null;
            }
            return;
        }

        // normal click order execution
        for (const currClass of this.classes) {
            if (currClass.handleClick(x,y) === true) {
                if (currClass.ownNextClick) {
                    this.priorityClickClass = currClass;
                }
                break;
            }
        }
    }

    /**
     * Calls the 'handleMouseMove' function on all subscribed classes that have this function.
     * @param x screen x coord
     * @param y screen y coord
     */
    handleMouseMove(x, y) {
        for (const currClass of this.classes) {
            if (typeof currClass.handleMouseMove === 'function') {
                currClass.handleMouseMove(x, y);
            }
        }
    }

}
