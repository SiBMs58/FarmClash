//______________________ GLOBAL VARIABLES ______________________//
const Barn = {};
Barn.quantities = [0, 0, 0, 0];
Barn.intervals = new Array(4).fill(null);
Barn.animals = ["Chicken", "Cow", "Pig", "Goat"];
const animalPerks = {
    Chicken: [
        ["Increased yield of eggs if found.", 10],
        ["Increased amount of crops if found.", 35],
        ["Increased spread of amount of crops if found.", 15],
        ["Chance of higher rarity of animal product.", 5],
        ["chance of getting home safe.", -5]
    ],
    Cow: [
        ["Increased yield of milk if found.", 10],
        ["Brings more resources on average.", 25],
        ["chance to bring coins.", 5],
        ["chance to bring a box.", -10]
    ],
    Pig: [
        ["Increased chances of truffles.", 10],
        ["Higher rarity of craft resources.", 15],
        ["Higher amount of craft resources.", 35],
        ["Higher chance of empty boxes.", -15]
    ],
    Goat: [
        ["Increased chances of wool.", 10],
        ["Has a chance to bring 2 boxes.", 10],
        ["Has a small chance to bring 3 boxes.", 5],
        ["Brings lower resources on average.", -5]
    ]
};
let exploration = {
    remaining_time: -1,
    ongoing: false,
    owner: '',
    chickens: 0,
    goats: 0,
    pigs: 0,
    cows: self.cows,
    exploration_level: 1,
    augment_level: 0,
    started_at: null,
    duration: 1,
    surviving_goats: 0,
    rewards_of_goats: 0,
    surviving_pigs: 0,
    surviving_cows: 0,
    rewards_of_cows: 0,
    surviving_chickens: 0,
    base_rewards: 0,
};
let buildingLevel = 1;
let buildingAugmentLevel = 0;
let numCrates = 0;
let crateImage = []
let rewards = {};










//______________________ PAGE INITIALIZATION ______________________//
initialize();
/**
 * Handles the exploration status by fetching exploration data from the API,
 * checking if there's an ongoing exploration, and displaying it if available,
 * otherwise fetches animal quantities from the API.
 */
function initialize() {
    fetchExplorationFromAPI()
        .then(() => {
            fetchAnimalQuantity();
            fetchBuildingBayStats();
            if (exploration.ongoing){
                const startTime = new Date(exploration.started_at);
                const currentTime = new Date();
                const elapsed = (currentTime - startTime) / (1000 * 60);
                exploration.remaining_time = Math.max(parseInt(exploration.duration) - elapsed, 0);
            }
            if(exploration.remaining_time === 0){
                numCrates = exploration.surviving_chickens + exploration.rewards_of_goats + exploration.surviving_pigs + exploration.rewards_of_cows + exploration.base_rewards;
                crateImage = Array.from({ length: numCrates }, () => 'Closedcrate');
            }
            displayStatus();
        })
        .catch(error => {
            console.error('Error handling exploration status:', error);
        });
}










//______________________ Display FUNCTIONS ______________________//
/**
 * Resets the button images and clears any ongoing incrementation intervals.
 * @param {HTMLButtonElement} button - The button element to reset.
 */
function reset(button) {
    clearInterval(Barn.intervals[getIndex(button.id.split('-')[1])]);

    if (button.id.startsWith('Decrease')) {
        button.querySelector('img').src = "../static/img/UI/minus_btn.png";
    } else if (button.id.startsWith('Increase')) {
        button.querySelector('img').src = "../static/img/UI/plus_btn.png";
    }
}
/**
 * Updates the display based on the current exploration status.
 *
 * This function retrieves the 'before-exploration', 'during-exploration', and 'after-exploration' div elements from the HTML document.
 * It then checks the remaining time of the current exploration.
 *
 * If the remaining time is zero, it hides the 'before-exploration' and 'during-exploration' divs and shows the 'after-exploration' div.
 * If the remaining time is greater than zero, it hides the 'before-exploration' and 'after-exploration' divs, shows the 'during-exploration' div, and updates its inner text to the remaining exploration time.
 * If there is no current exploration (remaining time is negative), it shows the 'before-exploration' div and hides the 'during-exploration' and 'after-exploration' divs.
 *
 * @function
 */
