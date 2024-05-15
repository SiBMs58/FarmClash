//TODO zoom functie...=> dat moet ik linken aan hetgene dat ook, vergroot en verkleint wnr ik het scherm aanpas
//TODO: documentatie


class GameSoundManager {
    constructor() {
        this.soundButtons = [];
        this.backgroundMusic = false;
        this.muted =  localStorage.getItem('muted') === 'true';
        this.volume = parseFloat(localStorage.getItem('volumesetting')) || 0.5;


    }

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

    setVolume(volume) {
        this.soundButtons.forEach(soundButton => {
            soundButton.sound.volume = volume;
            soundButton.volume = volume;
        });
        if (this.backgroundMusic) {
            this.backgroundMusic.volume = volume;
            localStorage.setItem('volumesetting', volume);

        }
    }

    setBackgroundMusic(soundSrc) {
        this.backgroundMusic = new Audio(soundSrc);
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = this.volume;
    }

    playBackgroundMusic() {
        if (localStorage.getItem('backsoundButtonState') === "slider_on.png" &&  localStorage.getItem('muteButtonState') ==="sound_btn.png" ) {
            this.backgroundMusic.play();
        }
    }

    stopBackgroundMusic() {
        if (localStorage.getItem('backsoundButtonState') === "slider_off.png" ) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0; // Reset the playback position to the beginning
        }
    }


    mute() {
    const muteSound = new Audio("/static/music/discord-notification.mp3");
    muteSound.play();

    if ( localStorage.getItem('muteButtonState')==="sound_pbtn.png") {
        this.setVolume(0);
    } else {
        if(localStorage.getItem('backsoundButtonState') === "slider_on.png"){
            this.playBackgroundMusic();
            this.setVolume(this.volume);
        }else {
            this.setVolume(this.volume);
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


