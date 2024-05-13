//TODO:storage first
//TODO buttons moeten juist werken met aan en uit juiste click  => enkel de mute een kleien fout
//TODO: implemtn all buttons
//TODO zoom functie



 class GameSoundManager {
    constructor() {
        this.soundButtons = [];
        this.backgroundMusic = null;
        this.muted = false;
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

            buttonElement.addEventListener('click', () => {
                if (!this.muted) {
                    sound.play();
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
        }
    }

    setBackgroundMusic(soundSrc, volume = 0.5) {
        this.backgroundMusic = new Audio(soundSrc);
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = volume;
    }

    playBackgroundMusic(bool) {
        if (!this.muted && this.backgroundMusic) {
            this.backgroundMusic.play();
        }
    }

    stopBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0; // Reset the playback position to the beginning
        }
    }

    soundUP() {
    if ( !this.muted && this.backgroundMusic) {
        if (this.backgroundMusic.volume < 1.0) {
            const newVolume = Math.min(1, this.backgroundMusic.volume + 0.1);
            this.backgroundMusic.volume = newVolume;
        }
    }
}

    sounddown() {
        if (!this.muted && this.backgroundMusic) {
            if (this.backgroundMusic.volume > 0.1) {
                const newVolume = Math.min(1, this.backgroundMusic.volume - 0.1);
                this.backgroundMusic.volume = newVolume;
            }
        }
    }

    mute(muted) {
    const muteSound = new Audio("/static/music/discord-notification.mp3");
    muteSound.play();

    this.muted = muted;
    if (this.muted) {
        this.setVolume(0);
    } else {
        this.setVolume(1);

    }
    //this.muted = !this.muted;
    }
}


export const soundManager = new GameSoundManager();
//soundManager.playBackgroundMusic();
document.addEventListener('DOMContentLoaded', function() {
    //const soundManager = new GameSoundManager();


    const baseSoundSrc = "/static/music/discord-notification.mp3";
    const volume = 0.5; //volume van the buttons


    const soundButtons = document.querySelectorAll('.sound-image-button');

    // Loop through each button and add the sound
    soundButtons.forEach((button) => {
        soundManager.addSoundButton(button, baseSoundSrc, volume);
    });

    soundManager.setBackgroundMusic("/static/music/Peach.mp3");


    //const playBackgroundMusicButton = document.getElementById('playBackgroundMusicButton');


    document.getElementById('soundup').addEventListener('click', () => {
        soundManager.soundUP();
    });

    document.getElementById('sounddown').addEventListener('click', () => {
        soundManager.sounddown();
    });

});
