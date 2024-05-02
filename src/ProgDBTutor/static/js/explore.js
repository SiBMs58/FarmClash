const Barn = {};
Barn.quantities = [0, 0, 0, 0];
Barn.intervals = new Array(4).fill(null);
Barn.animals = ["Chicken", "Cow", "Pig", "Goat"];
let animalLimit = 10;
let exploration = null;

handleExplorationStatus();


/**
 * Handles the exploration status by fetching exploration data from the API,
 * checking if there's an ongoing exploration, and displaying it if available,
 * otherwise fetches animal quantities from the API.
 */
function handleExplorationStatus() {
    fetchExplorationFromAPI()
        .then(() => {
            if (exploration === null) {
                fetchAnimalQuantityFromAPI();
            } else {
                const startTime = new Date(exploration.started_at);
                const currentTime = new Date();
                const duration = parseInt(exploration.duration);
                const elapsedMS = currentTime - startTime;
                const elapsedMinutes = elapsedMS / (1000 * 60);
                let remainingMinutes = Math.max(duration - elapsedMinutes, 0);
                displayExploration(remainingMinutes);
            }
        })
        .catch(error => {
            console.error('Error handling exploration status:', error);
        });
}


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
    if (animalLimit === totalAnimals) {
        return;
    }

    // Increase the value of the input field if it's less than the maximum allowed
    if (currentValue < Barn.quantities[getIndex(animal)]) {
        currentValue++;
        inputField.value = currentValue;
    }
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
 * @return {string} - The formatted time string in the format "Xd Xh Xm", where X represents the number of days, hours, and minutes, respectively.
 */
function formatTime(minutes) {
    let days = Math.floor(minutes / (60 * 24));
    let hours = Math.floor((minutes % (60 * 24)) / 60);
    let minutess = Math.floor(minutes % 60);
    let seconds = Math.floor(minutes % 1 * 60); // Calculate total seconds

    if (days > 0) {
        return days + "d " + hours + "h " + minutess + "m";
    } else if (hours > 0) {
        return hours + "h " + minutess + "m";
    } else if (minutess > 0) {
        return minutess + "m";
    } else {
        return seconds + "s";
    }
}


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


function displayExploration(remainingTime){
    let preExplorationDiv = document.getElementById('before-exploration');
    let intraExplorationDiv = document.getElementById('during-exploration');
    let postExplorationDiv = document.getElementById('after-exploration');

    preExplorationDiv.style.display = "none";
    if (remainingTime === 0) {
        intraExplorationDiv.style.display = "none";
        postExplorationDiv.style.display  = "block";
    } else {

        postExplorationDiv.style.display = "none";

        intraExplorationDiv.style.display = "flex";
        intraExplorationDiv.style.alignItems = "center";
        intraExplorationDiv.style.justifyContent = "center";
        intraExplorationDiv.style.flexDirection = "column";
        intraExplorationDiv.style.height = "254px";
        intraExplorationDiv.style.fontSize = "50px";
        intraExplorationDiv.style.fontWeight = "bold";
        intraExplorationDiv.innerText = formatTime(remainingTime) + " left";
    }
}



function exploration_rewards(){

}








document.getElementById('explore-btn').addEventListener('click', async function () {
    let selectedTimeElement = document.getElementById('exploration-time');
    let selectedOption = selectedTimeElement.options[selectedTimeElement.selectedIndex];
    let exploreTime = selectedOption.value;
    if (!exploreTime) {
        exploreTime = 20;
    }

    let numCows = document.getElementById('Cow').value;
    let numPigs = document.getElementById('Pig').value;
    let numGoats = document.getElementById('Goat').value;
    let numChickens = document.getElementById('Chicken').value;

    const BASE_URL = `${window.location.protocol}//${window.location.host}`;
    const fetchLink = BASE_URL + "/exploration/start-exploration";
    let exploration_data = {
        'chickens': numChickens,
        'goats': numGoats,
        'pigs': numPigs,
        'cows': numCows,
        'duration': exploreTime
    };
    try {
        const response = await fetch(fetchLink, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(exploration_data)
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


    displayExploration(exploreTime)
});
document.querySelectorAll('input[type="number"]').forEach(function(inputField) {
    inputField.addEventListener('input', function(event) {
        let currentInputValue = parseInt(event.target.value);
        let animalType = event.target.id;

        let totalAnimals = 0;
        document.querySelectorAll('input[type="number"]').forEach(function(input) {
            totalAnimals += parseInt(input.value);
        });

        let index = Barn.animals.indexOf(animalType);
        let maxLimit = Barn.quantities[index];

        if (isNaN(currentInputValue) || currentInputValue < 0) {
            event.target.value = 0;
            return;
        }
        if (animalLimit < totalAnimals) {
            event.target.value = animalLimit-totalAnimals+currentInputValue;
            return;
        }
        if (currentInputValue > maxLimit) {
            event.target.value = maxLimit; // Set value to the maximum limit
        }
    });
})

document.addEventListener('DOMContentLoaded', function() {


    // Add event listeners to buttons with IDs starting with "Decrease" or "Increase"
    document.querySelectorAll('[id^="Decrease"], [id^="Increase"]').forEach(function(button) {
        button.addEventListener('mousedown', function() {
            // Get the animal type from the button's ID
            let animalType = button.id.split('-')[1]; // Split ID by "-" and get the second part
            console.log(animalType);

            // Check if it's a Decrease or Increase button
            if (button.id.startsWith('Decrease')) {
                clearInterval(Barn.intervals[getIndex(animalType)]);
                // Start decreasing the quantity
                decrementAnimalInput(animalType);
                // Set interval for continuous decreasing
                Barn.intervals[getIndex(animalType)] = setInterval(function () {
                    decrementAnimalInput(animalType);
                }, 100);
                button.querySelector('img').src = "../static/img/UI/minus_pbtn.png";

            } else if (button.id.startsWith('Increase')) {
                clearInterval(Barn.intervals[getIndex(animalType)]);
                // Start increasing the quantity
                incrementAnimalInput(animalType);
                // Set interval for continuous increasing
                Barn.intervals[getIndex(animalType)] = setInterval(function () {
                    incrementAnimalInput(animalType);
                }, 100);
                button.querySelector('img').src = "../static/img/UI/plus_pbtn.png";
            }
        });

        button.addEventListener('mouseup', reset.bind(null, button));
        button.addEventListener('mouseout', reset.bind(null, button));

        // Prevent default behavior of the button click
        button.addEventListener('click', function(event) {
            event.preventDefault();
        });
    });
});


function fetchAnimalQuantityFromAPI() {
    //TODO read current animal amount from database
    /* still need to make api/animals probably
    fetch('/api/animals')
    .then(response => response.json())
    .then(data => {
        data.forEach((animal) => {
            Barn.quantities[market.animals.indexOf(animal.name)] = animal.amount;
        });
    })
    .catch(error => {
        console.error('Error fetching animals:', error);
    });
    */
}


/**
 * Asynchronously fetches exploration data from the API.
 *
 * This function sends a GET request to the '/api/exploration' endpoint and processes the response.
 * If the response is successful and there is an ongoing exploration, the global 'exploration' variable is set to the received data.
 * If there is no ongoing exploration, 'exploration' is set to null.
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
        exploration = data.ongoing ? data : null;
    } catch (error) {
        console.error('Error fetching exploration:', error);
    }
}
