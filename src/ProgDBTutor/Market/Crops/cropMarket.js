// Sales function for the crop, must be connected to the backend
function sellCrop(crop) {
    var counterElement = document.getElementById(crop.toLowerCase() + "-counter");
    var count = parseInt(counterElement.innerText);
    var priceElement = document.getElementById(crop.toLowerCase() + "-price"); // Price element
    var price = parseInt(priceElement.innerText); // Current price
    var totalPrice = count * price; // Calculate total price
    alert("You've sold " + count + " " + crop + "(s) for a total of $" + totalPrice + "!");

    // Reset the counter to 0
    counterElement.innerText = "0";
    // update the total price of all crops that are going to be sold
    updateTotalPrice(crop)
}
/*function to go back to the menu of the market*/
function goBack(){
    window.location.href="../market.html"; // Go back to the market when you click the 'Back' button
}
// Function to update total price for a specific crop
function updateTotalPrice(crop) {
    var total = 0;
    var price = parseFloat(document.getElementById(crop + "-price").innerText);
    var count = parseInt(document.getElementById(crop + "-counter").innerText);
    total = count * price;
    document.getElementById(crop + "-total-price").innerText = 'Total: ' + total.toFixed(0);
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