function displayStatus(){
    let preExplorationDiv = document.getElementById('before-exploration');
    let intraExplorationDiv = document.getElementById('during-exploration');
    let postExplorationDiv = document.getElementById('after-exploration');

    if (exploration.remaining_time === 0){
        preExplorationDiv.style.display = "none";
        intraExplorationDiv.style.display = "none";
        postExplorationDiv.style.display  = "block";
        displayCrates(numCrates, crateImage)
        displaySurvivors();

    }else if(exploration.remaining_time > 0){
        preExplorationDiv.style.display = "none";
        postExplorationDiv.style.display = "none";
        intraExplorationDiv.style.display = "flex";

        intraExplorationDiv.innerText = formatTime(exploration.remaining_time) + " left";

    } else {
        preExplorationDiv.style.display = "block";
        postExplorationDiv.style.display = "none";
        intraExplorationDiv.style.display = "none";
    }
}
function displayCrates(numCrates, crateImage) {
    const rewardsDiv = document.getElementById('rewards');
    const rows = 5; // Change as needed
    const cols = Math.ceil(numCrates / rows);

    for (let i = 0; i < numCrates; i++) {
        // Create an img element
        const img = document.createElement('img');
        img.src = '../static/img/exploring/rewards/'+crateImage[i]+'.png'; // Set the image source

        // Calculate grid position
        const row = Math.floor(i / cols); // Calculate the row index
        const col = i % cols; // Calculate the column index

        // Apply grid styles
        img.style.gridColumn = `${col + 1} / span 1`;
        img.style.gridRow = `${row + 1} / span 1`;

        // Append the image to the rewards div
        rewardsDiv.appendChild(img);
    }
    rewardsDiv.style.display = 'grid';
    rewardsDiv.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    rewardsDiv.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    rewardsDiv.style.display = 'grid';
    rewardsDiv.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    rewardsDiv.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
}
function displaySurvivors() {
    const survivorDiv = document.getElementById('animals');
    const animals = [
        { type: 'Chicken', quantity: exploration.surviving_chickens },
        { type: 'Goat', quantity: exploration.surviving_goats },
        { type: 'Pig', quantity: exploration.surviving_pigs },
        { type: 'Cow', quantity: exploration.surviving_cows }
    ];

    for (let i = 0; i < animals.length; i += 2) {
        const animalPairDiv = document.createElement('div'); // Create a div element for each pair of animals
        const animal1 = animals[i];
        const animal2 = animals[i + 1];

        let html = '';
        if (animal1) {
            html += `${animal1.quantity} x <img src="../../static/img/assets/animals/${animal1.type}/${animal1.type}.1.png" alt="${animal1.type}" title="${animal1.type}" draggable="false">`;
        }
        if (animal2) {
            html += `${animal2.quantity} x <img src="../../static/img/assets/animals/${animal2.type}/${animal2.type}.1.png" alt="${animal2.type}" title="${animal2.type}" draggable="false">`;
        }

        animalPairDiv.innerHTML = html;
        survivorDiv.appendChild(animalPairDiv); // Append the animalPairDiv to the survivorDiv
    }
}
function displayRewardItems(){
    const rewardsItemDiv = document.getElementById('reward-items');
    const imgLocation = '../../static/img/resources/';
    let typeLoc = {
        '': ['Money'],
        'crops/': ["Wheat", "Carrot", "Corn", "Lettuce", "Tomato", "Turnip", "Zucchini", "Parsnip", "Cauliflower", "Eggplant"],
        'raws/': ["Stick", "Plank", "Stone", "Ingot", "Log"],
        'animalproduct/': ['Egg', 'Rustic Egg', 'Crimson Egg', 'Emerald Egg', 'Sapphire Egg',
                    'Milk', 'Chocolate Milk','Strawberry Milk', 'Soy Milk', 'Blueberry Milk',
                    'Truffle', 'Bronze Truffle', 'Gold Truffle', 'Forest Truffle', 'Winter Truffle',
                    'Wool', 'Alpaca Wool', 'Cashmere Wool', 'Irish Wool', 'Dolphin Wool']
    }

    let img = '';
    let map = '';
    for (const reward in rewards) {
        for (const [key, value] of Object.entries(typeLoc)) {
            console.log(value)
            if (value.includes(reward)) {
                map = key;
                break;
            }
        }
        img = (reward === 'Money') ? 'Coin' : spaceTo_(reward);
        const div = document.createElement('div');
        div.innerHTML = `${rewards[reward]} x <img src=" ${imgLocation + map + img}.png" alt="${reward}" title="${reward}" draggable="false">`;
        rewardsItemDiv.appendChild(div);
    }
}
/**
 * Updates the list of perks based on the current selection of animals and exploration time.
 *
 * This function retrieves the current quantity of each animal and the selected exploration time from the HTML document.
 * It then calculates the risk chance based on the exploration time and updates the inner HTML of the perk list element.
 *
 * For each type of animal, if the quantity is greater than zero, it retrieves the perks for that animal and sorts them by chance in descending order.
 * It then creates a new div element for each perk, sets its inner text to the total chance and description of the perk, and appends it to the perk list element.
 *
 * Finally, it appends the risk chance to the perk list element.
 *
 * @function
 */
