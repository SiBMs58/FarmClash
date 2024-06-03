/**
 * Global variables for the game state
 */
let pigpenLevel = 0;
let cowbarnLevel = 0;
let chickencoopLevel = 0;
let goatbarnLevel = 0;
let pigpens = 0;
let cowbarns = 0;
let chickencoops = 0;
let goatbarns = 0;
let LastUpdated = new Date();
let LVL = 0;



//_________________________ INITIALIZATION _________________________//
/**
 * Initializes the game state by fetching user level, buildings, and last updated time.
 * Then, it updates the offline production and schedules the next hour execution.
 */
initialize();
function initialize(){
    fetchUserLevel().then(level => {
        LVL = level;
        fetchBuildings().then(() => {
            fetchLastUpdated().then(() => {
                updateOfflineProduction();
                scheduleNextHourExecution();
            });
        });
    });
}









//_________________________ UPDATE FOR OFFLINE TIME _________________________//
/**
 * Updates the game state based on the time the user was offline.
 * It calculates the hours passed, generates animal products and animals, and sends these quantities.
 * Finally, it displays a popup message to the user.
 */
function updateOfflineProduction(){
    const now = new Date();
    const hours = (now - LastUpdated) / 1000 / 60 / 60;
    const amount = Math.floor(hours);
    if (amount === 0) {
        return;
    }
    const product = generateAnimalProduct(amount);
    const animals = generateAnimals(amount);
    sendAnimalQuantity(animals);
    sendResourceQuantity(product);

    const total = Object.keys(animals).length + Object.keys(product).length;
    const productMessage = formatItems(product);
    const animalsMessage = formatItems(animals);
    const message = `You received ${productMessage} and ${animalsMessage} while away. If you have no place to store them, they will be lost.`;
    displayPopup(message, total);
}









//_________________________ SCHEDULING FUNCTIONS _________________________//
/**
 * Schedules the next update of the game state.
 * It calculates the milliseconds until the next hour and sets a timeout to setup the next hour.
 */
function scheduleNextHourExecution() {
    function millisecondsUntilNextHour() {
        const now = new Date();
        const nextHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours()+1, 0, 0, 0);
        return nextHour - now;
    }
    setTimeout(function() {
        setupNextHour();
    }, millisecondsUntilNextHour());
}
/**
 * Sets up the game state for the next hour.
 * It resets the levels and quantities of the buildings, fetches the buildings, generates animal products and animals,
 * sends these quantities, and displays a popup message to the user.
 * Finally, it schedules the next hour execution.
 */
function setupNextHour(){
    pigpenLevel = 0;
    cowbarnLevel= 0;
    chickencoopLevel = 0;
    goatbarnLevel = 0;
    pigpens = 0;
    cowbarns = 0;
    chickencoops = 0;
    goatbarns = 0;
    fetchBuildings().then(() => {
        const product = generateAnimalProduct(1);
        const animals = generateAnimals(1);
        sendResourceQuantity(product);
        sendAnimalQuantity(animals);

        const productMessage = formatItems(product);
        const animalsMessage = formatItems(animals);
        const message = `You received ${productMessage} and ${animalsMessage} while away.`;
        displayPopup(message);
    });
    scheduleNextHourExecution();
}











//_________________________ GENERATION FUNCTIONS _________________________//
/**
 * Generates the number of animals based on the amount of time passed.
 * @param {number} amount - The amount of time passed
 * @returns {Object} - The number of each type of animal generated
 */
function generateAnimals(amount){
    return {
        "Pig": amount * pigpens,
        "Cow": amount * cowbarns,
        "Chicken": amount * chickencoops,
        "Goat": amount * goatbarns
    };
}
/**
 * Generates the animal products based on the amount of time passed.
 * @param {number} amount - The amount of time passed
 * @returns {Object} - The animal products generated
 */
function generateAnimalProduct(amount){
    const producedTruffles = pigpenLevel * amount;
    const producedMilk = cowbarnLevel * amount;
    const producedEggs = chickencoopLevel * amount;
    const producedWool = goatbarnLevel * amount;
    const truffles = ['Truffle', 'Bronze Truffle', 'Gold Truffle', 'Forest Truffle', 'Winter Truffle'];
    const milk = ['Milk', 'Chocolate Milk', 'Strawberry Milk', 'Soy Milk', 'Blueberry Milk'];
    const eggs = ['Egg', 'Rustic Egg', 'Crimson Egg', 'Emerald Egg', 'Sapphire Egg'];
    const wool = ['Wool', 'Alpaca Wool', 'Cashmere Wool', 'Irish Wool', 'Dolphin Wool'];
    const probabilities = [0.3975, 0.3, 0.2, 0.1, 0.025];
    let products ={};

    function addProduct(product){
        if (product in products) {
            products[product]++;
        } else {
            products[product] = 1;
        }
    }
    function getRandomIndex(weights) {
        const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);
        let randomNum = Math.random() * totalWeight;

        for (let i = 0; i < weights.length; i++) {
            randomNum -= weights[i];
            if (randomNum < 0) {
                return i;
            }
        }
    }
    for (let i = 0; i < producedTruffles; i++) {
        const type = truffles[getRandomIndex(probabilities)];
        addProduct(type);
    }
    for (let i = 0; i < producedMilk; i++) {
        const type = milk[getRandomIndex(probabilities)];
        addProduct(type);
    }
    for (let i = 0; i < producedEggs; i++) {
        const type = eggs[getRandomIndex(probabilities)];
        addProduct(type);
    }
    for (let i = 0; i < producedWool; i++) {
        const type = wool[getRandomIndex(probabilities)];
        addProduct(type);
    }
    return products;
}










