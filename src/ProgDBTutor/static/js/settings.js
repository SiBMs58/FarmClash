
//TODO: 1 kleine bug als ik mute druk en dan undo dat mijn geluid hoger wordt

import  {soundManager} from './sound.js'

const zoomUpButton = document.getElementById("zoomUpButton"); //Initializes the right button from settings.html for zoomUp to a var
const zoomDownButton = document.getElementById("zoomDownButton"); //Initializes the right button from settings.html for zoomDown to a var

const mutebutton = document.getElementById('mutebuttonimg'); //Initializes mutebutton
const backsoundButton = document.getElementById('backsoundimg'); //Initializes backsoundbutton


zoomUpButton.addEventListener("click", zoomUpPrecent);
zoomDownButton.addEventListener("click", zoomDownPrecent);

let countZoom = parseInt(localStorage.getItem('zoomSetting')) || 50; //sett countzoom into storage
let zoomNumber = document.getElementById("zoomNumber");
zoomNumber.innerText = countZoom;

/**
 * De zoompercentage is increased by 20%
 * The number countzoom is kept in storage for late use
 */

function zoomUpPrecent(){
     if(countZoom < 100) {
         document.getElementById("zoomupimg").src="../static/img/UI/plus_pbtn.png";
         countZoom += 10;
         zoomNumber.innerText = countZoom;
         localStorage.setItem('zoomSetting', countZoom);
         button("zoomupimg","../static/img/UI/plus_btn.png");

     }
}

/**
 * zoompercentage is decresed by 20%
 * The number countzoom is kept in storage for late use
 */


function zoomDownPrecent(){
      if(countZoom > 20) {
           document.getElementById("zoomdownimg").src="../static/img/UI/minus_pbtn.png";
          countZoom -= 10;
          zoomNumber.innerText = countZoom;
          localStorage.setItem('zoomSetting', countZoom);
          button("zoomdownimg","../static/img/UI/minus_btn.png" );
      }
}


const soundUpButton = document.getElementById("soundup"); //Initializes the right button from settings.html for soundup to a var
const soundDownButton = document.getElementById("sounddown"); // Initializes gets the right button from settings.html for sounddown to a var

soundUpButton.onmousedown = soundUp;
soundDownButton.onmousedown = soundDown;


let countSound = parseInt(localStorage.getItem('soundSetting')) || 50; //sett countSound into storage
let soundNumber = document.getElementById("soundNumber"); //Initializes the current Sounnumber
soundNumber.innerText = countSound;


/**
 * Sound is increased with 10
 * The number countSound is kept in storage for other pages to acces the sound its currently at.
 */
 function soundDown(){
    if(countSound >= 0 &&  localStorage.getItem('muteButtonState') ==="sound_btn.png") {
        document.getElementById("sounddownimg").src = "../static/img/UI/sounddown_pbtn.png";
        countSound -= 10
        soundNumber.innerText = countSound;
        localStorage.setItem('soundSetting', countSound);
        button("sounddownimg","../static/img/UI/sounddown_btn.png" );

        //countsound is the number set by the user and being used as parameter to set the actual volume with
        // the function setVolume of the soundClass.
        const volume = countSound / 100;
        soundManager.setVolume(volume);
    }
}

/**
 * Sound is decresed with 10
 * The number countSound is kept in storage for other pages to acces the sound its currently at.
 */
function soundUp(){
    if(countSound < 100 && localStorage.getItem('muteButtonState')==="sound_btn.png") {
        document.getElementById("soundupimg").src = "../static/img/UI/soundup_pbtn.png";
        countSound += 10;
        soundNumber.innerText = countSound;
        localStorage.setItem('soundSetting', countSound);
        button("soundupimg","../static/img/UI/soundup_btn.png" );

         //countsound is the number set by the user and being used as parameter to set the actual volume with
        // the function setVolume of the soundClass.
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


mutebutton.src = (localStorage.getItem('muteButtonState') === "sound_pbtn.png") ? "../static/img/UI/sound_pbtn.png" : "../static/img/UI/sound_btn.png";
backsoundButton.src = (localStorage.getItem('backsoundButtonState') === "slider_on.png") ? "../static/img/UI/slider_on.png" : "../static/img/UI/slider_off.png";


/**
 * This function is a mute function, looks based on the localstorage to see if it needs to unmute or mute and
 * calls the mute function from class sound.
 */
mutebutton.addEventListener("click", function() {
    if (mutebutton.src.endsWith("sound_btn.png") && localStorage.getItem('muteButtonState') === "sound_btn.png") {
        mutebutton.src = "../static/img/UI/sound_pbtn.png";
        localStorage.setItem('muteButtonState','sound_pbtn.png');
        soundManager.mute();

    } else {
        mutebutton.src = "../static/img/UI/sound_btn.png";
        localStorage.setItem('muteButtonState', 'sound_btn.png');
        soundManager.mute();
    }

});

/**
 * chnages the button with a click
 */

backsoundButton.addEventListener("click", function() {
    if (backsoundButton.src.endsWith("slider_off.png") && localStorage.getItem('backsoundButtonState')=== "slider_off.png") {
        backsoundButton.src = "../static/img/UI/slider_on.png";
        localStorage.setItem('backsoundButtonState',"slider_on.png");
        soundManager.playBackgroundMusic();

    } else {
        backsoundButton.src = "../static/img/UI/slider_off.png";
        localStorage.setItem('backsoundButtonState', "slider_off.png");
        soundManager.stopBackgroundMusic();
    }


});





