let pigpenLevel = 0;
let cowbarnLevel = 0;
let chickencoopLevel = 0;
let goatbarnLevel = 0;
let LastUpdated = new Date();



//_________________________ INITIALIZATION _________________________//
initialize();
function initialize(){
    fetchBuildings().then(() => {
        fetchLastUpdated().then(() => {
            updateOfflineProduction();
            scheduleNextHourExecution();
        });
    });
}









//_________________________ UPDATE FOR OFFLINE TIME _________________________//
function updateOfflineProduction(){
    const now = new Date();
    const hours = (now - LastUpdated) / 1000 / 60 / 60;
    const animals = generateAnimals(hours);
    const products = generateAnimalProduct(hours);
    sendAnimalQuantity(animals);
    sendResourceQuantity(products);

}










//_________________________ SCHEDULING FUNCTIONS _________________________//
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
function setupNextHour(){
    pigpenLevel = 0;
    cowbarnLevel= 0;
    chickencoopLevel = 0;
    goatbarnLevel = 0;
    fetchBuildings().then(() => {
        sendResourceQuantity(generateAnimalProduct(1));
        sendAnimalQuantity(generateAnimals(1));
    });
    scheduleNextHourExecution();
}











//_________________________ GENERATION FUNCTIONS _________________________//
function generateAnimals(hours){
    let amount = Math.floor(hours);
    return {
        "Pig": amount,
        "Cow": amount,
        "Chicken": amount,
        "Goat": amount
    };
}
function generateAnimalProduct(hours){
    const amount = Math.floor(hours);
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
async function fetchBuildings(){
    await fetchBuildingLevel('Pigpen');
    await fetchBuildingLevel('Cowbarn');
    await fetchBuildingLevel('Chickencoop');
    await fetchBuildingLevel('Goatbarn');
}
async function fetchBuildingLevel(buildingType) {
    try {
        const response = await fetch(`/api/fetch-building-information-by-type/${buildingType}`);
        const data = await response.json();
        if (data.status === 'success') {
            for (const buildingID in data.building_information) {
                const building = data.building_information[buildingID];
                /*
                TODO
                if (!building.unlocked) {
                    return;
                }
                 */
                // Update the appropriate dictionary based on the building type
                switch (buildingType) {
                    case 'Pigpen':
                        pigpenLevel += building.level;
                        break;
                    case 'Cowbarn':
                        cowbarnLevel += building.level;
                        break;
                    case 'Chickencoop':
                        chickencoopLevel += building.level;
                        break;
                    case 'Goatbarn':
                        goatbarnLevel += building.level;
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
async function sendResourceQuantity(data){
    data["idle"] = true;
    const BASE_URL = `${window.location.protocol}//${window.location.host}`;
    const fetchLink = BASE_URL + "/api/add-resources";
    try {
        const response = await fetch(fetchLink, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
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
async function sendAnimalQuantity(data){
    data["idle"] = true;
    const BASE_URL = `${window.location.protocol}//${window.location.host}`;
    const fetchLink = BASE_URL + "/api/add-animals";
    try {
        const response = await fetch(fetchLink, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
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
