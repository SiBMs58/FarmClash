//______________________ GLOBAL VARIABLES ______________________//
const Barn = {};
Barn.quantities = [0, 0, 0, 0];
Barn.intervals = new Array(4).fill(null);
Barn.animals = ["Chicken", "Cow", "Pig", "Goat"];
const animalPerks = {
    Chicken: [
        ["Increased chance of finding eggs.", 10],
        ["Increased yield of crops if found during exploration.", 25],
        ["chance of higher rarity of animal resources.", 5],
        ["chance of getting home (Kip zonder kop).", -5]
    ],
    Cow: [
        ["Increased chances of milk.", 10],
        ["Brings more resources on average.", 25],
        ["chance to bring coins.", 5],
        ["chance to bring a box.", -10]
    ],
    Pig: [
        ["Increased chances of truffles.", 10],
        ["Higher rarity of craft resources.", 15],
        ["Higher amount of craft resources.", 15],
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
    surviving_chickens: 0
};
let buildingLevel = 1; // TODO fetch from the database
let buildingAugmentLevel = 0; // TODO fetch from the database






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
            if (exploration.ongoing === false) {
                fetchAnimalQuantity();
            } else {
                const startTime = new Date(exploration.started_at);
                const currentTime = new Date();
                const elapsed = (currentTime - startTime) / (1000 * 60);
                exploration.remaining_time = Math.max(parseInt(exploration.duration) - elapsed, 0);
            }
            display();
        })
        .catch(error => {
            console.error('Error handling exploration status:', error);
        });
}






//______________________ UI FUNCTIONS ______________________//
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
function display(){
    let preExplorationDiv = document.getElementById('before-exploration');
    let intraExplorationDiv = document.getElementById('during-exploration');
    let postExplorationDiv = document.getElementById('after-exploration');

    if (exploration.remaining_time === 0){
        preExplorationDiv.style.display = "none";
        intraExplorationDiv.style.display = "none";
        postExplorationDiv.style.display  = "block";


    }else if(exploration.remaining_time > 0){
        preExplorationDiv.style.display = "none";
        postExplorationDiv.style.display = "none";
        intraExplorationDiv.style.display = "flex";

        intraExplorationDiv.innerText = formatTime(exploration.remaining_time) + " left";

    } else {
        preExplorationDiv.style.display = "block";
        postExplorationDiv.style.display = "none";
        intraExplorationDiv.style.display = "none";
        //TODO display the post exploration screen
    }
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
async function sendAnimalQuantity() {
    let numCows = parseInt(document.getElementById('Cow').value);
    let numPigs = parseInt(document.getElementById('Pig').value);
    let numGoats = parseInt(document.getElementById('Goat').value);
    let numChickens = parseInt(document.getElementById('Chicken').value);
    let diffCows = Barn.quantities[getIndex('Cow')] - numCows;
    let diffPigs = Barn.quantities[getIndex('Pig')] - numPigs;
    let diffGoats = Barn.quantities[getIndex('Goat')] - numGoats;
    let diffChickens = Barn.quantities[getIndex('Chicken')] - numChickens;

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







// ____________________ EVENT LISTENERS ____________________//
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
        'duration': exploreTime,
        'augment_level': buildingAugmentLevel,
        'exploration_level': buildingLevel,
        'remaining_time': exploreTime
    };
    await sendExploration();
    await sendAnimalQuantity();
    display(exploreTime)
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
        /**
        if (buildingLevel < totalAnimals) {
            event.target.value = buildingLevel-totalAnimals+currentInputValue-1;
            updatePerkList();
            return;
        }
        if (currentInputValue > maxLimit) {
            event.target.value = maxLimit; // Set value to the maximum limit
            updatePerkList();
        }
            */
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
function Log(n, base) {
    return Math.log(n)/(base ? Math.log(base) : 10);
}
