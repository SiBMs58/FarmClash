const Barn = {};
Barn.quantities = [5, 6, 7, 8];
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
function handleExplorationStatus(){
    fetchExplorationFromAPI()
    if (exploration === null){
        fetchAnimalQuantityFromAPI()
        return;
    }
    displayExploration(exploration.time)
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
    let remainingMinutes = minutes % 60;

    if (days > 0) {
        return days + "d " + hours + "h " + remainingMinutes + "m";
    } else if (hours > 0) {
        return hours + "h " + remainingMinutes + "m";
    } else {
        return remainingMinutes + "m";
    }
}


/**
 * Resets the button images and clears any ongoing incrementation intervals.
 * @param {HTMLButtonElement} button - The button element to reset.
 */
function reset(button) {
    clearInterval(Barn.intervals[getIndex(button.id.split('-')[1])]);

    if (button.id.startsWith('Decrease')) {
        button.querySelector('img').src = "../img/UI/minus_btn.png";
    } else if (button.id.startsWith('Increase')) {
        button.querySelector('img').src = "../img/UI/plus_btn.png";
    }
}


function displayExploration(remainingTime){
    let preExplorationDiv = document.getElementById('before-exploration');
    let intraExplorationDiv = document.getElementById('during-exploration');
    let postExplorationDiv = document.getElementById('after-exploration');

    preExplorationDiv.style.display = "none";
    if (remainingTime > 0) {
        postExplorationDiv.style.display = "none";

        intraExplorationDiv.style.display = "flex"; // Set display to flex
        intraExplorationDiv.style.alignItems = "center"; // Center vertically
        intraExplorationDiv.style.justifyContent = "center"; // Center horizontally
        intraExplorationDiv.style.flexDirection = "column"; // Align items in a column
        intraExplorationDiv.style.height = "254px"; // Set the height property to 500px
        intraExplorationDiv.style.fontSize = "50px"; // Set the font size property to 20px
        intraExplorationDiv.style.fontWeight = "bold"; // Set the font weight property to bold
        intraExplorationDiv.innerText = formatTime(remainingTime) + " left"; // Set the inner text
    } else {
        intraExplorationDiv.style.display = "none";

        postExplorationDiv.style.display  = "block";
    }



}









document.getElementById('explore-btn').addEventListener('click', function() {
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

    // notify database

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
                button.querySelector('img').src = "../img/UI/minus_pbtn.png";

            } else if (button.id.startsWith('Increase')) {
                clearInterval(Barn.intervals[getIndex(animalType)]);
                // Start increasing the quantity
                incrementAnimalInput(animalType);
                // Set interval for continuous increasing
                Barn.intervals[getIndex(animalType)] = setInterval(function () {
                    incrementAnimalInput(animalType);
                }, 100);
                button.querySelector('img').src = "../img/UI/plus_pbtn.png";
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

function fetchExplorationFromAPI() {
    //TODO read explore from database if user is currently exploring
    /* still need to make api/explore probably
    if user has a exploration going on than put information in exploration variable
    */
}