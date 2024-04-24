//TODO: sounds in a different directory
//TODO: sounds werken in normal mode
//TODO zoom functie
//TODO: Howler gebruiken ???

//const baseURL = 'http://192.168.0.224:5000/src/ProgDBTutor/static/js';

class GameSoundManager {
    constructor() {
        this.soundButtons = [];
        this.backgroundMusic = null;
        this.muted = false;
    }

    addSoundButton(imageElement, soundSrc, volume = 1) {
       //const sound = new Audio(soundSrc);
       soundSrc.volume = volume;
       // sound.crossOrigin = "anonymous";

        const soundButton = {
            imageElement: imageElement,
            sound: soundSrc,
            volume: volume
        };
        this.soundButtons.push(soundButton);

        imageElement.addEventListener('click', () => {
            if (!this.muted) {
                soundSrc.play();
            }
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

    playBackgroundMusic() {
        if (!this.muted && this.backgroundMusic) {
            this.backgroundMusic.play();
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


    mute() {
    const muteSound = new Audio('discord-notification.mp3');
    muteSound.play();

    if (!this.muted) {
        this.setVolume(0);
    } else {
        this.setVolume(1);
    }
    this.muted = !this.muted;
    }
}


document.addEventListener('DOMContentLoaded', function() {
    const soundManager = new GameSoundManager();

/*
    const soundButton1 = document.querySelector('.sound-image-button1');
    var audio = new Audio();
    var scripts = document.getElementsByTagName('script');
    var currentScript = scripts[scripts.length - 1];
    var scriptSource = currentScript.src;
    var scriptDir = scriptSource.substring(0, scriptSource.lastIndexOf('/'));
    audio.src = scriptDir + '/discord-notification.mp3';
    soundManager.addSoundButton(soundButton1, audio , 0.7);
    soundManager.setVolume(0.1);
    console.log("Audio source:", audio); // Log the audio source for debugging

     */

    const soundButton1 = document.querySelector('.sound-image-button1');
    soundManager.addSoundButton(soundButton1, 'discord-notification.mp3', 0.7);

    const soundButton2 = document.querySelector('.sound-image-button2');
    soundManager.addSoundButton(soundButton2, 'discord-notification.mp3', 0.7);

    const soundButton3 = document.querySelector('.sound-image-button3');
    soundManager.addSoundButton(soundButton3, 'discord-notification.mp3', 0.7);

    const soundButton4 = document.querySelector('.sound-image-button4');
    soundManager.addSoundButton(soundButton4, 'discord-notification.mp3', 0.7);

    const soundButton5 = document.querySelector('.sound-image-button5');
    soundManager.addSoundButton(soundButton5, 'discord-notification.mp3', 0.7);

     const soundButton6 = document.querySelector('.sound-image-button6');
    soundManager.addSoundButton(soundButton6, 'discord-notification.mp3', 0.7);

    // Adjust volume for buttons algemeen
    //soundManager.setVolume(0.1);


    soundManager.setBackgroundMusic('sound1.mp3');

    const playBackgroundMusicButton = document.getElementById('playBackgroundMusicButton');

    playBackgroundMusicButton.addEventListener('click', () => {
        soundManager.playBackgroundMusic();
    });


    // Mute sounds
    document.getElementById('muteButton').addEventListener('click', () => {
        soundManager.mute();
    });

    document.getElementById('soundup').addEventListener('click', () => {
        soundManager.soundUP();
    });

    document.getElementById('sounddown').addEventListener('click', () => {
        soundManager.sounddown();
    });
});







// adjust every button with its own sound or all buttons with the same => one function but specify music in html
/*
document.addEventListener('DOMContentLoaded', function() {
    // Create instances of SoundImageButton for each image button
    const imageButtons = document.querySelectorAll('.sound-image-button');
    imageButtons.forEach(button => {
        const soundSrc = button.dataset.soundSrc;
        const volume = parseFloat(button.dataset.volume) || 1; // Default volume is 1 if not specified
        new SoundImageButton(button, soundSrc, volume);
    });
});
*/