function updatePerkList() {
    let perkList = document.getElementById('perk-list');
    let Animals = {
        Chicken: parseInt(document.getElementById('Chicken').value),
        Cow: parseInt(document.getElementById('Cow').value),
        Pig: parseInt(document.getElementById('Pig').value),
        Goat: parseInt(document.getElementById('Goat').value)
    };

    let explorationTime = parseInt(document.getElementById('exploration-time').value);
    let riskChance = getRiskChance(explorationTime);

    perkList.innerHTML = "Perks:";

    for (let animal of Barn.animals) {
        let quantity = Animals[animal];
        if (quantity > 0) {
            let perks = animalPerks[animal];
            if (perks) {
                // Sort the perks by chance in descending order
                perks.sort((a, b) => b[1] - a[1]);

                // Loop through each perk and display it
                perks.forEach(perk => {
                    let totalChance = perk[1] * quantity;
                    // Adjust perk chance based on risk chance
                    let perkItem = document.createElement("div");
                    perkItem.innerText = `${totalChance}% - ${perk[0]}`;
                    perkList.appendChild(perkItem);
                });
            }
        }
    }
    // Display the risk chance
    perkList.innerHTML += "<br>Risk: " + riskChance + "%";
}









//______________________ API REQUESTS ________________________//
/**
 * Asynchronously fetches exploration data from the API.
 *
 * This function sends a GET request to the '/api/exploration' endpoint and processes the response.
 * If the response is successful and there is an ongoing exploration, the global 'exploration' variable is set to the received data.
 * If there is no ongoing exploration, 'exploration' remaining_time is set to negative and ongoing to false.
 * If the request fails for any reason, an error is logged to the console.
 *
 * @async
 * @function
 * @throws Will throw an error if the response from the API is not ok.
 */
async function fetchExplorationFromAPI() {
    try {
        const response = await fetch('/api/exploration');
        if (!response.ok) {
            throw new Error('Failed to fetch exploration data');
        }
        const data = await response.json();
        exploration = data.ongoing ? data : exploration;
    } catch (error) {
        console.error('Error fetching exploration:', error);
    }
}
/**
 * Asynchronously fetches the quantity of each animal from the server.
 *
 * This function sends a GET request to the '/api/animals' endpoint.
 * If the request is successful, it updates the 'Barn.quantities' array with the received quantities.
 * The index of each quantity in the array corresponds to the index of the animal in the 'Barn.animals' array.
 * If the request fails for any reason, an error is logged to the console.
 *
 * @async
 * @function
 * @throws Will throw an error if the response from the API is not ok.
 */
function fetchAnimalQuantity() {
    fetch('/api/animals')
    .then(response => response.json())
    .then(data => {
        data.forEach((animal) => {
            Barn.quantities[getIndex(animal.species)] = animal.amount;
        });
    })
    .catch(error => {
        console.error('Error fetching animals:', error);
    });
}
function fetchBuildingBayStats() {
    fetch('/api/fetch-building-information-by-type/Bay')
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            const buildings = data.building_information;
            const id = Object.keys(buildings)[0];
            const bay = buildings[id];
            buildingAugmentLevel = bay.augment_level;
            buildingLevel = bay.level;
            buildingLevel = 1; //TODO this is for debugging
        }
    })
    .catch(error => {
        console.error('Error fetching building information:', error);
    });
}
/**
 * Asynchronously sends the quantity of each animal to the server.
 *
 * This function retrieves the quantity of each animal from the corresponding input field in the HTML document.
 * It then creates an object with the update type and the quantities of each animal.
 * If the quantity of an animal is zero, the value for that animal in the object is set to [false].
 * If the quantity of an animal is not zero, the value for that animal in the object is set to [true, Barn.quantities[getIndex(Animal)] - numAnimal],
 * where Animal is the type of the animal and numAnimal is the number of that animal.
 *
 * The function then sends a POST request to the '/api/update-animals' endpoint with the created object as the body.
 * If the request is successful, it logs a success message to the console.
 * If the request fails, it logs an error message to the console.
 *
 * @async
 * @function
 * @throws Will throw an error if the response from the API is not ok.
 */
