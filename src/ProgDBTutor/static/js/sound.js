//TODO zoom functie...=> dat moet ik linken aan hetgene dat ook, vergroot en verkleint wnr ik het scherm aanpas
//TODO: documentatie


/**
 * Class for assigning sound
 */
class GameSoundManager {
    constructor() {
        this.soundButtons = [];
        this.backgroundMusic = false;
        this.muted =  localStorage.getItem('muted') === 'true';
        this.volume = parseFloat(localStorage.getItem('volumesetting')) || 0.5;


    }

    /**
     * @param buttonElement is the button itself
     * @param soundSrc the sound that is given
     * @param volume gives the volume of the clicksound
     */
    addSoundButton(buttonElement, soundSrc, volume = 1) {

        fetch(soundSrc)
        .then(response => response.blob())
        .then(blob => {
            const sound = new Audio(URL.createObjectURL(blob));
            sound.volume = volume;
            sound.crossOrigin = "anonymous";

            const soundButton = {
                buttonElement: buttonElement,
                sound: sound,
                volume: volume
            };
            this.soundButtons.push(soundButton);

            buttonElement.addEventListener('click', (event) => {
                //here it looks if the button has a href to go to, and plays the sound before it redirects
                if (localStorage.getItem('muteButtonState') === "sound_btn.png") {
                    sound.play();
                    const href = buttonElement.querySelector('a').getAttribute('href');
                        if (href) {
                            event.preventDefault(); // Prevent the default navigation
                            setTimeout(() => {
                                window.location.href = href;
                            }, 350); // Adjust the delay as needed
                        }
                }
            });



        })
        .catch(error => {
            console.error('Er is een fout opgetreden bij het laden van het geluidsbestand:', error);
        });
}

    /**
     * This function is being used in settings to adjust the volume of the background music with the right number i
     * @param volume is a number given by the function soundUp/soundDown to adjust the volume of the background. this is adjustable by the user
     */
    setVolume(volume) {
        this.soundButtons.forEach(soundButton => {
            soundButton.sound.volume = volume;
            soundButton.volume = volume;
        });
        if (this.backgroundMusic) {
            this.backgroundMusic.volume = volume;
            if(volume!=0) {
                localStorage.setItem('volumesetting', volume);
            }

        }
    }

    /**
     * This functions sets the background music for the entire game
     * @param soundSrc is the given music path
     */
    setBackgroundMusic(soundSrc) {
        this.backgroundMusic = new Audio(soundSrc);
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = this.volume;
    }

    /**
     * this function is responsible for the actual playing of the background msuic
     */

    playBackgroundMusic() {
        if (localStorage.getItem('backsoundButtonState') === "slider_on.png" &&  localStorage.getItem('muteButtonState') ==="sound_btn.png" ) {
            this.backgroundMusic.play();
        }
    }

    /**
     * This function is responsible for stopping the background msuic
     * this function is being used by the function ... in settings to stop the background music with right sllider
     */

    stopBackgroundMusic() {
        if (localStorage.getItem('backsoundButtonState') === "slider_off.png" ) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0; // Reset the playback position to the beginning
        }
    }

    /**
     * This function is responsible for muting all the sound, inclusive the buttons.
     */

    mute() {
    const muteSound = new Audio("/static/music/click.mp3");

    let volumemute = localStorage.getItem('volumesetting')
    if (localStorage.getItem('muteButtonState')==="sound_pbtn.png") {
        muteSound.play();
        this.setVolume(0);
    } else {
        if(localStorage.getItem('backsoundButtonState') === "slider_on.png"){
            this.setVolume(volumemute);
            this.playBackgroundMusic();
        }else {
            this.setVolume(volumemute);
        }
    }

    }
}



export const soundManager = new GameSoundManager();

document.addEventListener('DOMContentLoaded', function() {
    //const soundManager = new GameSoundManager();

    const baseSoundSrc = "/static/music/click.mp3";
    const volume = 0.5; //volume van the buttons

    const soundButtons = document.querySelectorAll('button');
    soundButtons.forEach((button) => {
        soundManager.addSoundButton(button, baseSoundSrc, volume);
    });

    soundManager.setBackgroundMusic("/static/music/carraiben.mp3");


    if (localStorage.getItem('backsoundButtonState') === "slider_on.png"  &&  localStorage.getItem('muteButtonState') ==="sound_btn.png") {
      soundManager.playBackgroundMusic();
        this.backgroundMusic = true;
    } else {
        soundManager.stopBackgroundMusic();
   }



});


