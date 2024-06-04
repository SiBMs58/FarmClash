



//____________________ Sound ____________________//
if (localStorage.getItem('backsoundButtonState') === null) {
    // If not, set the default settings (sound off)
    localStorage.setItem('backsoundButtonState', 'slider_off.png');
    localStorage.setItem('muteButtonState', 'sound_btn.png');
}
localStorage.getItem('muteButtonState')
localStorage.getItem('backsoundButtonState')




//____________________ Button pressed ____________________//
let clickedResourceButton = false;
let clickedAnimalButton = false;
let ignoreClickedButton = false;



//____________________ Resources and Animals ____________________//
let resources = {}
resources.crops = [["Wheat",0], ["Carrot",0], ["Corn",0], ["Lettuce",0], ["Tomato",0], ["Turnip",0], ["Zucchini",0], ["Parsnip",0], ["Cauliflower",0], ["Eggplant",0]];
resources.money = 0;
let animals = [["Cow",0], ["Chicken",0], ["Pig",0], ["Goat",0]];





//____________________ find resource and animal index ____________________//
/**
 * Finds the index of a specific crop in the resources.crops array.
 * @param {string} resource - The name of the crop to find.
 * @returns {number} - The index of the crop in the resources.crops array, or -1 if the crop is not found.
 */
function findCrop(resource){
    for (let i = 0; i < resources.crops.length; i++) {
        if (resources.crops[i][0] === resource){
            return i;
        }
    }
    return -1;
}
/**
 * Finds the index of a specific animal in the animals array.
 * @param {string} animal - The name of the animal to find.
 * @returns {number} - The index of the animal in the animals array, or -1 if the animal is not found.
 */
function findAnimal(animal){
    for (let i = 0; i < animals.length; i++) {
        if (animals[i][0] === animal){
            return i;
        }
    }
    return -1;
}




//____________________ UPDATE UI ____________________//
/**
 * Updates the user interface at a set interval.
 * It fetches the crops and money data, then updates the money display.
 * If the resource button has been clicked, it also updates the crop display.
 * If there is an error in fetching resources, it logs the error.
 */
function scheduleUpdateUI(updateInterval = 10000) {
    setInterval(() => {
        updateUI()
    }, updateInterval);
}

/**
 * Updates the user interface by updating crops, money, and animals.
 * @export
 */
export function updateUI(){
    ignoreClickedButton = true;
    updateCropsAndMoney();
    updateAnimals()
    ignoreClickedButton = false;
}

/**
 * Updates the animals if the animal button is clicked or if the button click is ignored.
 * It fetches the animals, then updates the animal display.
 * If there is an error in fetching animals, it logs the error.
 */
function updateAnimals(){
    if(clickedAnimalButton || ignoreClickedButton) {
        fetchAnimals().then(() => {
            displayAnimals();
        }).catch(error => {
            console.error('Error fetching animals:', error);
        });
    }
}

/**
 * Updates the crops and money.
 * It fetches the crops and money data, then updates the money display.
 * If the resource button is clicked or if the button click is ignored, it also updates the crop display.
 * If there is an error in fetching resources, it logs the error.
 */
function updateCropsAndMoney(){
    if(clickedResourceButton || ignoreClickedButton){
        fetchCropsAndMoney().then(() => {
            displayMoney();
            displayCrops();
        }).catch(error => {
            console.error('Error fetching resources:', error);
        });
    }
}





//____________________ Event listener ____________________//
/**
 * This event listener is triggered when the DOM is fully loaded.
 * It sets the ignoreClickedButton to true, updates the UI, and sets the ignoreClickedButton back to false.
 * It also adds click event listeners to the "animal-btn" and "resource-btn" buttons.
 * When the "animal-btn" is clicked, it toggles the clickedAnimalButton state, updates the animals, and updates the display of the 'animal-overlay' and the image of the 'animal-btn'.
 * When the "resource-btn" is clicked, it toggles the clickedResourceButton state, updates the crops and money, and updates the display of the 'resource-overlay' and the image of the 'resource-btn'.
 */
document.addEventListener("DOMContentLoaded", function() {
    ignoreClickedButton = true;
    updateUI();
    ignoreClickedButton = false;

    /**
     * This event listener is triggered when the "animal-btn" is clicked.
     * It toggles the clickedAnimalButton state, updates the animals, and updates the display of the 'animal-overlay' and the image of the 'animal-btn'.
     */
    document.getElementById("animal-btn").addEventListener("click", function() {
        clickedAnimalButton = !clickedAnimalButton;
        updateAnimals();

        document.getElementById('animal-overlay').style.display = clickedAnimalButton ? 'flex' : 'none';
        document.getElementById('animal-btn').querySelector('img').src = clickedAnimalButton ? "../static/img/UI/paw_pbtn.png" : "../static/img/UI/paw_btn.png";
    });

    /**
     * This event listener is triggered when the "resource-btn" is clicked.
     * It toggles the clickedResourceButton state, updates the crops and money, and updates the display of the 'resource-overlay' and the image of the 'resource-btn'.
     */
    document.getElementById("resource-btn").addEventListener("click", function() {
        clickedResourceButton = !clickedResourceButton;
        updateCropsAndMoney();

        document.getElementById('resource-overlay').style.display = clickedResourceButton ? 'flex' : 'none';
        document.getElementById('resource-btn').querySelector('img').src = clickedResourceButton ? "../static/img/UI/resource_pbtn.png": "../static/img/UI/resource_btn.png";
    });
});





