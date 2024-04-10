//TODO: buttons plays without debug
//TODO: fix the premission for zoomen


//import { TerrainMap } from './terrainLayer.js'
//import { BuildingMap} from "./buildingLayer.js";
//import { tileSize, terrainMap, buildingMap} from './canvas.js';

let zoomNumber = document.getElementById("zoomNumber");
let countZoom = 0;

//function updateTileSize(){
 //tileSize +=  countZoom; // Adjust tileSize based on countZoom
  // terrainMap.setTileSize(tileSize);
  // buildingMap.setTileSize(tileSize);

//}

function zoomUpPrecent(){
    countZoom += 20;
    zoomNumber.innerText = countZoom;
    //updateTileSize();

}
function zoomDownPrecent(){
     countZoom -= 20;
    zoomNumber.innerText = countZoom;
    //updateTileSize();

}

let soundNumber = document.getElementById("soundNumber");
let countSound = 50;


function soundDown(){
    if(countSound > 0) {
        countSound -= 10
        soundNumber.innerText = countSound;
    }

}

function soundUp(){
    if(countSound < 100) {
        countSound += 10;
        soundNumber.innerText = countSound;
    }


}

