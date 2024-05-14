let interval = null;
let resources ={
    'Stick': 0,
    'Plank': 0,
    'Stone': 0,
    'Ingot': 0,
    'Log': 0,

    'Egg': 0,
    'Rustic Egg': 0,
    'Crimson Egg': 0,
    'Emerald Egg': 0,
    'Sapphire Egg': 0,

    'Milk': 0,
    'Chocolate Milk': 0,
    'Strawberry Milk': 0,
    'Soy Milk': 0,
    'Blueberry Milk': 0,

    'Truffle': 0,
    'Bronze Truffle': 0,
    'Gold Truffle': 0,
    'Forest Truffle': 0,
    'Winter Truffle': 0,

    'Wool': 0,
    'Alpaca Wool': 0,
    'Cashmere Wool': 0,
    'Irish Wool': 0,
    'Dolphin Wool': 0
};
const typeLoc = {
        'raws/': ["Stick", "Plank", "Stone", "Ingot", "Log"],
        'animalproduct/': ['Egg', 'Rustic Egg', 'Crimson Egg', 'Emerald Egg', 'Sapphire Egg',
                    'Milk', 'Chocolate Milk','Strawberry Milk', 'Soy Milk', 'Blueberry Milk',
                    'Truffle', 'Bronze Truffle', 'Gold Truffle', 'Forest Truffle', 'Winter Truffle',
                    'Wool', 'Alpaca Wool', 'Cashmere Wool', 'Irish Wool', 'Dolphin Wool']
};
let selectedResource = ''
let buildingAugmentLevel = 0;
let buildingLevel = 0;

//___________________________ Page Initialization ___________________________//
initialize();
function initialize() {
    fetchResources()
    .then(updatedCrops => {
        resources = updatedCrops;
        console.log(updatedCrops);
    }).then(() => {
        displayResources();
    })
    .catch(error => {
        // Handle error
        console.error(error);
    });
    fetchBarn().then(() => {
        displayLimit();
        updateDescription()
    });
}











//___________________________ UI Functions ___________________________//
function displayResources(){
    const itemsContainer = document.getElementById('items');
    itemsContainer.innerHTML = '';

    // Iterate over the crops object
    Object.keys(resources).forEach((type) => {
        const Quantity = resources[type];

        if (Quantity === 0) {
            return;
        }

        // Create a new div element for each row
        const row = document.createElement('div');
        row.classList.add('items-row'); // Add the 'items-row' class to the div

        // Create a div for the amount
        const amountDiv = document.createElement('div');
        amountDiv.classList.add('item-amount'); // Add a class for styling
        amountDiv.innerHTML = getAmountImage(Quantity);

        // Create a button for the crop
        const resourceBtn = document.createElement('button');
        resourceBtn.classList.add('item-btn');
        resourceBtn.id = type;
        resourceBtn.alt = type;
        resourceBtn.title = type;

        const resourceImg = document.createElement('img');
        resourceImg.src = `../../static/img/resources/${getResourceImage(type)}.png`;
        resourceImg.id = type + "-img"; // Set ID to crop name
        resourceImg.draggable = false;
        resourceBtn.appendChild(resourceImg);
        resourceBtn.addEventListener('click', handleItemClick);

        // Append the amount and button to the row
        row.appendChild(amountDiv);
        row.appendChild(resourceBtn);

        // Append the row to the items container
        itemsContainer.appendChild(row);
    });
}
function displayLimit() {
    let total = 0;

    // Calculate total amount of crops
    Object.keys(resources).forEach((type) => {
        total += resources[type];
    });

    // Get the limit
    let limit = getLimit();

    // Calculate percentage
    let percentage = (total / limit) * 100;
    if (limit === -1) {
        percentage = 0;
        limit = '∞';
    }

    // Create progress bar HTML
   const progressBarHTML = `
    <div class="progress">
        <div class="progress-bar" role="progressbar" style="width: ${percentage}%" aria-valuenow="${percentage}" aria-valuemin="0" aria-valuemax="100">
            ${percentage.toFixed(2)}%
        </div>
    </div>
    <p>${total} / ${limit}</p>`;
    // Get limitContainer
    const limitContainer = document.getElementById('limit');

    // Update limitContainer with progress bar HTML
    limitContainer.innerHTML = progressBarHTML;
}
// Update description based on the initial state or any other changes
function updateDescription() {
    if (!selectedResource) {
        document.getElementById('description').innerText = 'You can press a resource to select it. Scrapping a selected crop gives the user 2 coin per resource.';
    } else {
        document.getElementById('description').innerText = 'You can press a selected resource again to deselect it. Scrapping a selected crop gives the user 2 coin per resource.';
    }
}








