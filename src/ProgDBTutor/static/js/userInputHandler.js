import { tileSize } from './canvas.js'
import {closePopup, openPopup, togglePopup} from './buildingPopup.js'

const items = ["Wheat", "Carrot", "Corn", "Lettuce", "Stone", "Tomato", "Zucchini", "Ingot", "Parsnip", "Soy Milk",
    "Cashmere Wool", "Irish Wool", "Gold Truffle", "Rustic Egg", "Strawberry Milk", "Alpaca Wool", "Emerald Egg",
    "Chocolate Milk", "Cauliflower", "Sapphire Egg", "Milk", "Eggplant", "Money", "Forest Truffle", "Log",
    "Blueberry Milk", "Plank", "Wool", "Crimson Egg", "Egg", "Truffle", "Dolphin Wool", "Stick", "Winter Truffle",
    "Bronze Truffle", "Turnip"];


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
        // Add event listeners: //

        document.addEventListener('keydown', (event) => {
            this.handleKeyDown(event);
        });
        /*
        document.getElementById("canvasContainer").addEventListener('contextmenu', function(event) {
            event.preventDefault(); // Prevents the default context menu from showing
            console.log('Right click on canvas detected.');

            openPopup();

            return false; // Some browsers may require this to prevent the default context menu
        });
*/
        // To check whether to register click or drag
        let clickStartPosition = null;
        document.getElementById("canvasContainer").addEventListener('mousedown', (event) => {
            console.log("mousedown");
            switch(event.button) {
                case 0:
                    clickStartPosition = { x: event.clientX - rect.left, y: event.clientY - rect.top};
                    this.handleScrollInput(event);
                    closePopup();
                    break;
                case 2:
                    break;
            }

        });
        document.getElementById("canvasContainer").addEventListener('mouseup', (event) => {
            console.log("mouseup");
            switch (event.button) {
                case 0:
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
                    break;
                case 2:
                    this.handleRightClickInput(event.clientX, event.clientY);
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
            case 'Escape':
                // todo move van gebouw cancelen als je het aan het verplaatsen bent
                break;
            case 'o':
                togglePopup();
                break;
            case 'r':
                this.cheatResources();
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
            if (typeof currClass.handleClick === 'function' && currClass.handleClick(x,y) === true) {
                if (currClass.ownNextClick) {
                    this.priorityClickClass = currClass;
                }
                break;
            }
        }
    }

    handleRightClickInput(x, y) {
        for (const currClass of this.classes) {
            if (typeof currClass.handleRightClick === 'function' && currClass.handleRightClick(x,y) === true) {
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

    async cheatResources() {
        const resources = {};
        items.forEach(item => {
            resources[item] = 1000;});

        const BASE_URL = `${window.location.protocol}//${window.location.host}`;
        const fetchLink = `${BASE_URL}/api/add-resources`;

        try {
            const response = await fetch(fetchLink, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(resources) // Send the serialized resource data as the request body
            });

            if (response.ok) {
                const jsonResponse = await response.json();
                console.log('Resources DB update successful:', jsonResponse);
            } else {
                console.error('Add-resources DB update failed with status:', response.status);
            }
        } catch (error) {
            console.error('Failed to update resources:', error);
        }
    }
}
