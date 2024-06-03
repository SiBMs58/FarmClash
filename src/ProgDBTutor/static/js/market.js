const market = {};
market.quantities = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
market.intervals = new Array(10).fill(null);
market.prices = [1, 3, 5, 10, 15, 12, 17, 17, 20, 25];
market.crops = ["Wheat", "Carrot", "Corn", "Lettuce", "Tomato", "Turnip", "Zucchini", "Parsnip", "Cauliflower", "Eggplant"];

fetchCropPricesFromAPI();
fetchCropQuantityFromAPI();
displayPrices();

localStorage.getItem('muteButtonState')
localStorage.getItem('backsoundButtonState')

// API calls
async function fetchCropPricesFromAPI(crop, base_price) {
    const BASE_URL = `${window.location.protocol}//${window.location.host}`;
    const fetchLink = `${BASE_URL}/game/fetch-crop-price?crop=${crop}&base_price=${base_price}`;

    try {
        const response = await fetch(fetchLink);
        const responseData = await response.json();

        // Assuming the response contains the price, update the base price
        if (responseData && responseData.price) {
            let new_price = responseData.price;
            console.log("fetchCropPricesFromAPI(crop) success " + new_price);
            return new_price;
        }
        console.log('fetchCropPricesFromAPI(crop) no price found (db):', responseData);
        return base_price;
    } catch (error) {
        console.error('fetchCropPricesFromAPI(crop) failed:'+ base_price, error);
        return base_price; // Return the default base price in case of failure
    }
}
function displayCrops(){
    let resourceHTML = '<img src="../../static/img/UI/display.left.short.png" alt="" draggable="false">';
    for (let i = 0; i < market.crops.length; i++) {
        resourceHTML += getAmountDisplay(market.quantities[i])
        resourceHTML += getCropDisplay(market.crops[i]);
        if (i < market.crops.length - 1) {
            resourceHTML += '<img src="../../static/img/UI/display.extender.png" alt=" " draggable="false">'.repeat(5);
        }
    }
    resourceHTML += '<img src="../../static/img/UI/display.right.short.png" alt="" draggable="false">'
    document.getElementById('crops').innerHTML = resourceHTML;
}
function fetchCropQuantityFromAPI() {
     fetch('/api/resources')
     .then(response => response.json())
     .then(data => {
         data.forEach((resource) => {
             if (!market.crops.includes(resource.resource_type)) return; // Skip non-crops
             market.quantities[market.crops.indexOf(resource.resource_type)] = resource.amount;
         });
         displayCrops();
     })
     .catch(error => {
         console.error('Error fetching resources:', error);
     });

}


// These actions are called when pressing the increase and resp decrease button so the interval so it can be increased and resp decreased for an interval
function startIncrease(index) {
    clearInterval(market.intervals[index - 1]);
    document.getElementById(`plusImage${index}`).src = "../../static/img/UI/plus_pbtn.png";
    market.intervals[index - 1] = setInterval(function () {
        increaseQuantity(index);
    }, 100);
}
function startDecrease(index) {
    clearInterval(market.intervals[index - 1]);
    document.getElementById(`minusImage${index}`).src = "../../static/img/UI/minus_pbtn.png";
    market.intervals[index - 1] = setInterval(function () {
        decreaseQuantity(index);
    }, 100);
}


// These functions are called when pressing the increase and resp decrease button used for the increasing and decreasing the value in the input fields as long as it is valid (not less than 0 not more than the amount of resources the user has
function increaseQuantity(index) {
    let inputField = document.getElementById(`quantity${index}`);
    let currentValue = parseInt(inputField.value);
    if (currentValue < market.quantities[index - 1]) {
        currentValue++;
        inputField.value = currentValue;
    }
}
function decreaseQuantity(index) {
    let inputField = document.getElementById(`quantity${index}`);
    let currentValue = parseInt(inputField.value);
    if (currentValue > 0) {
        currentValue--;
        inputField.value = currentValue;
    }
}


// event listener to make sure what is in the input field is always valid (is a number between 0 and the quantity of crop)
document.querySelectorAll('input[type="number"]').forEach(function(inputField, index) {
    inputField.addEventListener('input', function(event) {
        let currentValue = parseInt(event.target.value);
        let maxLimit = market.quantities[index]; // Get the maximum limit from the 'quantities' array

        // Check if the current value is within the allowed range
        if (isNaN(currentValue) || currentValue < 0) {
            event.target.value = 0; // Set value to the minimum limit
        } else if (currentValue > maxLimit) {
            event.target.value = maxLimit; // Set value to the maximum limit
        }
    });
});