async function sendAnimalQuantity(numChickens, numGoats, numPigs, numCows) {
    let diffCows = Barn.quantities[getIndex('Cow')] + numCows;
    let diffPigs = Barn.quantities[getIndex('Pig')] + numPigs;
    let diffGoats = Barn.quantities[getIndex('Goat')] + numGoats;
    let diffChickens = Barn.quantities[getIndex('Chicken')] + numChickens;

    let animal_data = {
        'update_type': 'explore',
        'species':{
            'Chicken': numChickens === 0 ? [false] : [true, diffChickens],
            'Goat': numGoats === 0 ? [false] : [true, diffGoats],
            'Pig': numPigs === 0 ? [false] : [true, diffPigs],
            'Cow': numCows === 0 ? [false] : [true, diffCows],
        }
    };
    try {
        const response = await fetch('/api/update-animals', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(animal_data)
        });

        if (response.ok) {
            const jsonResponse = await response.json();
            console.log('Animals successfully removed from your farm:', jsonResponse);
        } else {
            console.error('Failed to remove animal from your farm:', response.status);
        }
    } catch (error) {
        console.error('Error occurred while removing animal from your farm:', error);
    }
}
/**
 * Asynchronously starts an exploration.
 *
 * This function constructs the URL for the exploration API endpoint and sends a POST request to it.
 * The global 'exploration' object is stringified and sent as the body of the request.
 *
 * If the request is successful, it logs a success message to the console along with the received data.
 * If the request fails, it logs an error message to the console along with the status code of the response.
 * If an error occurs while sending the request, it logs an error message to the console along with the error object.
 *
 * @async
 * @function
 * @throws Will throw an error if the response from the API is not ok.
 */
async function sendExploration() {
    const BASE_URL = `${window.location.protocol}//${window.location.host}`;
    const fetchLink = BASE_URL + "/exploration/start-exploration";
    try {
        const response = await fetch(fetchLink, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(exploration)
        });

        if (response.ok) {
            const jsonResponse = await response.json();
            console.log('Exploration started successfully:', jsonResponse);
        } else {
            console.error('Failed to start exploration:', response.status);
        }
    } catch (error) {
        console.error('Error occurred while starting exploration:', error);
    }
}
async function sendStopExploration() {
    const BASE_URL = `${window.location.protocol}//${window.location.host}`;
    const fetchLink = BASE_URL + "/exploration/stop-exploration";
    try {
        const response = await fetch(fetchLink, {
            method: 'POST'
        });

        if (response.ok) {
            const jsonResponse = await response.json();
            console.log('Exploration stopped successfully:', jsonResponse);
        } else {
            console.error('Failed to stop exploration:', response.status);
        }
    } catch (error) {
        console.error('Error occurred while stopping exploration:', error);
    }
}
async function sendResourceQuanity(){
    const BASE_URL = `${window.location.protocol}//${window.location.host}`;
    const fetchLink = BASE_URL + "/api/add-resources";
    try {
        const response = await fetch(fetchLink, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(rewards)
        });

        if (response.ok) {
            const jsonResponse = await response.json();
            console.log('Resources updated successfully:', jsonResponse);
        } else {
            console.error('Failed to update resources:', response.status);
        }
    } catch (error) {
        console.error('Error occurred while updating resources:', error);
    }
}







// ____________________ EVENT LISTENERS ____________________//
document.getElementById('continue-btn').addEventListener('click', function() {
    exploration.remaining_time = -1;
    displayStatus();
});

document.getElementById('open-btn').addEventListener('click', function() {
    sendStopExploration().then(() => {
        sendAnimalQuantity(exploration.surviving_chickens, exploration.surviving_goats, exploration.surviving_pigs, exploration.surviving_cows)
    }).then(() => {
            this.style.display = 'none';
            const continueBtn = document.getElementById('continue-btn');
            continueBtn.style.display = 'block';
            generateRewards();
            displayRewardItems();
            displayCrates(numCrates, crateImage);
    }).then(() => {
        sendResourceQuanity();
    });
});
/**
 * Event listener for the 'click' event on the 'explore-btn' element.
 *
 * This function is executed whenever the 'explore-btn' button is clicked.
 * It retrieves the selected exploration time from the 'exploration-time' dropdown and the quantity of each animal from the corresponding input fields.
 * If no exploration time is selected, it defaults to 20.
 * It then creates an 'exploration' object with the quantities of each animal, the exploration time, and the building level and augment level.
 *
 * The function then calls the 'sendExploration' and 'sendAnimalQuantity' functions to send the exploration data and the animal quantities to the server.
 * Finally, it calls the 'display' function to display the remaining exploration time.
 *
 * @async
 * @function
 * @listens click
 */
