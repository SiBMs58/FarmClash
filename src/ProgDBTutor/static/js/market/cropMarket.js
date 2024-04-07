// Sales function for the crop, must be connected to the backend
function sellCrop(crop) {
    var counterElement = document.getElementById(crop.toLowerCase() + "-counter");
    // Collect the prize with the emoji
    var priceWithEmoji = document.getElementById(crop + "-price").innerText;

    // Remove the emoji from the text
    var priceText = priceWithEmoji.replace(/[^0-9.-]+/g,"");

    // Convert the text to a number
    var price = parseFloat(priceText);
    // The amount of crops of that type, you are going to sell
    var count = parseInt(document.getElementById(crop + "-counter").innerText);
    // Total price you will receive
    var totalPrice = count * price;
    alert("You've sold " + count + " " + crop + "(s) for a total of $" + totalPrice + "!");

    //updateSale(crop, count)
    //var new_price = getPrice(crop)

    // Reset the counter to 0
    counterElement.innerText = "0";
    // update the total price of all crops that are going to be sold
    updateTotalPrice(crop)
}
/*function to go back to the menu of the market*/
function goBack(){
    window.location.href="../../../templates/market/market.html"; // Go back to the market when you click the 'Back' button
}
// Function to update total price for a specific crop
function updateTotalPrice(crop) {
   var total = 0;

    // Get the prize with the emoji
    var priceWithEmoji = document.getElementById(crop + "-price").innerText;

    // Remove the emoji from the text
    var priceText = priceWithEmoji.replace(/[^0-9.-]+/g,"");

    // Convert the text to a number
    var price = parseFloat(priceText);

    var count = parseInt(document.getElementById(crop + "-counter").innerText);
    total = count * price;
    document.getElementById(crop + "-total-price").innerText = 'Total price: ' + total.toFixed(0);
}
// Function to increase the counter
function incrementCounter(crop) {
    var counterElement = document.getElementById(crop + "-counter");
    var count = parseInt(counterElement.innerText);
    counterElement.innerText = count + 1;
    updateTotalPrice(crop); // Update the total price when counter changes
}
// Function to decrease the counter
function decrementCounter(crop) {
    var counterElement = document.getElementById(crop + "-counter");
    var count = parseInt(counterElement.innerText);
    if (count > 0) {
        counterElement.innerText = count - 1;
        updateTotalPrice(crop); // Update the total price when the counter changes
    }
}


// Function to set the market price, gets price for a crop from database
async function getPrice(crop) {
    let base_price = 10; // Default base price
    const BASE_URL = `${window.location.protocol}//${window.location.host}`;
    const fetchLink = `${BASE_URL}/game/fetch-crop-price?crop=${crop}`;
    
    try {
        const response = await fetch(fetchLink);
        const responseData = await response.json();
        
        // Assuming the response contains the price, update the base price
        if (responseData && responseData.price) {
            base_price = responseData.price;
        }

        console.log("getPrice(crop) success " + base_price);
        return base_price;
    } catch (error) {
        console.error('getPrice(crop) failed:', error);
        return base_price; // Return the default base price in case of failure
    }
}


// adds sale amount to database
async function updateSale(crop, count) {
    const market_data = {
        crop: crop,
        sale: count,
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
        console.error('Failed to update map in database:', error);
    }
}
