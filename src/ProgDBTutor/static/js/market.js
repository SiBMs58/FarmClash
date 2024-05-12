const market = {};
market.quantities = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
market.intervals = new Array(10).fill(null);
market.prices = [1, 3, 5, 10, 15, 12, 17, 17, 20, 25];
market.crops = ["Wheat", "Carrot", "Corn", "Lettuce", "Tomato", "Turnip", "Zucchini", "Parsnip", "Cauliflower", "Eggplant"];

fetchCropPricesFromAPI();
fetchCropQuantityFromAPI();
displayPrices();


// API calls
function fetchCropPricesFromAPI() {
    //TODO read current prices from database
    /* still need to make api/market probably
    fetch('/api/market')
     .then(response => response.json())
     .then(data => {
         data.forEach((resource) => {
             if (!market.crops.includes(resource.resource_type)) return; // Skip non-crops
             market.prices[market.crops.indexOf(resource.resource_type)] = resource.new_price;
         });
     })
     .catch(error => {
         console.error('Error fetching prices:', error);
     });
     */
}
function fetchCropQuantityFromAPI() {
     fetch('/api/resources')
     .then(response => response.json())
     .then(data => {
         data.forEach((resource) => {
             if (!market.crops.includes(resource.resource_type)) return; // Skip non-crops
             market.quantities[market.crops.indexOf(resource.resource_type)] = resource.amount;
         });
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
function sell() {
    document.getElementById('sell-image').src = '../../static/img/UI/sell_pbtn.png';
    setTimeout(() => {
        // Revert button image to default variant
        document.getElementById('sell-image').src = '../../static/img/UI/sell_btn.png';

        // Process the sale
        let inputValues = document.querySelectorAll('input[type="number"]');
        let quantitiesArray = Array.from(inputValues).map(inputField => parseInt(inputField.value));

        let totalSalePrice = 0;
        let soldMessage = "Sold:";
        let anySold = false;

        quantitiesArray.forEach((quantity, index) => {
            if (quantity !== 0) {
                let cropPrice = market.prices[index];
                let cropTotalPrice = cropPrice * quantity;

                totalSalePrice += cropTotalPrice;

                soldMessage += `\n${quantity} ${market.crops[index]}${quantity > 1 ? 's' : ''} for $${cropTotalPrice}`;
                anySold = true;

                // Subtract sold quantity from the limit
                market.quantities[index] -= quantity;

                // Reset the input value
                inputValues[index].value = 0;

                //TODO update database entry
                // on resource table of user and market.crops[index] with new market.quantities
                // on market table with quantities sold (and current timestamp?)
                // on resource table of user and "Money" with +cropTotalPrice
            }
        });

        if (anySold) {
            soldMessage += `\nTotal Sale Price: $${totalSalePrice}`;
            alert(soldMessage);
        } else {
            alert("No market sold.");
        }
    }, 100);

}



// used for displaying things on the screen
function displayPrices(){
    for (let i = 1; i <= market.crops.length; i++) {
        const priceElement = document.getElementById(`price${i}`);
        if (priceElement) {
            priceElement.innerHTML = '<img src="../../static/img/UI/display.left.short.png" alt="" draggable="false">';
            priceElement.innerHTML += getAmountDisplay(market.prices[i - 1])
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

function goToBook(){
window.location.href = '/templates/books/book_market.html'; // Navigeer naar de book_market.html pagina wanneer de knop wordt geklikt
}
