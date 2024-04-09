//TODO: functionaliteit zoomen toevogen
//TODO: functionaliteit sound toevogen



let zoomNumber = document.getElementById("zoomNumber");
let countZoom = 0;

function zoomUpPrecent(){
    countZoom += 20;
    zoomNumber.innerText = countZoom;

}
function zoomDownPrecent(){
     countZoom -= 20;
    zoomNumber.innerText = countZoom;

}

let soundNumber = document.getElementById("soundNumber");
let countSound = 0;

function soundDown(){
    countSound -= 1;
    soundNumber.innerText = countSound;

}
function soundUp(){
     countSound += 1;
    soundNumber.innerText = countSound;

}