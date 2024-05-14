let interval = null;
let crops ={
    'Wheat': 5555555555555555555555555555555,
    'Carrot': 55555555555555555555555555555555555555555555555555,
    'Corn': 5555555555,
    'Lettuce': 55555555,
    'Tomato': 461,
    'Turnip': 3345,
    'Zucchini': 5355,
    'Parsnip': 535,
    'Cauliflower': 565656,
    'Eggplant': 0
};
let selectedCrop = ''
let buildingAugmentLevel = 0;
let buildingLevel = 0;

//___________________________ Page Initialization ___________________________//
initialize();
function initialize() {
    fetchCrops().then(() => {
        displayCrops();
    });
    fetchSilo().then(() => {
        displayLimit();
    });
}











//___________________________ UI Functions ___________________________//
function displayCrops(){
    const itemsContainer = document.getElementById('items');
    itemsContainer.innerHTML = '';

    // Iterate over the crops object
    Object.keys(crops).forEach((cropName) => {
        const cropQuantity = crops[cropName];

        if (cropQuantity === 0) {
            return;
        }

        // Create a new div element for each row
        const row = document.createElement('div');
        row.classList.add('items-row'); // Add the 'items-row' class to the div

        // Create a div for the amount
        const amountDiv = document.createElement('div');
        amountDiv.classList.add('item-amount'); // Add a class for styling
        amountDiv.innerHTML = getAmountImage(cropQuantity);

        // Create a button for the crop
        const cropBtn = document.createElement('button');
        cropBtn.classList.add('item-btn');
        cropBtn.id = cropName;
        cropBtn.alt = cropName;
        cropBtn.title = cropName;

        const cropImg = document.createElement('img');
        cropImg.src = `../../img/resources/${cropName}.png`;
        cropImg.id = cropName + "-img"; // Set ID to crop name
        cropImg.draggable = false;
        cropBtn.appendChild(cropImg);
        cropBtn.addEventListener('click', handleItemClick);

        // Append the amount and button to the row
        row.appendChild(amountDiv);
        row.appendChild(cropBtn);

        // Append the row to the items container
        itemsContainer.appendChild(row);
    });
}
function displayLimit() {
    let totalCrops = 0;
    let limit = getLimit();
    Object.keys(crops).forEach((cropName) => {
        totalCrops += crops[cropName];
    });
    const limitContainer = document.getElementById('limit');
    limitContainer.innerHTML = '';

    // Calculate percentage
    const percentage = totalCrops / limit * 100;

    // Create progress bar HTML
    const progressBarHTML = `
        <div class="progress">
            <div class="progress-bar" role="progressbar" style="width: ${percentage}%" aria-valuenow="${percentage}" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
        <p>${percentage.toFixed(2)}% Used</p>
    `;

    // Append progress bar to limitContainer
    limitContainer.innerHTML = progressBarHTML;
}