document.getElementById('explore-btn').addEventListener('click', async function () {
    let selectedTimeElement = document.getElementById('exploration-time');
    let selectedOption = selectedTimeElement.options[selectedTimeElement.selectedIndex];
    let exploreTime = selectedOption.value;
    if (!exploreTime) {
        exploreTime = 20;
    }
    exploration = {
        'chickens': parseInt(document.getElementById('Chicken').value),
        'goats': parseInt(document.getElementById('Goat').value),
        'pigs': parseInt(document.getElementById('Pig').value),
        'cows': parseInt(document.getElementById('Cow').value),
        'augment_level': buildingAugmentLevel,
        'exploration_level': buildingLevel,
        'remaining_time': parseInt(exploreTime)
    };
    await sendExploration();
    await sendAnimalQuantity(-exploration['chickens'], -exploration['goats'], -exploration['pigs'], -exploration['cows']);
    displayStatus(exploreTime)
});
/**
 * Adds 'input' event listeners to all input fields of type 'number'.
 *
 * This function selects all input fields of type 'number' and adds an 'input' event listener to each of them.
 * The event listener function is executed whenever the user inputs a value into the input field.
 *
 * The function retrieves the current input value and the type of the animal from the event target.
 * It then calculates the total number of animals selected by summing the values of all input fields of type 'number'.
 *
 * If the current input value is not a number or is less than zero, it sets the value of the input field to zero and updates the perk list.
 * If the total number of animals selected is greater than the building level, it adjusts the value of the input field to ensure that the total number of animals does not exceed the building level and updates the perk list.
 * If the current input value is greater than the maximum limit for the animal type, it sets the value of the input field to the maximum limit and updates the perk list.
 */
document.querySelectorAll('input[type="number"]').forEach(function(inputField) {
    inputField.addEventListener('input', function(event) {
        let currentInputValue = parseInt(event.target.value);
        let animalType = event.target.id;



        let index = Barn.animals.indexOf(animalType);
        let maxLimit = Barn.quantities[index];

        if (isNaN(currentInputValue) || currentInputValue < 0) {
            event.target.value = 0;
            updatePerkList();
            return;
        }
        if (currentInputValue > buildingLevel) {
            event.target.value = buildingLevel
            currentInputValue = parseInt(event.target.value);
        }
        if (currentInputValue > maxLimit) {
            event.target.value = maxLimit; // Set value to the maximum limit
        }
        let totalAnimals = 0;
        document.querySelectorAll('input[type="number"]').forEach(function(input) {
            totalAnimals += parseInt(input.value);
        });
        if(totalAnimals > buildingLevel){
            let difference = totalAnimals - buildingLevel;
            event.target.value = currentInputValue - difference;
        }
        updatePerkList();
    });
})
/**
 * Event listener for the 'change' event on the 'exploration-time' element.
 *
 * This function is executed whenever the value of the 'exploration-time' dropdown changes.
 * It calls the 'updatePerkList' function to update the list of perks based on the new exploration time.
 */
document.getElementById('exploration-time').addEventListener('change', function() {
    updatePerkList();
});
/**
 * Event listener for the DOMContentLoaded event.
 *
 * This function is executed once the DOM is fully loaded. It selects all buttons with IDs starting with 'Decrease' or 'Increase' and adds several event listeners to them.
 *
 * The 'mousedown' event listener checks if the button is a 'Decrease' or 'Increase' button based on its ID.
 * If it's a 'Decrease' button, it starts decreasing the quantity of the corresponding animal by calling the decrementAnimalInput function every 100 milliseconds.
 * If it's an 'Increase' button, it starts increasing the quantity of the corresponding animal by calling the incrementAnimalInput function every 100 milliseconds.
 * The 'mouseup' and 'mouseout' event listeners call the reset function to stop the incrementation or decrementation when the mouse button is released or moved out of the button.
 * The 'click' event listener prevents the default behavior of the button click.
 */
document.addEventListener('DOMContentLoaded', function() {

    document.querySelectorAll('[id^="Decrease"], [id^="Increase"]').forEach(function(button) {
        button.addEventListener('mousedown', function() {
            let animalType = button.id.split('-')[1];


            if (button.id.startsWith('Decrease')) {
                clearInterval(Barn.intervals[getIndex(animalType)]);
                decrementAnimalInput(animalType);
                button.querySelector('img').src = "../static/img/UI/minus_pbtn.png";
                Barn.intervals[getIndex(animalType)] = setInterval(function () {
                    decrementAnimalInput(animalType);
                }, 100);


            } else if (button.id.startsWith('Increase')) {
                clearInterval(Barn.intervals[getIndex(animalType)]);
                incrementAnimalInput(animalType);
                button.querySelector('img').src = "../static/img/UI/plus_pbtn.png";
                Barn.intervals[getIndex(animalType)] = setInterval(function () {
                    incrementAnimalInput(animalType);
                }, 100);

            }
        });

        button.addEventListener('mouseup', reset.bind(null, button));
        button.addEventListener('mouseout', reset.bind(null, button));

        button.addEventListener('click', function(event) {
            event.preventDefault();
        });
    });
});










