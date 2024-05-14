import  {soundManager} from './sound.js'

//const zoomUpButton = document.getElementById("zoomUpButton");
//const zoomDownButton = document.getElementById("zoomDownButton");

const mutebutton = document.getElementById('mutebuttonimg');
const backsoundButton = document.getElementById('backsoundimg');


//zoomUpButton.addEventListener("click", zoomUpPrecent);
//zoomDownButton.addEventListener("click", zoomDownPrecent);

//let countZoom = parseInt(localStorage.getItem('zoomSetting')) || 0; //sett countzoom into storage
//let zoomNumber = document.getElementById("zoomNumber");
//zoomNumber.innerText = countZoom;

/**
 * De zoompercentage word met 20% verhoogd.
 */

/*
function zoomUpPrecent(){
     if(countZoom < 100) {
         document.getElementById("zoomupimg").src="../static/img/UI/plus_pbtn.png";
         countZoom += 20;
         zoomNumber.innerText = countZoom;
         localStorage.setItem('zoomSetting', countZoom);
         button("zoomupimg","../static/img/UI/plus_btn.png");

     }
}

/**
 * e zoompercentage word met 20% verlaagd
 */
/*

function zoomDownPrecent(){
      if(countZoom > 0) {
           document.getElementById("zoomdownimg").src="../static/img/UI/minus_pbtn.png";
          countZoom -= 20;
          zoomNumber.innerText = countZoom;
          localStorage.setItem('zoomSetting', countZoom);
          button("zoomdownimg","../static/img/UI/minus_btn.png" );
      }
}
*/

const soundUpButton = document.getElementById("soundup");
const soundDownButton = document.getElementById("sounddown");

soundUpButton.onmousedown = soundUp;
soundDownButton.onmousedown = soundDown;


let countSound = parseInt(localStorage.getItem('soundSetting')) || 50; //sett countSound into storage
let soundNumber = document.getElementById("soundNumber");
soundNumber.innerText = countSound;


/**
 * Sound is increased with 10
 */
 function soundDown(){
    if(countSound >= 0 && muteState==="sound_btn.png") {
        document.getElementById("sounddownimg").src = "../static/img/UI/sounddown_pbtn.png";
        countSound -= 10
        soundNumber.innerText = countSound;
        localStorage.setItem('soundSetting', countSound);
        button("sounddownimg","../static/img/UI/sounddown_btn.png" );

        const volume = countSound / 100;
        soundManager.setVolume(volume);
    }
}

/**
 * Sound is decresed with 10
 */
function soundUp(){
    if(countSound < 100 && muteState==="sound_btn.png") {
        document.getElementById("soundupimg").src = "../static/img/UI/soundup_pbtn.png";
        countSound += 10;
        soundNumber.innerText = countSound;
        localStorage.setItem('soundSetting', countSound);
        button("soundupimg","../static/img/UI/soundup_btn.png" );

        const volume = countSound / 100;
        soundManager.setVolume(volume);
    }

}

/**
 * This function acts for the buttons to see a virtual click
 * @param buttonType
 * @param img1
 */
function button(buttonType, img1) {
       setTimeout(function () {
            document.getElementById(buttonType).src = img1;
        }, 100);
}


//export let muteState = localStorage.getItem('muteButtonState');
//export let backsoundState = localStorage.getItem('backsoundButtonState') || "slider_off.png";

mutebutton.src = (muteState === "sound_pbtn.png") ? "../static/img/UI/sound_pbtn.png" : "../static/img/UI/sound_btn.png";
backsoundButton.src = (backsoundState === "slider_on.png") ? "../static/img/UI/slider_on.png" : "../static/img/UI/slider_off.png";


/**
 * Changes the button with a click
 */
mutebutton.addEventListener("click", function() {
    if (mutebutton.src.endsWith("sound_btn.png") && muteState === "sound_btn.png") {
        mutebutton.src = "../static/img/UI/sound_pbtn.png";
        muteState = "sound_pbtn.png";
        soundManager.mute();

    } else {
        mutebutton.src = "../static/img/UI/sound_btn.png";
        muteState = "sound_btn.png";
        soundManager.mute();
    }
    localStorage.setItem('muteButtonState', muteState);
});

/**
 * chnages the button with a click
 */

backsoundButton.addEventListener("click", function() {
    if (backsoundButton.src.endsWith("slider_off.png") && backsoundState === "slider_off.png") {
        backsoundButton.src = "../static/img/UI/slider_on.png";
        backsoundState = "slider_on.png";
        soundManager.playBackgroundMusic();

    } else {
        backsoundButton.src = "../static/img/UI/slider_off.png";
        backsoundState = "slider_off.png";
        soundManager.stopBackgroundMusic();
    }
    localStorage.setItem('backsoundButtonState', backsoundState);
});





/*
import {buildingMap, terrainMap} from "./canvas";
import {tileSize} from "./canvas";


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