//___________________________ API Requests ___________________________//
async function fetchResources() {
    return fetch('/api/resources')
        .then(response => response.json())
        .then(data => {
            const updatedCrops = {};
            data.forEach((resource) => {
                if (resources.hasOwnProperty(resource.resource_type)) {
                    updatedCrops[resource.resource_type] = resource.amount;
                }
            });
            return updatedCrops;
        })
        .catch(error => {
            console.error('Error fetching resources:', error);
            alert('Error fetching resources, try again.');
            throw error; // Re-throwing the error to be caught by the caller
        });
}
async function fetchBarn() {
     return fetch('/api/fetch-building-information-by-type/Barn')
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
async function sendResourceChange(quantity){
    let data = {};
    data[selectedResource] = -quantity;
    data['Money']= quantity*2;
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
        if(selectedResource === clickedItem.id) {
            selectedResource = '';
            updateDescription()
            return;
        }
        clickedItem.style.background = '#c8a277';
        selectedResource = clickedItem.id;
        updateDescription();
    }
}
document.getElementById('scrap-quantity').addEventListener('input', (event) => {
    let currentValue = parseInt(event.target.value);
    let maxLimit = selectedResource ? resources[selectedResource] : 0;

    // Check if the current value is within the allowed range
    if (isNaN(currentValue) || currentValue < 0) {
        event.target.value = 0; // Set value to the minimum limit
    } else if (currentValue > maxLimit) {
        event.target.value = maxLimit; // Set value to the maximum limit
    }
});

document.getElementById('max').addEventListener('mousedown', () => {
    if (selectedResource){
        document.getElementById('scrap-quantity').value = resources[selectedResource];
    }
    document.getElementById(`right`).src = "../../static/img/UI/right_pbtn.png";
});

// Event listener for the increase button
document.getElementById('min').addEventListener('mousedown', () => {
    document.getElementById('scrap-quantity').value = 0;
    document.getElementById(`left`).src = "../../static/img/UI/left_pbtn.png";

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
    document.getElementById('scrap').src = "../../static/img/UI/scrap_pbtn.png";
    setTimeout(() => {
        if (selectedResource) {
            let quantity = parseInt(document.getElementById(`scrap-quantity`).value);
            if (quantity > 0) {
                alert(`Amount selected to scrap from ${selectedResource} is ${quantity}`);

                sendResourceChange(quantity).then(r => {
                    resources[selectedResource] -= quantity;
                    displayResources();
                    displayLimit();
                    selectedResource = '';
                    updateDescription()
                    document.getElementById(`scrap-quantity`).value = 0;
                });
                // Notify Database with new amount
            } else {
                alert(`No amount selected to scrap from ${selectedResource}`);
            }
        } else {
            alert('No crop selected');
        }
        document.getElementById('scrap').src = "../../static/img/UI/scrap_btn.png";
        }, 5);

});









//_______________________________ Helpers _______________________________//
function getAmountImage(amount) {
    const amountStr = amount.toString().split('');

    const imgTags = amountStr.map(digit => {
        if (digit === '.') {
            return `<img src="../../static/img/UI/dot.png" alt="dot" draggable="false">`;
        }
        return `<img src="../../static/img/UI/${digit}.png" alt="${digit}" draggable="false">`;
    });

    return imgTags.join('');
}
function getResourceImage(type) {

    for (const [map, value] of Object.entries(typeLoc)) {
        if (value.includes(type)) {
            return map + type;
        }
    }
}









//_______________________________//
function stopAction() {
    // Clear the interval
    clearInterval(interval);
    // Reset the button images to their default state
    document.getElementById(`plus`).src = "../static/img/UI/plus_btn.png";
    document.getElementById(`minus`).src = "../static/img/UI/minus_btn.png";
    document.getElementById(`right`).src = "../static/img/UI/right_btn.png";
    document.getElementById(`left`).src = "../static/img/UI/left_btn.png";
}

function increaseQuantity() {
    let inputField = document.getElementById(`scrap-quantity`);
    let currentValue = parseInt(inputField.value);
    let maxLimit = selectedResource ? resources[selectedResource] : 0;
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
    document.getElementById(`plus`).src = "../static/img/UI/plus_pbtn.png";
    // Start incrementing quantity at intervals
    interval = setInterval(increaseQuantity, 100);
}

function startDecrease() {
    // Clear any existing intervals
    clearInterval(interval);
    // Set the source of the decrease button image to the pressed state
    document.getElementById(`minus`).src = "../static/img/UI/minus_pbtn.png";
    // Start decrementing quantity at intervals
    interval = setInterval(decreaseQuantity, 100);
}
function getLimit(){
    let limit = 0;
    switch (buildingLevel) {
        case 1:
            limit = 800;
            break;
        case 2:
            limit = 1600;
            break;
        case 3:
            limit = 8000;
            break;
        case 4:
            limit = 16000;
            break;
        case 5:
            limit = 80000;
            break;
        case 6:
            limit = 160000;
            break;
        case 7:
            limit = 800000;
            break;
        case 8:
            limit = 1600000;
            break;
        case 9:
            limit = 8000000;
            break;
        case 10:
            return -1;
        default:
            return 0;
    }
    return limit + buildingAugmentLevel * 150;
}