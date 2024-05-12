
//TODO: img => img button maken + music werkr met dat!!
//TODO buttons moeten juist werken met aan en uit juiste click  !!
//TODO zoom functie






 class GameSoundManager {
    constructor() {
        this.soundButtons = [];
        this.backgroundMusic = null;
        this.muted = false;
    }

    addSoundButton(imageElement, soundSrc, volume = 1) {

        fetch(soundSrc)
        .then(response => response.blob())
        .then(blob => {
            const sound = new Audio(URL.createObjectURL(blob));
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


const soundManager = new GameSoundManager();
soundManager.playBackgroundMusic();
document.addEventListener('DOMContentLoaded', function() {
    //const soundManager = new GameSoundManager();

    const baseSoundSrc = "/static/music/discord-notification.mp3";
    const volume = 0.7;

    // Define the number of sound buttons
    const numButtons = 6;

    // Iterate over the range of buttons and add each one
    for (let i = 1; i <= numButtons; i++) {
        const soundButtonClass = `.sound-image-button${i}`;
        const soundButton = document.querySelector(soundButtonClass);
        if (soundButton) {
            soundManager.addSoundButton(soundButton, baseSoundSrc, volume);
        } else {
            console.error(`Button with class ${soundButtonClass} not found.`);
        }
    }

    soundManager.setBackgroundMusic("/static/music/Peach.mp3");
    soundManager.playBackgroundMusic();

    const playBackgroundMusicButton = document.getElementById('playBackgroundMusicButton');
    let isBackgroundMusicPlaying = false;

    playBackgroundMusicButton.addEventListener('click', () => {
        if (!isBackgroundMusicPlaying) {
            soundManager.playBackgroundMusic();
            isBackgroundMusicPlaying = true;
        } else {
            soundManager.stopBackgroundMusic();
            isBackgroundMusicPlaying = false;
        }
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