// ____________________ HELPER FUNCTIONS ____________________//
/**
 * Decrement the quantity in the input of the specified animal.
 * @param {string} animal - The type of animal to increase the quantity for.
 */
function decrementAnimalInput(animal) {
    if (!Barn.animals.includes(animal)){
        return;
    }

    let inputField = document.getElementById(animal);
    let currentValue = parseInt(inputField.value);
    if (currentValue > 0) {
        currentValue--;
        inputField.value = currentValue;
    }
    updatePerkList();
}
/**
 * Increment the quantity in the input of the specified animal.
 * @param {string} animal - The type of animal to increase the quantity for.
 */
function incrementAnimalInput(animal) {
    if (!Barn.animals.includes(animal)){
        return;
    }
    // Get the input field corresponding to the animal
    let inputField = document.getElementById(animal);

    // Calculate the total number of animals selected
    let totalAnimals = 0;
    document.querySelectorAll('input[type="number"]').forEach(function(input) {
        totalAnimals += parseInt(input.value);
    });

    // Get the current value of the input field
    let currentValue = parseInt(inputField.value);

    // Check if the total number of animals selected has reached the limit
    if (buildingLevel === totalAnimals) {
        return;
    }

    // Increase the value of the input field if it's less than the maximum allowed
    if (currentValue < Barn.quantities[getIndex(animal)]) {
        currentValue++;
        inputField.value = currentValue;
    }
    updatePerkList();
}

/**
 * Returns the index of the specified animal in the Barn.animals array.
 * @param {string} animal - The animal to find the index of.
 * @return {number} - The index of the animal in the Barn.animals array. Returns -1 if the animal is not found.
 */
function getIndex(animal) {
    return Barn.animals.indexOf(animal);
}
/**
 * Returns the formatted time string in hours, minutes, and days based on the given total minutes.
 * @param {number} minutes - The total number of minutes to format.
 * @return {string} - The formatted time string in the format "Xd Xh Xm" or "Xs", where X represents the number of days, hours, and minutes or seconds, respectively.
 */
function formatTime(minutes) {
    let days = Math.floor(minutes / (60 * 24));
    let hours = Math.floor((minutes % (60 * 24)) / 60);
    let seconds = Math.floor(minutes % 1 * 60); // Calculate total seconds
    minutes = Math.floor(minutes % 60);


    if (days > 0) {
        return days + "d " + hours + "h " + minutes + "m";
    } else if (hours > 0) {
        return hours + "h " + minutes + "m";
    } else if (minutes > 0) {
        return minutes + "m";
    } else {
        return seconds + "s";
    }
}
/**
 * Calculates the risk chance based on the exploration time and building level.
 *
 * This function uses a predefined mapping of exploration times to base risk chances.
 * It retrieves the base risk chance for the given exploration time from the mapping.
 * The base risk chance is then re-evaluated with help of the buildingLevel and augmentLevel.
 * If the final risk chance is negative, it is set to zero.
 *
 * @param {number} explorationTime - The exploration time in minutes.
 * @return {number} - The calculated risk chance.
 */
function getRiskChance(explorationTime) {
    const riskChances = {
        1: 0,
        20: 5,
        60: 10,
        180: 30,
        720: 50,
        1440: 70
    };
    if (buildingLevel <= 0){
        return 100
    }

    let riskChance = riskChances[explorationTime] / buildingLevel;
    if (buildingAugmentLevel === 0){
        riskChance += 1
    }
    riskChance -= 1 - Log(buildingAugmentLevel + 1,6) * 3 / (2 * (buildingAugmentLevel + 1))

    return Math.max(0, riskChance);
}
/**
   * Calculates the logarithm of a number `n` with a given base.
   *
   * @param {number} n - The number to calculate the logarithm of.
   * @param {number} [base=10] - The base of the logarithm. Defaults to `10` if not provided.
   * @returns {number} The calculated logarithm.
   */
let Log =  function (n, base) {
    return Math.log(n)/(base ? Math.log(base) : 10);
}