//_________________________ API REQUESTS _________________________//
/**
 * Fetches the buildings from the server by fetching the level of each type of building.
 * @returns {Promise} - A promise that resolves when all building data has been fetched
 */
async function fetchBuildings(){
    await fetchBuildingLevel('Pigpen');
    await fetchBuildingLevel('Cowbarn');
    await fetchBuildingLevel('Chickencoop');
    await fetchBuildingLevel('Goatbarn');
}
/**
 * Fetches the level of a specific type of building from the server.
 * @param {string} buildingType - The type of building to fetch
 * @returns {Promise} - A promise that resolves when the building data has been fetched
 */
async function fetchBuildingLevel(buildingType) {
    try {
        const response = await fetch(`/api/fetch-building-information-by-type/${buildingType}`);
        const data = await response.json();
        if (data.status === 'success') {
            for (const buildingID in data.building_information) {
                const building = data.building_information[buildingID];
                if (building.unlock_level > LVL ) {
                    continue;
                }
                // Update the appropriate dictionary based on the building type
                switch (buildingType) {
                    case 'Pigpen':
                        pigpenLevel += building.level;
                        pigpens++;
                        break;
                    case 'Cowbarn':
                        cowbarnLevel += building.level;
                        cowbarns++;
                        break;
                    case 'Chickencoop':
                        chickencoopLevel += building.level;
                        chickencoops++;
                        break;
                    case 'Goatbarn':
                        goatbarnLevel += building.level;
                        goatbarns++;
                        break;
                    default:
                        console.error(`Unknown building type: ${buildingType}`);
                }
            }
        }
    } catch (error) {
        console.error(`Error fetching ${buildingType} information:`, error);
    }
}
/**
 * Fetches the user's level from the server.
 * @returns {Promise<number>} - A promise that resolves to the user's level
 */
async function fetchUserLevel(){
    try {
        const response = await fetch('/api/get-user-stats');
        const data = await response.json();
        return data.level;
    } catch (error) {
        console.error('Error fetching user stats:', error);
        return 0;
    }
}
/**
 * Fetches the last updated time from the server.
 * @returns {Promise} - A promise that resolves when the last updated time has been fetched
 */
async function fetchLastUpdated(){
    try {
        const response = await fetch('/api/animals');
        const data = await response.json();
        data.forEach(animal => {
            if (LastUpdated === null || LastUpdated < animal.last_updated) {
                LastUpdated = animal.last_updated;
            }
        });
    } catch (error) {
        console.error('Error fetching animal:', error);
    }
    try {
        const response = await fetch('/api/resources');
        const data = await response.json();
        data.forEach(resource => {
            if (LastUpdated === null || LastUpdated < resource.last_updated) {
                LastUpdated = resource.last_updated;
            }
        });
    } catch (error) {
        console.error('Error fetching animal:', error);
    }
}
/**
 * Sends the quantity of resources to the server.
 * @param {Object} data - The quantity of each type of resource
 * @returns {Promise} - A promise that resolves when the server has acknowledged the data
 */
async function sendResourceQuantity(data){
    let copy = { ...data };
    copy["idle"] = true;
    const BASE_URL = `${window.location.protocol}//${window.location.host}`;
    const fetchLink = BASE_URL + "/api/add-resources";
    try {
        const response = await fetch(fetchLink, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(copy)
        });

        if (response.ok) {
            const jsonResponse = await response.json();
            console.log('Resources updated successfully:', jsonResponse);
        } else {
            console.error('Failed to update resources:', response.status);
        }
    } catch (error) {
        console.error('Error occurred while updating resources:', error);
    }
}
/**
 * Sends the quantity of animals to the server.
 * @param {Object} data - The quantity of each type of animal
 * @returns {Promise} - A promise that resolves when the server has acknowledged the data
 */
async function sendAnimalQuantity(data){
    let copy = { ...data };
    copy["idle"] = true;
    const BASE_URL = `${window.location.protocol}//${window.location.host}`;
    const fetchLink = BASE_URL + "/api/add-animals";
    try {
        const response = await fetch(fetchLink, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(copy)
        });

        if (response.ok) {
            const jsonResponse = await response.json();
            console.log('Animals updated successfully:', jsonResponse);
        } else {
            console.error('Failed to update animals:', response.status);
        }
    } catch (error) {
        console.error('Error occurred while updating animals:', error);
    }
}




//_________________________ Display _________________________//
/**
 * Displays a popup message to the user.
 * @param {string} message - The message to display
 * @param total
 */
function displayPopup(message, total = 5) {
    const msPerItem = 350;
    const displayTime = msPerItem * total + 1000;
    const popup = document.getElementById('idle-popup');
    popup.innerHTML = message;
    popup.style.display = 'block';
    popup.style.opacity = 1;  // Ensure the popup is fully visible before starting the fade out

    // Show the popup
    popup.classList.remove('fade-out');

    // Set a timeout to fade out the popup after 3 seconds
    setTimeout(() => {
        popup.classList.add('fade-out');
    }, displayTime);

    // Set another timeout to hide the popup completely after the fade out animation
    setTimeout(() => {
        popup.style.opacity = 0;
    }, displayTime + 300);

    setTimeout(() => {
        popup.style.display = 'none';
    }, displayTime + 600);
}
/**
 * Formats a list of items for display.
 * @param {Object} items - The items to format
 * @returns {string} - The formatted string
 */
function formatItems(items) {
    return Object.entries(items).map(([key, value]) => `${value} ${key}`).join(', ');
}