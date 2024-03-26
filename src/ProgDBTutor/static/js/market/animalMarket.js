// Sales function for the animal, must be connected to the backend
function sellAnimal(animal) {
    var counterElement = document.getElementById(animal.toLowerCase() + "-counter");

    // Collect the prize with the emoji
    var priceWithEmoji = document.getElementById(animal + "-price").innerText;

    // Remove the emoji from the text
    var priceText = priceWithEmoji.replace(/[^0-9.-]+/g,"");

    // Convert the text to a number
    var price = parseFloat(priceText);
    // The amount of animals of that type, you are going to sell
    var count = parseInt(document.getElementById(animal + "-counter").innerText);
    var totalPrice = count * price; // Calculate total price
    alert("You've sold " + count + " " + animal + "(s) for a total of $" + totalPrice + "!");

    // Reset the counter to 0
    counterElement.innerText = "0";
    // update the total price of all animals that are going to be sold
    updateTotalPrice(animal)
}
/*function to go back to the menu of the market*/
function goBack(){
    window.location.href="../../../templates/market/market.html"; // Go back to the market when you click the 'Back' button
}
// Function to update total price for a specific animal
function updateTotalPrice(animal) {
   var total = 0;

    // Collect the prize with the emoji
    var priceWithEmoji = document.getElementById(animal + "-price").innerText;

    // Remove the emoji from the text
    var priceText = priceWithEmoji.replace(/[^0-9.-]+/g,"");

    // Convert the text to a number
    var price = parseFloat(priceText);

    // The amount of animals of that type, you are going to sell
    var count = parseInt(document.getElementById(animal + "-counter").innerText);
    total = count * price; // The total price
    document.getElementById(animal + "-total-price").innerText = 'Total price: ' + total.toFixed(0);
}
// Function to increase the counter
function incrementCounter(animal) {
    // the number of animals of that type you selected
    var counterElement = document.getElementById(animal + "-counter");
    // convert counterElement to integer
    var count = parseInt(counterElement.innerText);
    // increase the counter with one
    counterElement.innerText = count + 1;
    updateTotalPrice(animal); // Update the total price when counter changes
}
// Function to decrease the counter
function decrementCounter(animal) {
    // the number of animals of that type you selected
    var counterElement = document.getElementById(animal + "-counter");
    // convert counterElement to integer
    var count = parseInt(counterElement.innerText);
    //count must be greater than 0 if you want to decrease it
    if (count > 0) {
        // decrease the counter with one
        counterElement.innerText = count - 1;
        updateTotalPrice(animal); // Update the total price when the counter changes
    }
}
