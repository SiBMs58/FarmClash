let resources = {}
resources.crops = [["Wheat",0], ["Carrot",0], ["Corn",0], ["Lettuce",0], ["Tomato",0], ["Turnip",0], ["Zucchini",0], ["Parsnip",0], ["Cauliflower",0], ["Eggplant",0]];
resources.money = 0;
let animals = [["Cow",0], ["Chicken",0], ["Pig",0], ["Goat",0]];

let clickedResourceButton = false;
let clickedAnimalButton = false;

function scheduleMoneyUpdates() {
    setInterval(() => {
        fetchCropsAndMoney()
            .then(() => {
                updateMoneyDisplay();
            })
            .catch(error => {
                console.error('Error fetching resources:', error);
            });
    }, 250);
}

if (localStorage.getItem('backsoundButtonState') === null) {
        // If not, set the default settings (sound off)
        localStorage.setItem('backsoundButtonState', 'slider_off.png');
        localStorage.setItem('muteButtonState', 'sound_btn.png');
    }
        localStorage.getItem('muteButtonState')
        localStorage.getItem('backsoundButtonState')


document.addEventListener("DOMContentLoaded", function() {
    fetchCropsAndMoney().then(() => {
        updateMoneyDisplay();
        updateCropDisplay();
    })
    fetchAnimals().then(() => {
        updateAnimalDisplay();
    })
    scheduleMoneyUpdates();
    document.getElementById("animal-btn").addEventListener("click", function() {
        if (!clickedAnimalButton) {
             fetchAnimals().then(() => {
                 updateAnimalDisplay();
             })
        }

        const animalButton = document.getElementById('animal-btn');
        const animalOverlay = document.getElementById('animal-overlay');

        animalOverlay.style.display = clickedAnimalButton ? 'none' : 'flex';
        animalButton.querySelector('img').src = clickedAnimalButton ? "../static/img/UI/paw_btn.png" : "../static/img/UI/paw_pbtn.png";
        clickedAnimalButton = !clickedAnimalButton;
    });

    document.getElementById("resource-btn").addEventListener("click", function() {
        if (!clickedResourceButton) {
            fetchCropsAndMoney().then(() => {
                updateMoneyDisplay();
                updateCropDisplay();
            });
        }

        const resourceButton = document.getElementById('resource-btn');
        const overlay = document.getElementById('resource-overlay');

        overlay.style.display = clickedResourceButton ? 'none' : 'flex';
        resourceButton.querySelector('img').src = clickedResourceButton ? "../static/img/UI/resource_btn.png" : "../static/img/UI/resource_pbtn.png";
        clickedResourceButton = !clickedResourceButton;
    });
});



function fetchCropsAndMoney(){
    return fetch('/api/resources')
        .then(response => response.json())
        .then(data => {
            data.forEach((resource) => {
                let cropI = findCrop(resource.resource_type);
                if (resource.resource_type === 'Money'){
                    resources.money = resource.amount;
                }else if (cropI !== -1){
                    resources.crops[cropI][1] = resource.amount;
                }
            });
        })
        .catch(error => {
            console.error('Error fetching resources:', error);
            document.querySelector('.popup').innerHTML = `<p>Error fetching resources. Please try again later.</p>`;
        });
}
function fetchAnimals(){
    return fetch('/api/animals')
        .then(response => response.json())
        .then(data => {
            data.forEach((animal) => {
                const index = findAnimal(animal.species);
                if (index !== -1){
                    animals[index][1] = animal.amount;
                }
            });
        })
        .catch(error => {
            console.error('Error fetching animals:', error);
        });
}


