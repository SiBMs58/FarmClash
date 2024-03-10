function getAssetDir(assetName) {
    return assetName.split('.')[0];
}


/*  Tile coördinaten: (y,x)
    0 1 2 3 | x
    1
    2
    3
    —
    y
*/

export class gameTerrainMap {
    constructor(mapData, _tileSize, _ctx) {
        this.width = mapData.map_width;
        this.height = mapData.map_height;
        this.tiles = mapData.terrain_tiles;
        this.tileSize = _tileSize;
        this.ctx = _ctx;

        this.viewY = 0;
        this.viewX = 0;
    }

    isValidPosition(y, x) {
        return y >= 0 && y < this.height
            && x >= 0 && x < this.width;
    }

    getTile(y, x) {
        if (this.isValidPosition(y, x)) {
            return this.tiles[y][x];
        } else {
            console.error("gameTerrainMap : Invalid position: (y:", y, ", x:", x, ")");
            return null;
        }
    }

    drawTiles() {
        const windowTileHeight = Math.ceil(window.innerHeight / this.tileSize);
        const windowTileWidth = Math.ceil(window.innerWidth / this.tileSize);

        let y_screen = 0;
        let x_screen = 0;

        for (let i_map = this.viewY; i_map < windowTileHeight + this.viewY; i_map++) {
            x_screen = 0;
            for (let j_map = this.viewX; j_map < windowTileWidth + this.viewX; j_map++) {
                const currTile = this.tiles[i_map][j_map];
                const filePath = "/static/img/assets/tiles/" + getAssetDir(currTile) + "/" + currTile + ".png";
                const img = new Image();
                img.src = filePath;
                img.onload = ((y, x) => { // (i, j) capturen zodat deze niet veranderen tijdens uitvoering
                    return () => {
                        this.ctx.drawImage(img, x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
                    };
                })(y_screen, x_screen); // IIFE
                x_screen += 1;
            }
            y_screen += 1;
        }
    }

    // Haalt de terrain_tiles uit de database en update deze klasse
    fetchTiles() {
        fetch('/api/get-game-state')
            .then(response => response.json()) // Parse JSON response
            .then(data => {

                this.width = data.width;
                this.height = data.height;
                this.tiles = data.terrain_tiles;

            }).catch(error => console.error('gameTerrainMap.fetchTiles: ', error));
    }

    toJSON() {
        return {
            map_width: this.width,
            map_height: this.height,
            terrain_tiles: this.tiles
        };
    }


    // --------------
    // MOVE FUNCTIONS

    scrollLeft() {
        if (this.viewX > 0) {
            this.viewX -= 1;
            this.drawTiles()
            console.log(`pijltje naar links is ingedrukt viewY: ${this.viewX}`);
        } else {
            console.log("kan niet verder, je zit aan de rand");
        }

    }

    scrollUp() {
        if (this.viewY > 0) {
            this.viewY -= 1;
            this.drawTiles()
            console.log(`pijltje naar boven is ingedrukt viewY: ${this.viewY}`);
        } else {
            console.log("kan niet verder, je zit aan de rand");
        }
    }

    scrollRight() {
        if (this.viewX < this.width - Math.ceil(window.innerWidth/this.tileSize)) {
            this.viewX += 1;
            this.drawTiles()
            console.log(`pijltje naar rechts is ingedrukt viewY: ${this.viewX}`);
        } else {
            console.log(`kan niet verder, je zit aan de rand: viewX ${this.viewX}`);
        }

    }

    scrollDown() {
        if (this.viewY < this.height - Math.ceil(window.innerHeight/this.tileSize)) {
            this.viewY += 1;
            this.drawTiles()
            console.log(`pijltje naar beneden is ingedrukt viewY: ${this.viewY}`);
        } else {
            console.log(`kan niet verder, je zit aan de rand: viewY ${this.viewY}`);
        }

    }

}