let quantities = [59, 47, 50, 100, 20, 50, 78, 83, 85, 17];
let intervals = new Array(10).fill(null);
let prices = [10, 20, 30, 15, 25, 18, 22, 17, 12, 28];
const market = ['Wheat', 'Carrot', 'Cauliflower', 'Corn', 'Eggplant', 'Lettuce', 'Parsnip', 'Tomato', 'Turnip', 'Zucchini'];

setPriceList();
setQuantityList();
function setPriceList() {
    //TODO read current prices from database
    // set prices in list
    for (let i = 1; i <= market.length; i++) {
        const priceElement = document.getElementById(`price${i}`);
        if (priceElement) {
            priceElement.innerHTML = `${prices[i-1]} <img src="../../static/img/resources/Coin.png" alt="🪙" class="coin-image" draggable="false"/>`;
        }
    }
}
function setQuantityList() {
    //TODO read current quantities from database
    // set quantities in list
}





function startIncrease(index) {
    clearInterval(intervals[index - 1]);
    document.getElementById(`plusImage${index}`).src = "../../static/img/buttons/plus_pbtn.png";
    intervals[index - 1] = setInterval(function () {
        increaseQuantity(index);
    }, 100);
}

function startDecrease(index) {
    clearInterval(intervals[index - 1]);
    document.getElementById(`minusImage${index}`).src = "../../static/img/buttons/minus_pbtn.png";
    intervals[index - 1] = setInterval(function () {
        decreaseQuantity(index);
    }, 100);
}

function increaseQuantity(index) {
    let inputField = document.getElementById(`quantity${index}`);
    let currentValue = parseInt(inputField.value);
    if (currentValue < quantities[index - 1]) {
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

function stopAction() {
    intervals.forEach((interval, index) => {
        clearInterval(interval);
        document.getElementById(`plusImage${index + 1}`).src = "../../static/img/buttons/plus_btn.png";
        document.getElementById(`minusImage${index + 1}`).src = "../../static/img/buttons/minus_btn.png";
    });
}

function sell() {
    document.getElementById('sell-image').src = '../../static/img/buttons/sell_pbtn.png';
    setTimeout(() => {
        // Revert button image to default variant
        document.getElementById('sell-image').src = '../../static/img/buttons/sell_btn.png';

        // Process the sale
        let inputValues = document.querySelectorAll('input[type="number"]');
        let quantitiesArray = Array.from(inputValues).map(inputField => parseInt(inputField.value));

        let totalSalePrice = 0;
        let soldMessage = "Sold:";
        let anySold = false;

        quantitiesArray.forEach((quantity, index) => {
            if (quantity !== 0) {
                let cropPrice = prices[index];
                let cropTotalPrice = cropPrice * quantity;

                totalSalePrice += cropTotalPrice;

                soldMessage += `\n${quantity} ${market[index]}${quantity > 1 ? 's' : ''} for $${cropTotalPrice}`;
                anySold = true;

                // Subtract sold quantity from the limit
                quantities[index] -= quantity;

                // Reset the input value
                inputValues[index].value = 0;
            }
        });

        if (anySold) {
            //TODO Notify database with new quantities sold
            // Notify database with the quantities kept
            // Notify database with the increased coins
            soldMessage += `\nTotal Sale Price: $${totalSalePrice}`;
            alert(soldMessage);
        } else {
            alert("No market sold.");
        }
    }, 100);

}




document.querySelectorAll('input[type="number"]').forEach(function(inputField, index) {
    inputField.addEventListener('input', function(event) {
        let currentValue = parseInt(event.target.value);
        let maxLimit = quantities[index]; // Get the maximum limit from the 'quantities' array

        // Check if the current value is within the allowed range
        if (isNaN(currentValue) || currentValue < 0) {
            event.target.value = 0; // Set value to the minimum limit
        } else if (currentValue > maxLimit) {
            event.target.value = maxLimit; // Set value to the maximum limit
        }
    });
});