//______________________ RANDOM FUNCTIONS ______________________//
function getRandomIndex(weights) {
    const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);
    let randomNum = Math.random() * totalWeight;

    for (let i = 0; i < weights.length; i++) {
        randomNum -= weights[i];
        if (randomNum < 0) {
            return i;
        }
    }
}
function gaussianRandom(mean=0, stdev=1) {
    let u, v, z;
    let isValid = false;

    while (!isValid) {
        u = 2 * Math.random() - 1; // Generate two random numbers between -1 and 1
        v = 2 * Math.random() - 1;
        let s = u * u + v * v;

        if (s < 1 && s !== 0) {
            isValid = true; // Ensure that (u, v) is within the unit circle
            z = Math.sqrt(-2.0 * Math.log(s) / s) * u; // Box-Muller transform
        }
    }

    return Math.min(1,z * stdev + mean);
}
function generateRandomProbabilities() {
    const total = 1 + Math.random() * 0.1; // Add a slight randomness
    const probabilities = [];
    let remaining = total;

    // Assign random values with bias
    for (let i = 0; i < 4; i++) {
        let value;
        if (i === 0) {
            value = 0.6 + Math.random() * 0.2; // Give favored animal product higher probability
        } else {
            value = Math.random() * 0.1; // Random for other products
        }
        probabilities.push(value);
        remaining -= value;
    }
    probabilities.push(remaining); // Ensure total sum is 1
    return probabilities;
}
function spaceTo_(input) {
    return input.replace(/ /g, '_');
}










//______________________ REWARDS FUNCTIONS ______________________//
function generateRewards() {
    const rewardBoxes = ['coinCrate', 'cropCrate', 'animalCrate', 'rawCrate', 'emptyCrate'];
    const probabilities = [0.25, 0.25, 0.25, 0.15, 0.10];
    const multiplier = Math.sqrt(exploration.duration / 60);
    const means = [100*buildingLevel * multiplier, 100*buildingLevel * multiplier, 50*buildingLevel * multiplier, 25*buildingLevel * multiplier, 0];
    const stdevs = [10*buildingLevel, 10*buildingLevel, 5*buildingLevel, 2*buildingLevel, 0]
    let rindex = 0;
    crateImage = [];

    // Base rewards
    for (let i = 0; i < exploration.base_rewards; i++) {
        rindex = getRandomIndex(probabilities);
        addRewardTypes(rewardBoxes[rindex], gaussianRandom(means[rindex], stdevs[rindex]), '');
        crateImage.push(rewardBoxes[rindex]);
    }

    // Chickens rewards
    let chickenMeans = probabilities
    let chickenStdevs = stdevs
    for (let i = 0; i < exploration.surviving_chickens; i++) {
        chickenMeans[1]*=  1.35; // amount of crops
        chickenStdevs[1]*= 1.15; //spread of crops

        rindex = getRandomIndex(probabilities);
        addRewardTypes(rewardBoxes[rindex], gaussianRandom(chickenMeans[rindex], chickenStdevs[rindex]), 'Chicken')
        crateImage.push(rewardBoxes[rindex]);
    }

    // Cow rewards
    let cowProbabilities = probabilities
    let cowMeans = means
    for (let i = 1; i <= exploration.rewards_of_cows; i++) {
        cowProbabilities[0] += 0.05; // Higher chance of getting coins
        for (let j = 0; j < cowMeans.length; j++) {
            cowMeans[j] *= 1.25; // Higher resources on average
        }

        rindex = getRandomIndex(cowProbabilities);
        addRewardTypes(rewardBoxes[rindex], gaussianRandom(cowMeans[rindex], stdevs[rindex]), 'Cow')
        crateImage.push(rewardBoxes[rindex]);
    }

    // Pig rewards
    let pigProbabilities = probabilities
    let pigMeans = means
    for (let i = 0; i < exploration.surviving_pigs; i++) {
        pigProbabilities[4] += 0.15; // Higher chance of getting an empty box
        pigMeans[3] *= 1.35; // Higher amount of craft resources

        rindex = getRandomIndex(pigProbabilities);
        addRewardTypes(rewardBoxes[rindex], gaussianRandom(pigMeans[rindex], stdevs[rindex]), 'Pig');
        crateImage.push(rewardBoxes[rindex]);
    }

    // Goat rewards
    let goatMeans = means
    for (let i = 0; i < exploration.rewards_of_goats; i++) {
        for (let j = 0; j < goatMeans.length; j++) {
            goatMeans[j] *= 0.95; // Lower resources on average
        }

        rindex = getRandomIndex(probabilities);
        addRewardTypes(rewardBoxes[rindex], gaussianRandom(goatMeans[rindex], stdevs[rindex]), 'Goat');
        crateImage.push(rewardBoxes[rindex]);
    }
}

