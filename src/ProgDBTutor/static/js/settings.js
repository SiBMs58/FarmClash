const zoomUpButton = document.getElementById("zoomUpButton");
const zoomDownButton = document.getElementById("zoomDownButton");
const mutebutton = document.getElementById('muteButton');
const backsoundButton = document.getElementById('playBackgroundMusicButton');


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
         button(zoomUpButton,"../static/img/UI/plus_pbtn.png","../static/img/UI/plus_btn.png" );

     }
}
function zoomDownPrecent(){
      if(countZoom > 0) {
          countZoom -= 20;
          zoomNumber.innerText = countZoom;
          localStorage.setItem('zoomSetting', countZoom);
          button(zoomDownButton,"../static/img/UI/minus_pbtn.png","../static/img/UI/minus_btn.png" );
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
        button(soundDownButton,"../static/img/UI/sounddown_pbtn.png","../static/img/UI/sounddown_btn.png" );
    }
}

function soundUp(){
    if(countSound < 100) {
        countSound += 10;
        soundNumber.innerText = countSound;
        localStorage.setItem('soundSetting', countSound);
        button(soundUpButton,"../static/img/UI/soundu_pbtn.png","../static/img/UI/soundup_btn.png" );
    }

}

function button(buttonType, img1, img2) {
        buttonType.src = img1;
        setTimeout(function () {
            buttonType.src = img2;
        }, 100);
}


let muteState = localStorage.getItem('muteButtonState');
let backsoundState = localStorage.getItem('backsoundButtonState');

mutebutton.src = (muteState === "sound_pbtn.png") ? "../static/img/UI/sound_pbtn.png" : "../static/img/UI/sound_btn.png";
backsoundButton.src = (backsoundState === "slider_on.png") ? "../static/img/UI/slider_on.png" : "../static/img/UI/slider_off.png";



mutebutton.addEventListener("click", function() {
    if (mutebutton.src.endsWith("sound_btn.png") && muteState === "sound_btn.png") {
        mutebutton.src = "../static/img/UI/sound_pbtn.png";
        muteState = "sound_pbtn.png";
    } else {
        mutebutton.src = "../static/img/UI/sound_btn.png";
        muteState = "sound_btn.png";
    }
    localStorage.setItem('muteButtonState', muteState);
});

backsoundButton.addEventListener("click", function() {
    if (backsoundButton.src.endsWith("slider_off.png") && backsoundState === "slider_off.png") {
        backsoundButton.src = "../static/img/UI/slider_on.png";
        backsoundState = "slider_on.png";
    } else {
        backsoundButton.src = "../static/img/UI/slider_off.png";
        backsoundState = "slider_off.png";
    }
    localStorage.setItem('backsoundButtonState', backsoundState);
});

/*
window.onload = function() {
    const muteButtonState = localStorage.getItem('muteButtonState');
    if (muteButtonState === 'clicked') {
        mutebutton.src = "../static/img/UI/sound_pbtn.png";
    } else {
        mutebutton.src = "../static/img/UI/sound_btn.png";
    }

    const backsoundButtonState = localStorage.getItem('backsoundButtonState');
    if (backsoundButtonState === 'clicked') {
        backsoundButton.src = "../static/img/UI/slider_on.png";
    } else {
        backsoundButton.src = "../static/img/UI/slider_off.png";
    }
};

*/



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