//___________________________ API Requests ___________________________//
async function fetchCrops() {
    fetch('/api/resources')
        .then(response => response.json())
        .then(data => {
            data.forEach((resource) => {
                if (!crops.hasOwnProperty(resource.resource_type)) {
                    crops[resource.resource_type] = resource.amount;
                }
            });
        })
        .catch(error => {
            console.error('Error fetching resources:', error);
            alert('Error fetching resources, try again.');
        });
}
async function fetchSilo() {
     fetch('/api/fetch-building-information-by-type/Silo')
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            const buildings = data.building_information;
            const id = Object.keys(buildings)[0];
            const silo = buildings[id];
            buildingAugmentLevel = silo.augment_level;
            buildingLevel = silo.level;
            buildingAugmentLevel = 1; //TODO this is for debugging
            buildingLevel = 1; //TODO this is for debugging
        }
    })
    .catch(error => {
        console.error('Error fetching building information:', error);
    });
}
async function sendCropChange(quantity){
    let data = {};
    data[selectedCrop] = -quantity;
    data['Money']= quantity;
    const BASE_URL = `${window.location.protocol}//${window.location.host}`;
    const fetchLink = BASE_URL + "/api/add-resources";
    try {
        const response = await fetch(fetchLink, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
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
}









//___________________________ Event Listeners ___________________________//

function handleItemClick(event) {
    // Get the clicked item button
    const clickedItem = event.target.closest('.item-btn');

    // Check if an item button was clicked
    if (clickedItem) {
        const allButtons = document.querySelectorAll('.item-btn');
        allButtons.forEach(button => {
            button.style.background = 'none'; // Reset background
        });
        document.getElementById('scrap-quantity').value = 0;
        if(selectedCrop === clickedItem.id) {
            selectedCrop = '';
            return;
        }
        clickedItem.style.background = '#c8a277';
        selectedCrop = clickedItem.id;
    }
}
document.getElementById('scrap-quantity').addEventListener('input', (event) => {
    let currentValue = parseInt(event.target.value);
    let maxLimit = selectedCrop ? crops[selectedCrop] : 0;

    // Check if the current value is within the allowed range
    if (isNaN(currentValue) || currentValue < 0) {
        event.target.value = 0; // Set value to the minimum limit
    } else if (currentValue > maxLimit) {
        event.target.value = maxLimit; // Set value to the maximum limit
    }
});

document.getElementById('max').addEventListener('mousedown', () => {
    if (selectedCrop){
        document.getElementById('scrap-quantity').value = crops[selectedCrop];
    }
    document.getElementById(`right`).src = "../../img/UI/right_pbtn.png";
});

// Event listener for the increase button
document.getElementById('min').addEventListener('mousedown', () => {
    document.getElementById('scrap-quantity').value = 0;
    document.getElementById(`left`).src = "../../img/UI/left_pbtn.png";

});
// Event listener for the decrease button
document.getElementById('decrease').addEventListener('mousedown', () => {
    decreaseQuantity();
    startDecrease(); // Start decreasing when mouse is pressed down
});

// Event listener for the increase button
document.getElementById('increase').addEventListener('mousedown', () => {
    increaseQuantity();
    startIncrease(); // Start increasing when mouse is pressed down
});

document.addEventListener('mouseup', () => {
    stopAction();
});
document.addEventListener('mouseout', () => {
    stopAction();
});
document.addEventListener('mouseleave' , () => {
    stopAction();
});
document.getElementById('scrap-btn').addEventListener('click', () => {
    document.getElementById('scrap').src = "../../img/UI/scrap_pbtn.png";
    setTimeout(() => {
        if (selectedCrop) {
            let quantity = parseInt(document.getElementById(`scrap-quantity`).value);
            if (quantity > 0) {
                alert(`Amount selected to scrap from ${selectedCrop} is ${quantity}`);

                sendCropChange(quantity).then(r => {
                    crops[selectedCrop] -= quantity;
                    displayCrops();
                    selectedCrop = '';
                    document.getElementById(`scrap-quantity`).value = 0;
                });
                // Notify Database with new amount
            } else {
                alert(`No amount selected to scrap from ${selectedCrop}`);
            }
        } else {
            alert('No crop selected');
        }
        document.getElementById('scrap').src = "../../img/UI/scrap_btn.png";
        }, 5);

});









//_______________________________ Helpers _______________________________//
function getAmountImage(amount) {
    const amountStr = amount.toString().split('');

    const imgTags = amountStr.map(digit => {
        if (digit === '.') {
            return `<img src="../../img/UI/dot.png" alt="dot" draggable="false">`;
        }
        return `<img src="../../img/UI/${digit}.png" alt="${digit}" draggable="false">`;
    });

    return imgTags.join('');
}










//_______________________________//
function stopAction() {
    // Clear the interval
    clearInterval(interval);
    // Reset the button images to their default state
    document.getElementById(`plus`).src = "../img/UI/plus_btn.png";
    document.getElementById(`minus`).src = "../img/UI/minus_btn.png";
    document.getElementById(`right`).src = "../img/UI/right_btn.png";
    document.getElementById(`left`).src = "../img/UI/left_btn.png";
}

function increaseQuantity() {
    let inputField = document.getElementById(`scrap-quantity`);
    let currentValue = parseInt(inputField.value);
    let maxLimit = selectedCrop ? crops[selectedCrop] : 0;
    if (currentValue < maxLimit) {
        currentValue++;
        inputField.value = currentValue;
    }
}
function decreaseQuantity() {
    let inputField = document.getElementById(`scrap-quantity`);
    let currentValue = parseInt(inputField.value);
    if (currentValue > 0) {
        currentValue--;
        inputField.value = currentValue;
    }
}
function startIncrease() {
    // Clear any existing intervals
    clearInterval(interval);
    // Set the source of the increase button image to the pressed state
    document.getElementById(`plus`).src = "../img/UI/plus_pbtn.png";
    // Start incrementing quantity at intervals
    interval = setInterval(increaseQuantity, 100);
}

function startDecrease() {
    // Clear any existing intervals
    clearInterval(interval);
    // Set the source of the decrease button image to the pressed state
    document.getElementById(`minus`).src = "../img/UI/minus_pbtn.png";
    // Start decrementing quantity at intervals
    interval = setInterval(decreaseQuantity, 100);
}
function getLimit(){
    let limit = 0;
    switch (buildingLevel) {
        case 1:
            limit = 500;
            break;
        case 2:
            limit = 1000;
            break;
        case 3:
            limit = 5000;
            break;
        case 4:
            limit = 10000;
            break;
        case 5:
            limit = 50000;
            break;
        case 6:
            limit = 100000;
            break;
        case 7:
            limit = 500000;
            break;
        case 8:
            limit = 1000000;
            break;
        case 9:
            limit = 5000000;
            break;
        case 10:
            return -1;
        default:
            return 0;
    }
    return limit + buildingAugmentLevel * 100;
}