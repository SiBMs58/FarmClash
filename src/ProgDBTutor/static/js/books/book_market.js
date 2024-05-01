// DOM elements
const prevB = document.querySelector('#prev-btn'); // Previous button element
const nextB = document.querySelector('#next-btn'); // Next button element
const backB = document.querySelector('#back-btn'); // Back button element
const book = document.querySelector("#book"); // Book element
const paper1 = document.querySelector('#p1'); // Paper 1 element
const paper2 = document.querySelector('#p2'); // Paper 2 element
const paper3 = document.querySelector('#p3'); // Paper 3 element
const paper4 = document.querySelector('#p4'); // Paper 4 element
const cover1 = document.querySelector('#c1'); // Cover 1 element
const cover2 = document.querySelector('#c2'); // Cover 2 element
const fronts = document.querySelectorAll(".front"); // Front pages elements
const backs = document.querySelectorAll(".back"); // Back pages elements
const frontCovers = document.querySelectorAll(".front-cover"); // Front covers elements
const backCovers = document.querySelectorAll(".back-cover"); // Back covers elements
let currentLocation = 1; // Current page location
let numberOfPapers = 6; // Total number of papers
let maxLocation = numberOfPapers + 1; // Maximum location for the bookChat

/* Event listeners */
prevB.addEventListener("click", goPrevPage); // Event listener for previous button
nextB.addEventListener("click", goNextPage); // Event listener for next button

// Function to open the bookChat
function openBook() {
    book.style.transform = "translateX(50%)"; // Translate bookChat to open position
    prevB.style.transform = "translateX(-180px)"; // Translate previous button
    nextB.style.transform = "translateX(180px)"; // Translate next button
}

// Function to close the bookChat
function closeBook(isAtBeginning) {
    if(isAtBeginning) {
        book.style.transform = "translateX(0%)"; // Translate bookChat to closed position
    } else {
        book.style.transform = "translateX(100%)"; // Translate bookChat to closed position
    }
    prevB.style.transform = "translate(0px)"; // Reset previous button position
    nextB.style.transform = "translate(0px)"; // Reset next button position
}

// Function to navigate to the next page
function goNextPage() {
    if(currentLocation < maxLocation) {
        switch(currentLocation) {
            case 1:
                openBook(); // Open the bookChat
                cover1.classList.add("flipped"); // Flip cover 1
                cover1.style.zIndex = 1; // Update z-index for cover 1
                break;
            case 2:
                paper1.classList.add("flipped"); // Flip paper 1
                paper1.style.zIndex = 2; // Update z-index for paper 1
                break;
            case 3:
                paper2.classList.add("flipped"); // Flip paper 2
                paper2.style.zIndex = 3; // Update z-index for paper 2
                break;
            case 4:
                paper3.classList.add("flipped"); // Flip paper 3
                paper3.style.zIndex = 4; // Update z-index for paper 3
                break;
            case 5:
                paper4.classList.add("flipped"); // Flip paper 4
                paper4.style.zIndex = 5; // Update z-index for paper 4
                break;
            case 6:
                cover2.classList.add("flipped"); // Flip cover 2
                cover2.style.zIndex = 6; // Update z-index for cover 2
                closeBook(false); // Close the bookChat
                break;
        }
        currentLocation++; // Increment current location
    }
}

// Function to navigate to the previous page
function goPrevPage() {
    if(currentLocation > 1) {
        switch(currentLocation) {
            case 2:
                closeBook(true); // Close the bookChat
                cover1.classList.remove("flipped"); // Unflip cover 1
                cover1.style.zIndex = 6; // Update z-index for cover 1
                break;
            case 3:
                paper1.classList.remove("flipped"); // Unflip paper 1
                paper1.style.zIndex = 5; // Update z-index for paper 1
                break;
            case 4:
                paper2.classList.remove("flipped"); // Unflip paper 2
                paper2.style.zIndex = 4; // Update z-index for paper 2
                break;
            case 5:
                paper3.classList.remove("flipped"); // Unflip paper 3
                paper3.style.zIndex = 3; // Update z-index for paper 3
                break;
            case 6:
                paper4.classList.remove("flipped"); // Unflip paper 4
                paper4.style.zIndex = 2; // Update z-index for paper 4
                break;
            case 7:
                openBook(); // Open the bookChat
                cover2.classList.remove("flipped"); // Unflip cover 2
                cover2.style.zIndex = 1; // Update z-index for cover 2
                break;
        }
        currentLocation--; // Decrement current location
    }
}

function goBack() {
    window.location.href = '/templates/market/market.html'; // Navigeer naar de market.html pagina wanneer de knop wordt geklikt
}