export class BaseMap {
    constructor(mapData, _tileSize) {
        this.tileSize = _tileSize;
        this.map_width = mapData.map_width;
        this.map_height = mapData.map_height;
        this.viewY = 0;
        this.viewX = 0;

        this.ownNextClick = false;
    }

    drawTiles() {
        throw new Error ("drawTiles is een pure virtual function and needs to be overridden");
    }

    isValidTilePosition(y, x) {
        if (y >= 0 && y < this.map_height && x >= 0 && x < this.map_width) {
            return true;
        }
        throw new Error (`isValidTilePosition(): Not a valid tile position: (y: ${y} x: ${x})`);
    }


    // --------------
    // MOVE FUNCTIONS

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