// This action is called after you go of any button, to display the original buttons again and clear the increase interval
function stopAction() {
    market.intervals.forEach((interval, index) => {
        clearInterval(interval);
        displayUnpressedButton(index)
    });
}


// This action is called after you press on the sell button
// it will also notify the database with the changes
async function sell() {
    document.getElementById('sell-image').src = '../../static/img/UI/sell_pbtn.png';
    setTimeout(async () => {
        // Revert button image to default variant
        document.getElementById('sell-image').src = '../../static/img/UI/sell_btn.png';

        // Process the sale
        let inputValues = document.querySelectorAll('input[type="number"]');
        let quantitiesArray = Array.from(inputValues).map(inputField => parseInt(inputField.value));

        let totalSalePrice = 0;
        let soldMessage = "Sold:";
        let anySold = false;

        for (let index = 0; index < quantitiesArray.length; index++) {
            let quantity = quantitiesArray[index];
            if (quantity !== 0) {
                let cropName = market.crops[index];
                let cropPrice = await fetchCropPricesFromAPI(cropName, market.prices[index]);
                let cropTotalPrice = cropPrice * quantity;

                totalSalePrice += cropTotalPrice;

                soldMessage += `\n${quantity} ${market.crops[index]}${quantity > 1 ? 's' : ''} for $${cropTotalPrice}`;
                anySold = true;

                // Subtract sold quantity from the limit
                market.quantities[index] -= quantity;

                // Reset the input value
                inputValues[index].value = 0;

                await updateSale(cropName, quantity, cropPrice);
                await updateResources(cropName, -quantity);
                await updateResources("Money", totalSalePrice);
            }
        }

        if (anySold) {
            soldMessage += `\nTotal Sale Price: $${totalSalePrice}`;
            alert(soldMessage);
        } else {
            alert("No market sold.");
        }
    }, 100);
}



// used for displaying things on the screen
async function displayPrices(){
    for (let i = 1; i <= market.crops.length; i++) {
        const priceElement = document.getElementById(`price${i}`);
        if (priceElement) {
            priceElement.innerHTML = '<img src="../../static/img/UI/display.left.short.png" alt="" draggable="false">';

            let price = await fetchCropPricesFromAPI(market.crops[i-1],market.prices[i - 1])
            console.log('price: ' + price);
            priceElement.innerHTML += getAmountDisplay(price)
            priceElement.innerHTML += '<img src="../../static/img/UI/display.money.right.png"  alt="🪙" draggable="false">'
        }
    }
}
function getAmountDisplay(amount){
    let value = amount.toString();

    let HTML = ''
    for (let i = 0; i < value.length; i++) {
        HTML += `<img src="../../static/img/UI/display.${value[i]}.png" alt="${value[i]}" draggable="false">`;
    }
    return HTML
}
function displayUnpressedButton(index){
    document.getElementById(`plusImage${index + 1}`).src = "../../static/img/UI/plus_btn.png";
    document.getElementById(`minusImage${index + 1}`).src = "../../static/img/UI/minus_btn.png";
}


/** adds sale amount to database
 *this is used to imapct the next price of the crop
 * crop is the name of the crop as string, count is the sale amot as int, base_price is int
 */

async function updateSale(crop, count, base_price) {
    const market_data = {
        crop: crop,
        sale: count,
        base_price: base_price,
    }
    const BASE_URL = `${window.location.protocol}//${window.location.host}`;
    const fetchLink = BASE_URL + "/game/update-market";
    try {
        const response = await fetch(fetchLink, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(market_data) // Send the serialized map data as the request body
        });
        if (response.ok) {
            const jsonResponse = await response.json();
            console.log('market_data DB update successful:', jsonResponse);
        } else {
            console.error('market_data DB update failed with status:', response.status);
        }
    } catch (error) {
        console.error('Failed to update market in database:', error);
    }
}

async function updateResources(resource, count) {
    const resources = {
        [resource]: count // Use the resource as the key and the count as the value
    };
    const BASE_URL = `${window.location.protocol}//${window.location.host}`;
    const fetchLink = `${BASE_URL}/api/add-resources`;

    try {
        const response = await fetch(fetchLink, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(resources) // Send the serialized resource data as the request body
        });

        if (response.ok) {
            const jsonResponse = await response.json();
            console.log('Resources DB update successful:', jsonResponse);
        } else {
            console.error('Add-resources DB update failed with status:', response.status);
        }
    } catch (error) {
        console.error('Failed to update resources:', error);
    }
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