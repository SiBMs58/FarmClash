// DOM elements
const prevB = document.querySelector('#prev-btn'); // Previous button element
const nextB = document.querySelector('#next-btn'); // Next button element
const backB = document.querySelector('#back-btn'); // Back button element
const book = document.querySelector("#book"); // Book element
const paper1 = document.querySelector('#p1'); // Paper 1 element
const paper2 = document.querySelector('#p2'); // Paper 2 element
const paper3 = document.querySelector('#p3'); // Paper 3 element
const paper4 = document.querySelector('#p4'); // Paper 4 element
const paper5 = document.querySelector('#p5'); // Paper 5 element
const paper6 = document.querySelector('#p6'); // Paper 6 element
const paper7 = document.querySelector('#p7'); // Paper 7 element
const paper8 = document.querySelector('#p8'); // Paper 8 element
const paper9 = document.querySelector('#p9'); // Paper 9 element
const paper10 = document.querySelector('#p10'); // Paper 10 element
const paper11 = document.querySelector('#p11'); // Paper 11 element
const cover1 = document.querySelector('#c1'); // Cover 1 element
const cover2 = document.querySelector('#c2'); // Cover 2 element
const fronts = document.querySelectorAll(".front"); // Front pages elements
const backs = document.querySelectorAll(".back"); // Back pages elements
const frontCovers = document.querySelectorAll(".front-cover"); // Front covers elements
const backCovers = document.querySelectorAll(".back-cover"); // Back covers elements
let currentLocation = 1; // Current page location
let numberOfPapers = 13; // Total number of papers
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
                paper5.classList.add("flipped"); // Flip paper 5
                paper5.style.zIndex = 6; // Update z-index for paper 5
                break;
            case 7:
                paper6.classList.add("flipped"); // Flip paper 6
                paper6.style.zIndex = 7; // Update z-index for paper 6
                break;
            case 8:
                paper7.classList.add("flipped"); // Flip paper 7
                paper7.style.zIndex = 8; // Update z-index for paper 7
                break;
            case 9:
                paper8.classList.add("flipped"); // Flip paper 8
                paper8.style.zIndex = 9; // Update z-index for paper 8
                break;
            case 10:
                paper9.classList.add("flipped"); // Flip paper 9
                paper9.style.zIndex = 10; // Update z-index for paper 9
                break;
            case 11:
                paper10.classList.add("flipped"); // Flip paper 10
                paper10.style.zIndex = 11; // Update z-index for paper 10
                break;
            case 12:
                paper11.classList.add("flipped"); // Flip paper 11
                paper11.style.zIndex = 12; // Update z-index for paper 11
                break;
            case 13:
                cover2.classList.add("flipped"); // Flip cover 2
                cover2.style.zIndex = 13; // Update z-index for cover 2
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
                cover1.style.zIndex = 13; // Update z-index for cover 1
                break;
            case 3:
                paper1.classList.remove("flipped"); // Unflip paper 1
                paper1.style.zIndex = 12; // Update z-index for paper 1
                break;
            case 4:
                paper2.classList.remove("flipped"); // Unflip paper 2
                paper2.style.zIndex = 11; // Update z-index for paper 2
                break;
            case 5:
                paper3.classList.remove("flipped"); // Unflip paper 3
                paper3.style.zIndex = 10; // Update z-index for paper 3
                break;
            case 6:
                paper4.classList.remove("flipped"); // Unflip paper 4
                paper4.style.zIndex = 9; // Update z-index for paper 4
                break;
            case 7:
                paper5.classList.remove("flipped"); // Unflip paper 5
                paper5.style.zIndex = 8; // Update z-index for paper 5
                break;
            case 8:
                paper6.classList.remove("flipped"); // Unflip paper 6
                paper6.style.zIndex = 7; // Update z-index for paper 6
                break;
            case 9:
                paper7.classList.remove("flipped"); // Unflip paper 7
                paper7.style.zIndex = 6; // Update z-index for paper 7
                break;
            case 10:
                paper8.classList.remove("flipped"); // Unflip paper 8
                paper8.style.zIndex = 5; // Update z-index for paper 8
                break;
            case 11:
                paper9.classList.remove("flipped"); // Unflip paper 9
                paper9.style.zIndex = 4; // Update z-index for paper 9
                break;
            case 12:
                paper10.classList.remove("flipped"); // Unflip paper 10
                paper10.style.zIndex = 3; // Update z-index for paper 10
                break;
            case 13:
                paper11.classList.remove("flipped"); // Unflip paper 11
                paper11.style.zIndex = 2; // Update z-index for paper 11
                break;
            case 14:
                openBook(); // Open the book
                cover2.classList.remove("flipped"); // Unflip cover 2
                cover2.style.zIndex = 1; // Update z-index for cover 2
                break;
        }
        currentLocation--; // Decrement current location
    }
}