function addRewardTypes(type, amount, animal){
    let division = 20;

    switch (type) {
        case 'coinCrate':
            addRewards(Math.round(amount), 'Money');
            break;

        case 'cropCrate':
            distributeInCrops(Math.round(amount),division);
            break;

        case 'animalCrate':
            distributeInAnimalProducts(Math.round(amount), animal, division)
            break;

        case 'rawCrate':
            distributeInRawMaterials(Math.round(amount), animal, division);
            break;

        case 'emptyCrate':
            break;
    }
}
function distributeInRawMaterials(amount, animal, division){
    const raws = ['Stick', 'Stone', 'Plank', 'Log', 'Ingot'];
    let probabilities = (animal === 'Pig') ? [0.22375, 0.244375, 0.244375, 0.14375, 0.14375] : [0.325, 0.2125, 0.2125, 0.125, 0.125];
    if (amount > division){
        addRewards(amount, raws[getRandomIndex(probabilities)]);
        return;
    }
    for (let i = 0; i < division; i++) {
        addRewards(Math.ceil(amount / division), raws[getRandomIndex(probabilities)]);
    }
}
function distributeInCrops(amount, division){
    const crops = ['Wheat', 'Carrot', 'Corn', 'Lettuce', 'Tomato', 'Turnip', 'Zucchini', 'Parsnip', 'Cauliflower', 'Eggplant'].slice(0, Math.min(9, buildingLevel));
    const probabilities = Array(crops.length).fill(1 / crops.length);
    if (amount > division){
        addRewards(amount, crops[getRandomIndex(probabilities)]);
        return;
    }
    for (let i = 0; i < division; i++) {
        addRewards(Math.ceil(amount / division), crops[getRandomIndex(probabilities)]);
    }
}
/**
 * Distributes a given amount of animal products among specified divisions.
 * The distribution is based on the rarity of the products and the type of animal.
 *
 * @param {number} amount - The total amount of animal products to distribute.
 * @param {string} animal - The type of animal producing the products (e.g., 'Chicken', 'Cow', 'Pig', 'Goat').
 * @param {number} division - The number of divisions to distribute the products into.
 */
function distributeInAnimalProducts(amount, animal, division){
    const productTypes = ['Egg', 'Milk', 'Truffle', 'Wool'];
    const animalTypeProbability = {
        'Chicken': [0.5, 0.2, 0.1, 0.2],   // Chickens favor eggs
        'Cow': [0.2, 0.5, 0.2, 0.1],       // Cows favor milk
        'Pig': [0.1, 0.2, 0.5, 0.2],       // Pigs favor truffles
        'Goat': [0.2, 0.1, 0.2, 0.5]       // Goats favor wool
    };
    const typeProbability = animal in animalTypeProbability ? animalTypeProbability[animal] : generateRandomProbabilities();
    const productType = productTypes[getRandomIndex(typeProbability)];
    const probabilities = (animal === 'Chicken') ? [0.175, 0.35, 0.25, 0.15, 0.075] : [0.375, 0.3, 0.2, 0.1, 0.025];

    let products;
    switch (productType) {
            case 'Egg':
                products = ['Egg', 'Rustic Egg', 'Crimson Egg', 'Emerald Egg', 'Sapphire Egg'];
                break;
            case 'Milk':
                products = ['Milk', 'Chocolate Milk', 'Strawberry Milk', 'Soy Milk', 'Blueberry Milk'];
                break;
            case 'Truffle':
                products = ['Truffle', 'Bronze Truffle', 'Gold Truffle', 'Forest Truffle', 'Winter Truffle'];
                break;
            case 'Wool':
                products = ['Wool', 'Alpaca Wool', 'Cashmere Wool', 'Irish Wool', 'Dolphin Wool'];
                break;
            default:
                return null; // Unknown animal product
        }
        if (amount > division){
            addRewards(amount, products[getRandomIndex(probabilities)]);
        }else{
            for (let i = 0; i < division; i++) {
                addRewards(Math.ceil(amount / division), products[getRandomIndex(probabilities)]);
            }
        }
}
/**
 * Adds a specified amount of a reward to the rewards collection.
 * If the reward already exists, the amount is added to the existing value.
 * If the reward does not exist, it is added to the rewards collection with the specified amount.
 *
 * @param {number} amount - The amount of the reward to add.
 * @param {string} reward - The name of the reward to add.
 */
function addRewards(amount, reward){
    if (amount === 0){
        return;
    }
    if (reward in rewards){
        rewards[reward] += amount;
    } else {
        rewards[reward] = amount;
    }
}




