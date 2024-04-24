//TODO: buttons plays without debug
//TODO: fix the premission for zoomen
//TODO: buttons aanpassen

//import { zoomIn, zoomOut } from './zoomFunctions.js';

const zoomUpButton = document.getElementById("zoomUpButton");
const zoomDownButton = document.getElementById("zoomDownButton");

zoomUpButton.addEventListener("click", zoomUpPrecent);
zoomDownButton.addEventListener("click", zoomDownPrecent);

let countZoom = parseInt(localStorage.getItem('zoomSetting')) || 0;
let zoomNumber = document.getElementById("zoomNumber");
zoomNumber.innerText = countZoom;

function zoomUpPrecent(){
     if(countZoom < 100) {
         countZoom += 20;
         zoomNumber.innerText = countZoom;
         localStorage.setItem('zoomSetting', countZoom);
         zoomIn();

     }
}
function zoomDownPrecent(){
      if(countZoom > 0) {
          countZoom -= 20;
          zoomNumber.innerText = countZoom;
          localStorage.setItem('zoomSetting', countZoom);
          zoomOut();
      }
}

const soundUpButton = document.getElementById("soundup");
const soundDownButton = document.getElementById("sounddown");

soundUpButton.addEventListener("click", soundUp);
soundDownButton.addEventListener("click", soundDown);


let countSound = parseInt(localStorage.getItem('soundSetting')) || 50;
let soundNumber = document.getElementById("soundNumber");
soundNumber.innerText = countSound;

function soundDown(){
    if(countSound > 0) {
        countSound -= 10
        soundNumber.innerText = countSound;
        localStorage.setItem('soundSetting', countSound);
    }
}

function soundUp(){
    if(countSound < 100) {
        countSound += 10;
        soundNumber.innerText = countSound;
        localStorage.setItem('soundSetting', countSound);
    }

}


//const zoomDownButton = document.getElementById("zoomDownButton");

// Add a click event listener
zoomDownButton.addEventListener("click", function() {
    zoomDownButton.src = "../static/img/UI/minus_pbtn.png";

    setTimeout(function() {
        zoomDownButton.src = "../static/img/UI/minus_btn.png";
    }, 100);
});







//import {buildingMap, terrainMap} from "./canvas";
//import {tileSize} from "./canvas";

/*

let zoomLevel = 1; // Initial zoom level

function zoomIn() {
    zoomLevel += 0.1; // Increase zoom level
    updateZoom();
}

function zoomOut() {
    zoomLevel -= 0.1; // Decrease zoom level
    updateZoom();
}

function updateZoom() {
    // Adjust tileSize based on zoom level
    tileSize = 50 * zoomLevel;

    // Update terrain map
    terrainMap.tileSize = tileSize;
    terrainMap.drawTiles();

    // Update building map
    buildingMap.tileSize = tileSize;
    buildingMap.drawTiles();
}




*/
zoomUpButton.addEventListener("click", zoomIn);
zoomDownButton.addEventListener("click", zoomOut);