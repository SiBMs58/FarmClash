import { BaseMap } from "./baseMap.js";
import { defaultMapData2 } from "./buildingLayer.js";

const IDLE = "IDLE";
const HOVER = "HOVER";
const CLICKED = "CLICKED";
const MOVING = "MOVING";


export class UICanvasLayer {

    constructor(_tileSize, ctx) {
        this.tileSize = _tileSize;
        this.ctx = ctx;
    }

    drawHoverUI(building, viewX, viewY) {
        console.log("drawHoverUI is gecalled");
    }

    drawSelectUI(building, viewX, viewY) {
        console.log("drawSelectUI is gecalled");
    }

    drawBadLocationUI(building, viewX, viewY) {
        console.log("drawBadLocationUI is gecalled");
    }

}