
// THIS CLASS IS INTENDED TO BE USED AS A VIRTUAL CLASS

export class BaseMap {
    /**
     * This is the base class used by 'BuildingMap' and 'TerrainMap' to extract duplicate code.
     * @param mapData
     * @param _tileSize
     * @param username
     */
    constructor(mapData, _tileSize, username) {
        this.tileSize = _tileSize;
        this.map_width = mapData.map_width;
        this.map_height = mapData.map_height;
        this.username = username;

        // Top-left corner of the displayed tiles on the screen.
        this.viewY = 0;
        this.viewX = 0;

        this.ownNextClick = false;
    }

    /**
     * This is a function that needs to be overridden and gives an error otherwise.
     */
    drawTiles() {
        throw new Error ("drawTiles is een pure virtual function and needs to be overridden");
    }

    /**
     * Checks whether a tile coordinate is valid, which means that it's inside the stored Map.
     * @param y_tile
     * @param x_tile
     * @returns {boolean} returns true if position is valid.
     */
    isValidTilePosition(y_tile, x_tile) {
        if (y_tile >= 0 && y_tile < this.map_height && x_tile >= 0 && x_tile < this.map_width) {
            return true;
        }
        throw new Error (`isValidTilePosition(): Not a valid tile position: (y: ${y_tile} x: ${x_tile})`);
    }


    /**
     *  ——————————————
     *  MOVE FUNCTIONS
     *  ——————————————
     *  These functions move the displayed portion of the map. They get called by the UserInputHandler.
     */

    scrollLeft() {
        if (this.viewX > 0) {
            this.viewX -= 1;
            this.drawTiles()
            //console.log(`pijltje naar links is ingedrukt viewY: ${this.viewX}`);
        } else {
            console.log("kan niet verder, je zit aan de rand");
        }

    }

    scrollUp() {
        if (this.viewY > 0) {
            this.viewY -= 1;
            this.drawTiles()
            //console.log(`pijltje naar boven is ingedrukt viewY: ${this.viewY}`);
        } else {
            console.log("kan niet verder, je zit aan de rand");
        }
    }

    scrollRight() {
        if (this.viewX < this.map_width - Math.ceil(window.innerWidth/this.tileSize)) {
            this.viewX += 1;
            this.drawTiles()
            //console.log(`pijltje naar rechts is ingedrukt viewY: ${this.viewX}`);
        } else {
            console.log(`kan niet verder, je zit aan de rand: viewX ${this.viewX}`);
        }

    }

    scrollDown() {
        if (this.viewY < this.map_height - Math.ceil(window.innerHeight/this.tileSize)) {
            this.viewY += 1;
            this.drawTiles()
            //console.log(`pijltje naar beneden is ingedrukt viewY: ${this.viewY}`);
        } else {
            console.log(`kan niet verder, je zit aan de rand: viewY ${this.viewY}`);
        }

    }

}