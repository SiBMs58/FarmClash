// Sales function for the animal, must be connected to the backend
function sellAnimal(animal) {
    var counterElement = document.getElementById(animal.toLowerCase() + "-counter");
    var count = parseInt(counterElement.innerText);
    var priceElement = document.getElementById(animal.toLowerCase() + "-price"); // Price element
    var price = parseInt(priceElement.innerText); // Current price
    var totalPrice = count * price; // Calculate total price
    alert("You've sold " + count + " " + animal + "(s) for a total of $" + totalPrice + "!");

    // Reset the counter to 0
    counterElement.innerText = "0";
    // update the total price of all animals that are going to be sold
    updateTotalPrice(animal)
}
/*function to go back to the menu of the market*/
function goBack(){
    window.location.href="../market.html"; // Go back to the market when you click the 'Back' button
}
// Function to update total price for a specific animal
function updateTotalPrice(animal) {
    var total = 0;
    var price = parseFloat(document.getElementById(animal + "-price").innerText);
    var count = parseInt(document.getElementById(animal + "-counter").innerText);
    total = count * price;
    document.getElementById(animal + "-total-price").innerText = 'Total: ' + total.toFixed(0);
}
// Function to increase the counter
function incrementCounter(animal) {
    var counterElement = document.getElementById(animal + "-counter");
    var count = parseInt(counterElement.innerText);
    counterElement.innerText = count + 1;
    updateTotalPrice(animal); // Update the total price when counter changes
}
// Function to decrease the counter
function decrementCounter(animal) {
    var counterElement = document.getElementById(animal + "-counter");
    var count = parseInt(counterElement.innerText);
    if (count > 0) {
        counterElement.innerText = count - 1;
        updateTotalPrice(animal); // Update the total price when the counter changes
    }
}
