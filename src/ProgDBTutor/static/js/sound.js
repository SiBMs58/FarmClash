//TODO: sounds in a different directory
//TODO: sounds werken in normal mode
//TODO zoom functie
//TODO: Howler gebruiken ???


 class GameSoundManager {
    constructor() {
        this.soundButtons = [];
        this.backgroundMusic = null;
        this.muted = false;
    }

    addSoundButton(imageElement, soundSrc, volume = 1) {

        fetch(soundSrc)
        .then(response => response.blob()) // Haal het geluidsbestand op als een blob
        .then(blob => {
            const sound = new Audio(URL.createObjectURL(blob)); // Maak een URL van de blob en gebruik dit als bron voor de Audio
            sound.volume = volume;
            sound.crossOrigin = "anonymous";

            const soundButton = {
                imageElement: imageElement,
                sound: sound,
                volume: volume
            };
            this.soundButtons.push(soundButton);

            imageElement.addEventListener('click', () => {
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

    playBackgroundMusic() {
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

    buttonplay(){
        const but = new Audio("/static/music/discord-notification.mp3");
        but.play();

    }

    mute() {
    const muteSound = new Audio("/static/music/discord-notification.mp3");
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


    const soundButton1 = document.querySelector('.sound-image-button1');
    soundManager.addSoundButton(soundButton1, "/static/music/discord-notification.mp3", 0.7);

    const soundButton2 = document.querySelector('.sound-image-button2');
    soundManager.addSoundButton(soundButton2, "/static/music/discord-notification.mp3", 0.7);

    const soundButton3 = document.querySelector('.sound-image-button3');
    soundManager.addSoundButton(soundButton3, "/static/music/discord-notification.mp3", 0.7);

    const soundButton4 = document.querySelector('.sound-image-button4');
    soundManager.addSoundButton(soundButton4, "/static/music/discord-notification.mp3", 0.7);

    const soundButton5 = document.querySelector('.sound-image-button5');
    soundManager.addSoundButton(soundButton5, "/static/music/discord-notification.mp3", 0.7);

     const soundButton6 = document.querySelector('.sound-image-button6');
    soundManager.addSoundButton(soundButton6, "/static/music/discord-notification.mp3", 0.7);

    // Adjust volume for buttons algemeen
    //soundManager.setVolume(0.1);


    soundManager.setBackgroundMusic("/static/music/sound1.mp3");

    const playBackgroundMusicButton = document.getElementById('playBackgroundMusicButton');
   // const stopBackgroundMusicButton = document.getElementById('playBackgroundMusicButton');

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

    document.getElementById('sounddown').addEventListener('click', () => {
        soundManager.buttonplay();
    });

    //document.querySelector('.sound-image-button1').addEventListener('click', () => {
        //soundManager.buttonplay();
   // });
});








// adjust every button with its own music or all buttons with the same => one function but specify music in html
/*
document.addEventListener('DOMContentLoaded', function() {
    // Create instances of SoundImageButton for each image button
    const imageButtons = document.querySelectorAll('.music-image-button');
    imageButtons.forEach(button => {
        const soundSrc = button.dataset.soundSrc;
        const volume = parseFloat(button.dataset.volume) || 1; // Default volume is 1 if not specified
        new SoundImageButton(button, soundSrc, volume);
    });
});
*/