//____________________ API Requests ____________________//
/**
 * Fetches the crops and money data from the server.
 * It sends a GET request to the '/api/resources' endpoint and processes the response.
 * For each resource in the response, it finds the corresponding crop in the resources.crops array and updates its amount.
 * If the resource type is 'Money', it updates the resources.money variable.
 * If an error occurs during the fetch operation, it logs the error and displays an error message in the '.popup' element.
 * @returns {Promise} - A promise that resolves when the fetch operation is complete.
 */
function fetchCropsAndMoney(){
    return fetch('/api/resources').then(response => response.json())
        .then(data => {
            data.forEach((resource) => {
                let cropI = findCrop(resource.resource_type);
                if (resource.resource_type === 'Money'){
                    resources.money = resource.amount;
                }else if (cropI !== -1){
                    resources.crops[cropI][1] = resource.amount;
                }
            });
        }).catch(error => {
            console.error('Error fetching resources:', error);
            document.querySelector('.popup').innerHTML = `<p>Error fetching resources. Please try again later.</p>`;
        });
}

/**
 * Fetches the animals data from the server.
 * It sends a GET request to the '/api/animals' endpoint and processes the response.
 * For each animal in the response, it finds the corresponding animal in the animals array and updates its amount.
 * If an error occurs during the fetch operation, it logs the error and displays an error message in the '.animal-popup' element.
 * @returns {Promise} - A promise that resolves when the fetch operation is complete.
 */
function fetchAnimals(){
    return fetch('/api/animals').then(response => response.json())
        .then(data => {
            data.forEach((animal) => {
                const index = findAnimal(animal.species);
                if (index !== -1){
                    animals[index][1] = animal.amount;
                }
            });
        }).catch(error => {
            console.error('Error fetching animals:', error);
            document.querySelector('.animal-popup').innerHTML = `<p>Error fetching animals. Please try again later.</p>`;
        });
}





//____________________ Display functions ____________________//
/**
 * Displays the current amount of money in the user interface.
 * It constructs an HTML string with the amount of money and the appropriate images, then sets the innerHTML of the '.money-display' element to this string.
 */
function displayMoney() {
    document.querySelector('.money-display').innerHTML =
        '<img src="../../static/img/UI/display.left.short.png" alt="" draggable="false">' +
        amountToDisplayImage(resources.money, 'money') +
        '<img src="../../static/img/UI/display.money.right.png" alt="🪙" draggable="false">';
}

/**
 * Displays the current amount of each animal in the user interface.
 * It constructs an HTML string with the amount of each animal and the appropriate images, then sets the innerHTML of the '.animal-popup' element to this string.
 */
function displayAnimals() {
    const popupDiv = document.querySelector('.animal-popup');
    let animalHTML = '<img src="../../static/img/UI/display.left.short.png" alt="" draggable="false">';
    for (let i = 0; i < animals.length; i++) {
        animalHTML += amountToDisplayImage(animals[i][1], animals[i][0])
        animalHTML += `<img src="../../static/img/UI/display.${animals[i][0]}.png" alt="" draggable="false">`;
        if (i < animals.length - 1) {
            animalHTML += '<img src="../../static/img/UI/display.extender.png" alt=" " draggable="false">'.repeat(5);
        }
    }
    animalHTML += '<img src="../../static/img/UI/display.right.short.png" alt="" draggable="false">'
    popupDiv.innerHTML = animalHTML;
}

/**
 * Displays the current amount of each crop in the user interface.
 * It constructs an HTML string with the amount of each crop and the appropriate images, then sets the innerHTML of the '.popup' element to this string.
 */
function displayCrops() {
    // Build the HTML display for the crops
    let resourceHTML = '<img src="../../static/img/UI/display.left.short.png" alt="" draggable="false">';
    for (let i = 0; i < resources.crops.length; i++) {
        resourceHTML += amountToDisplayImage(resources.crops[i][1], resources.crops[i][0]);
        resourceHTML += cropToDisplayImage(resources.crops[i][0]);
        if (i < resources.crops.length - 1) {
            resourceHTML += '<img src="../../static/img/UI/display.extender.png" alt=" " draggable="false">'.repeat(5);
        }
    }
    resourceHTML += '<img src="../../static/img/UI/display.right.short.png" alt="" draggable="false">';
    document.querySelector('.popup').innerHTML = resourceHTML;
}






//____________________ to Image Translator functions ____________________//
/**
 * Displays the current amount of each crop in the user interface.
 * It constructs an HTML string with the amount of each crop and the appropriate images, then sets the innerHTML of the '.popup' element to this string.
 */
function cropToDisplayImage(crop) {
    switch (crop) {
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

/**
 * Translates the amount of a resource to its corresponding image for display.
 * If the amount is greater than 9999 and the resource type is not 'money', it returns the image for 9999 and a '+' sign.
 * @param {number} amount - The amount of the resource.
 * @param {string} resourceType - The type of the resource.
 * @returns {string} - The HTML string of the images corresponding to the amount.
 */
function amountToDisplayImage(amount, resourceType){
    let value = amount.toString();
    if(amount > 9999 && resourceType !== 'money'){
        return `<img src="../../static/img/UI/display.9.png" alt="9" draggable="false">`.repeat(4)
            +`<img src="../../static/img/UI/display.+.png" alt="." draggable="false">`;
    }
    let HTML = ''
    for (let i = 0; i < value.length; i++) {
        HTML += `<img src="../../static/img/UI/display.${value[i]}.png" alt="${value[i]}" draggable="false">`;
    }
    return HTML
}