function updateMoneyDisplay() {
    const moneyDisplay = document.querySelector('.money-display');

    if (moneyDisplay) {
        moneyDisplay.innerHTML = '<img src="../../static/img/UI/display.left.short.png" alt="" draggable="false">';
        moneyDisplay.innerHTML += getAmountDisplay(resources.money, 'money');
        moneyDisplay.innerHTML += '<img src="../../static/img/UI/display.money.right.png" alt="🪙" draggable="false">'
    }
}
function updateAnimalDisplay() {
    const popupDiv = document.querySelector('.animal-popup');
    let animalHTML = '<img src="../../static/img/UI/display.left.short.png" alt="" draggable="false">';
    for (let i = 0; i < animals.length; i++) {
        animalHTML += getAmountDisplay(animals[i][1], animals[i][0])
        animalHTML += `<img src="../../static/img/UI/display.${animals[i][0]}.png" alt="" draggable="false">`;
        if (i < animals.length - 1) {
            animalHTML += '<img src="../../static/img/UI/display.extender.png" alt=" " draggable="false">'.repeat(5);
        }
    }
    animalHTML += '<img src="../../static/img/UI/display.right.short.png" alt="" draggable="false">'
    popupDiv.innerHTML = animalHTML;
}
function updateCropDisplay() {
    const popupDiv = document.querySelector('.popup');
    let resourceHTML = '<img src="../../static/img/UI/display.left.short.png" alt="" draggable="false">';
    for (let i = 0; i < resources.crops.length; i++) {
        resourceHTML += getAmountDisplay(resources.crops[i][1], resources.crops[i][0])
        resourceHTML += getCropDisplay(resources.crops[i][0]);
        if (i < resources.crops.length - 1) {
            resourceHTML += '<img src="../../static/img/UI/display.extender.png" alt=" " draggable="false">'.repeat(5);
        }
    }
    resourceHTML += '<img src="../../static/img/UI/display.right.short.png" alt="" draggable="false">'
    popupDiv.innerHTML = resourceHTML;
}




function getCropDisplay(resourceType) {
    switch (resourceType) {
        case 'Corn':
            return '<img src="../../static/img/UI/display.corn.png" alt="🌽" draggable="false">';
        case 'Carrot':
            return '<img src="../../static/img/UI/display.carrot.png" alt="🥕" draggable="false">';
        case 'Cauliflower':
            return '<img src="../../static/img/UI/display.cauliflower.png" alt="⚪🥦" draggable="false">';
        case 'Tomato':
            return '<img src="../../static/img/UI/display.tomato.png" alt="🍅" draggable="false">';
        case 'Eggplant':
            return '<img src="../../static/img/UI/display.eggplant.png" alt="🍆" draggable="false">';
        case 'Lettuce':
            return '<img src="../../static/img/UI/display.lettuce.png" alt="🥬" draggable="false">';
        case 'Wheat':
            return '<img src="../../static/img/UI/display.wheat.png" alt="🌾" draggable="false">';
        case 'Turnip':
            return '<img src="../../static/img/UI/display.turnip.png" alt="🟣🌱" draggable="false">';
        case 'Parsnip':
            return '<img src="../../static/img/UI/display.parsnip.png" alt="⚪🌱" draggable="false">';
        case 'Zucchini':
            return '<img src="../../static/img/UI/display.zucchini.png" alt="🥒" draggable="false">';
        default:
            return '';
    }
}
function getAmountDisplay(amount, type){
    let value = amount.toString();

    let HTML = ''
    for (let i = 0; i < value.length; i++) {
        if(i === 4 && type !== 'money'){
            HTML += `<img src="../../static/img/UI/display.+.png" alt="." draggable="false">`;
            break;
        }
        HTML += `<img src="../../static/img/UI/display.${value[i]}.png" alt="${value[i]}" draggable="false">`;
    }
    return HTML
}
function findCrop(resource){
    for (let i = 0; i < resources.crops.length; i++) {
        if (resources.crops[i][0] === resource){
            return i;
        }
    }
    return -1;
}
function findAnimal(animal){
    for (let i = 0; i < animals.length; i++) {
        if (animals[i][0] === animal){
            return i;
        }
    }
    return -1;
}