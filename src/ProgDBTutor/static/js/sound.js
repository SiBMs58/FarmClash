

//TODO: autoloop restriction wegdoen
class SoundManager {
    constructor() {
        this.backgroundMusic = null;
        this.soundEffects = {};
    }

    setBackgroundMusic(soundSrc) {
        if (this.backgroundMusic) {
            this.backgroundMusic.stop();
        }
        this.backgroundMusic = new Howl({
            src: ['Colorful-Flowers(chosic.com).mp3'],
            loop: true,
            volume: 0.5 // Adjust volume as needed
        });
        this.backgroundMusic.play();
    }

    addSoundEffect(soundName, soundSrc) {
        this.soundEffects[soundName] = new Howl({
            src: [soundSrc]
        });
    }

    playSoundEffect(soundName) {
        const soundEffect = this.soundEffects[soundName];
        if (soundEffect) {
            soundEffect.play();
        }
    }
}

//TODO: buttons plays without debug
//TODO: implmeent other buttons  sound
class SoundImageButton {
    constructor(imageElement, soundSrc, soundManager) {
        this.imageElement = imageElement;
        this.soundManager = soundManager;
        this.sound = new Audio(soundSrc);
        this.setup();
    }

   setup() {
        this.imageElement.addEventListener('click', () => {
            this.sound.play();
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const soundManager = new SoundManager();

    // Set background music
    soundManager.setBackgroundMusic('Colorful-Flowers(chosic.com).mp3');

    // Add sound effects
    soundManager.addSoundEffect('sound1', 'sound1.mp3');
    soundManager.addSoundEffect('discordNotification', 'discord-notification.mp3');

    // Create instances of SoundImageButton for each image button
    const imageButtons = document.querySelectorAll('.sound-image-button');
    imageButtons.forEach(button => {
        const soundSrc = button.dataset.soundSrc;
        new SoundImageButton(button, soundSrc, soundManager);
    });
});