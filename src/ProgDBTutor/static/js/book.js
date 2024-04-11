function rotateToBack(elem) {
    const frontContent = elem.querySelector('.front');
    const backContent = elem.querySelector('.back');

    // Voer animatie uit om naar achterkant te draaien
    elem.style.animation = 'rotateToBack 0.5s forwards';

    let z = getComputedStyle(elem).zIndex;
    if(z === '' || isNaN(z)) {
        z = 2; // Stel een beginwaarde in als de z-index leeg is of niet-numeriek is
    } else {
        z = parseInt(z); // Converteer de huidige z-index naar een getal
    }

    if(z > 2) {
        z -= 2;
        elem.style.zIndex = z;
    }
    else if(z < 2) {
        z += 2;
        elem.style.zIndex = z;
    }
}

function rotateToFront(elem){
    const frontContent = elem.querySelector('.front');
    const backContent = elem.querySelector('.back');

    // Voer animatie uit om naar voorkant te draaien
    elem.style.animation = 'rotateToFront 0.5s forwards';

    let z = getComputedStyle(elem).zIndex;
    if(z === '' || isNaN(z)) {
        z = 2; // Stel een beginwaarde in als de z-index leeg is of niet-numeriek is
    } else {
        z = parseInt(z); // Converteer de huidige z-index naar een getal
    }

    if(z > 2) {
        z -= 2;
        elem.style.zIndex = z;
    }
    else if(z < 2) {
        z += 2;
        elem.style.zIndex = z;
    }
}
