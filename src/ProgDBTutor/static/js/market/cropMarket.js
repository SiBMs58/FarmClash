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


