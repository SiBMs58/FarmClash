const slider = document.getElementById('slider');
const slides = document.querySelectorAll('.slide');
const statsContainer = document.getElementById('stats-container');
let LVL = 0;
let ATK = 0;
let DEF = 0;
let COINS = 0;
import {defaultBuildingMapData} from "./../Data/defaultBuildingMapData.js";


initialize();

async function initialize() {
    createSlides();
    await fetchStats(); // Wait for fetchStats to complete
    slides.forEach(slide => {
        slide.style.display = slide.dataset.level === LVL.toString() ? 'block' : 'none';
    });
    displayStats();     // Call displayStats after fetchStats has resolved
    slider.value = LVL;
}


async function fetchStats() {
    const response = await fetch('/api/get-user-stats');
    const data = await response.json();
    LVL = data.level;
    ATK = data.attack;
    DEF = data.defense;
    COINS = data.coins;
}




slider.addEventListener('input', () => {
    const value = slider.value;
    slides.forEach(slide => {
        slide.style.display = slide.dataset.level === value.toString() ? 'block' : 'none';
    });
});

function displayStats() {
    const statsContainer = document.getElementById("stats");
    const statsDivs = statsContainer.querySelectorAll('.stat');
    let level = getAmountImage(LVL) + `<img src="../../static/img/UI/LVL.png" alt="LVL" title="Level" draggable="false">`;
    let attack = getAmountImage(ATK) + `<img src="../../static/img/UI/ATK.png" alt="ATK" title="Attack Points" draggable="false">`;
    let defense = getAmountImage(DEF) + `<img src="../../static/img/UI/DEF.png" alt="DEF" title="Defense Points" draggable="false">`;
    let coins = getAmountImage(COINS) + `<img src="../../static/img/UI/COINS.png" alt="COINS" title="Coins" draggable="false">`;

    statsDivs[0].innerHTML = attack;
    statsDivs[1].innerHTML = defense;
    statsDivs[2].innerHTML = level;
    statsDivs[3].innerHTML = coins;
}

function getAmountImage(amount) {
    const amountStr = amount.toString().split('');

    const imgTags = amountStr.map(digit => {
        if (digit === '.') {
            return `<img src="../../static/img/UI/dot.png" alt="dot" draggable="false">`;
        }
        return `<img src="../../static/img/UI/${digit}.png" alt="${digit}" draggable="false">`;
    });

    return imgTags.join('');
}
function handleVisibilityChange() {
    if (document.hidden) {
        // If the page is hidden, change favicon to the sad one
        document.getElementById('favicon').href = './../../static/img/ico/dead.ico';
    } else {
        // If the page is visible, change favicon to the base one
        document.getElementById('favicon').href = './../../static/img/ico/happy.ico';
    }
}
function createSlides(){
    const crops = ['Wheat', 'Carrot', 'Corn', 'Lettuce', 'Tomato', 'Turnip', 'Zucchini', 'Parsnip', 'Cauliflower', 'Eggplant'];
    const buildings = defaultBuildingMapData.building_information;
    const info = defaultBuildingMapData.building_general_information;
    const buildingToSlide = {};
    const generalIndex = 1;
    const unlockIndex = 0;

    function getAtCommaIndex(key, index) {
        const items = key.split(',').map(item => item.trim());
        return items[index];
    }

    for (const key in buildings) {
        const building = buildings[key];
        if(building.general_information === 'Townhall') continue
        if(buildingToSlide[[building.unlock_level, building.general_information]]){
            buildingToSlide[[building.unlock_level, building.general_information]]++;
        }else{
            buildingToSlide[[building.unlock_level, building.general_information]] = 1;
        }

    }
    for (const key in buildingToSlide) {
        const slide = document.getElementById('slide-'+getAtCommaIndex(key, unlockIndex));
        const unlock = document.createElement('div');

        unlock.textContent  = buildingToSlide[key] + " x " + info[getAtCommaIndex(key, generalIndex)].display_name;
        slide.appendChild(unlock);
    }
    for(let i = 0; i < crops.length; i++){
        const slide = document.getElementById('slide-'+i);
        const unlock = document.createElement('div');
        unlock.textContent = crops[i];
        slide.appendChild(unlock);
    }

}

// Listen for visibility change events
document.addEventListener('visibilitychange', handleVisibilityChange);
