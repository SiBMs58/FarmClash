import { buildingMap } from "./canvas.js";
import { cropMap } from "./canvas.js";
import { FIELD_GENERAL_INFO_NAME } from "./buildingLayer.js";

// These are to make the code more readable and to avoid magic numbers
const values = 1;
const name = 0;
const maxLevel = 10;
let buildingID= "";
let buildingData ={};

function Log6(x) {
    return Math.log(x) / Math.log(6);
}


/**
 * Toggles the pop-up. When pop-up is showing this function will hide it and vice-versa.
 */
export function togglePopup() {
    const popup = document.querySelector('.information-popup');
    const cropPopup = document.querySelector('.cropSelector');
    popup.classList.toggle('show');
    cropPopup.classList.toggle('show');
}

export let isPopupOpen = false;
let prevBuildingName = "";

let buildingName;
let building


// CHECKS FOR UPGRADE BUTTON
let currOpenedBuildingInformation;
//let currOpenedBuildingGeneralInformation;
let isUpgradableBool = true;
let currBuildingName;
let currBuildingInfo;

async function isUpgradable(buildingInformation, buildingGeneralInformation, buildingName) {
    // Check if the building is already at max level
    if (buildingInformation[buildingName].level === maxLevel) {
        isUpgradableBool = false;
        return false;
    }

    console.log(buildingName);

    // Perform upgrade checks asynchronously
    try {
        const canUpgrade = await upgrade_checks(buildingInformation, buildingGeneralInformation, buildingName);
        console.log(canUpgrade);
        isUpgradableBool = canUpgrade;
        return canUpgrade;
    } catch (error) {
        console.error('Error during upgrade checks:', error);
        isUpgradableBool = false;
        return false;
    }
}


async function fetchBuildingPopupInformation() {
    try {
        const response = await fetch('/static/img/assets/building.json');
        return await response.json();
    } catch (error) {
        console.error('fetchBuildingPopupInformation() failed:', error);
        throw error;
    }
}

/**
 * Opens the pop-up. When another pop-up is already open it initialises a switch animation and delays the actual opening
 * of the pop-up.
 * @param buildingInformation building information json found in buildingLayer.
 * @param buildingGeneralInformation building general information json found in buildingLayer.
 * @param buildingName The unique name of the building.
 */
export function openPopup(buildingInformation, buildingGeneralInformation, buildingName) {
    buildingID = buildingName;
    buildingData = buildingInformation[buildingName];
    currOpenedBuildingInformation = buildingInformation[buildingName]
    if (isPopupOpen && (prevBuildingName !== buildingName)) {
        closePopup();
        setTimeout(function() { // Wait 200 ms
            actualOpenPopup(buildingInformation, buildingGeneralInformation, buildingName);
        }, 100);
    } else {
        // If the popup is not already open, open it directly
        actualOpenPopup(buildingInformation, buildingGeneralInformation, buildingName);
    }
    prevBuildingName = buildingName;
    //currOpenedBuildingGeneralInformation = buildingGeneralInformation[buil]
}

/**
 * This is the function that actually opens the pop-up.
 * @param buildingInformation building information json found in buildingLayer.
 * @param buildingGeneralInformation building general information json found in buildingLayer.
 * @param buildingName The unique name of the building.
 */
export function actualOpenPopup(buildingInformation, buildingGeneralInformation, buildingName) {
    const popup = document.querySelector('.information-popup');
    const cropPopup = document.querySelector('.cropSelector');
    /**
     document.getElementById('building-display-name').innerText = generalInformation.display_name;
    document.getElementById('building-explanation').innerText = generalInformation.explanation;
    const buildingStats = document.getElementById('building-stats');
    const upgradeButton = document.getElementById('upgrade-button');
    const upgradeButtonPressed = document.getElementById('upgrade-button-pressed');
    if (building.level === -1) {
        buildingStats.style.display = "none";
        upgradeButton.style.display = "none";
    } else {
        buildingStats.style.display = "block";
        if (isUpgradable(buildingInformation, buildingGeneralInformation, buildingName)) {
            upgradeButton.style.display = "block";
        } else {
            upgradeButton.style.display = "none";
            upgradeButtonPressed.style.display = "block";
        }
        document.getElementById('level-stat').innerText = "Level: " + building.level;
        document.getElementById('building-upgrade-cost-number').innerText = generalInformation.upgrade_costs[building.level-1]
        const list = document.getElementById('building-stats');
        const listLength = list.children.length;
        for (let i = listLength-1; i > 2; i--) {
            //debugger;
            list.removeChild(list.children[i]);
        }
        for (let i = 0; i < generalInformation.other_stats.length; i++) {
            const currStat = generalInformation.other_stats[i];
            const upgradeDifference = currStat[1][building.level] - currStat[1][building.level-1];
            const statString = currStat[0] + ": " +  currStat[1][building.level-1] + " (+" + upgradeDifference + ")";
            const listItem = document.createElement('li');
            listItem.textContent = statString;
            list.appendChild(listItem);
        }
    }
     */

    fetchBuildingPopupInformation().then((info) => {
        const building = buildingInformation[buildingName];
        const buildingInfo = info[building.general_information];

        // Set the building name and description
        document.getElementById('display-name').innerText = buildingGeneralInformation[building.general_information].display_name;
        if (buildingInfo.hasOwnProperty('explanation')) {
            document.getElementById('explanation').innerText = buildingInfo.explanation;
        }

        // If the building has a UI, add a button to view it
        if (buildingInfo.hasOwnProperty('ui')) {
            document.getElementById('view-UI').href = buildingInfo.ui;
            document.getElementById('view-btn').style.display = 'block';
        }else{
            document.getElementById('view-btn').style.display = 'none';
        }


        // Clear the building stats
        const buildingStats = document.getElementById('stats');
        const augmentStats = document.getElementById('augment-stats');
        while (buildingStats.children.length > 3) {
            buildingStats.removeChild(buildingStats.lastChild);
        }
        while (augmentStats.children.length > 3) {
            augmentStats.removeChild(augmentStats.lastChild);
        }

        // Only show upgrade button and stats for upgradable buildings
        const upgradeButton = document.getElementById('upgrade-button');
        if (!buildingInfo.hasOwnProperty('upgrade_costs') || building.level < 0) {
            upgradeButton.style.display = "none";
            buildingStats.style.display = "none";
            popup.classList.add('show');
            isPopupOpen = true;
            return;
        }
        isUpgradable(buildingInformation, info, buildingName).then((result) => {
            if (result) {
                upgradeButton.style.display = "block";
                document.getElementById('upgrade-button-pressed').style.display = "none";
            } else {
                upgradeButton.style.display = "none";
                document.getElementById('upgrade-button-pressed').style.display = "block";
            }
        });
        buildingStats.style.display = "block";


        // Display the building levels
        document.getElementById('level-stat').innerText = "Level: " + building.level;
        document.getElementById('augment-level-stat').innerText = "Augment Level: " + building.augment_level;


        // Augment button and map augment stats if building can be augmented
        let augments = {};
        if (buildingInfo.hasOwnProperty('augment')) {
            document.getElementById('augment-btn').style.display = "block";
            buildingInfo.augment.forEach(augment => {
                augments[augment[name]] = augment[values];
            });
            const image = document.createElement("img");
            image.src = "../../static/img/resources/Coin.png";
            image.alt = "🪙";
            image.draggable = false;
            let textNode = document.createTextNode(augmentCost(building.augment_level));
            let augmentCostDiv = document.getElementById('augment-cost');
            augmentCostDiv.innerHTML = 'Augment: ';

            augmentCostDiv.appendChild(textNode);
            augmentCostDiv.appendChild(image);
        } else {
            document.getElementById('augment-btn').style.display = "none";
        }

        // Display the upgrade cost
        let costDiv = document.getElementById('upgrade-cost');
        if (building.level !== maxLevel) {
            const upgradeCost = buildingInfo.upgrade_costs[`L${building.level+1}`];
            costDiv.innerHTML = 'Upgrade: ';
            for (let i = 0; i < upgradeCost.length; i++) {
                let value = document.createTextNode(upgradeCost[i][values]);
                costDiv.appendChild(value);

                let resourceImg = getResourceImg(upgradeCost[i][name]);
                costDiv.appendChild(resourceImg);

                let space = document.createTextNode('  ');
                costDiv.appendChild(space);
            }
        }else{
            costDiv.innerHTML = 'Max Level';
        }



        // Set the building stats
        let statString = "";
        let augmentString = "";
        let augmentValue = 0;
        let augmentUpgrade = '';
        for (let i = 0; i < buildingInfo.other_stats.length; i++) {
            const stat = buildingInfo.other_stats[i];
            const baseStatValue = stat[values][building.level];
            if (Number.isInteger(baseStatValue)){
                augmentValue = 0;
                augmentUpgrade = '';
                if (augments.hasOwnProperty(stat[name])){
                    augmentValue = augments[stat[name]] * building.augment_level
                    augmentUpgrade= ` (+${augments[stat[name]]})`;
                }
                augmentString= `${stat[name]}: ${baseStatValue + augmentValue}` + augmentUpgrade;
                statString = `${stat[name]}: ${baseStatValue + augmentValue}`;
                if (building.level !== maxLevel){
                    statString+= ` (+${stat[values][building.level+1] - stat[values][building.level]})`;
                }

            }else{
                statString = `${stat[name]}: ${baseStatValue}`;
                augmentString = '';
                if (baseStatValue === 'inf'){
                    statString = `${stat[name]}: Ꝏ`;
                    augmentString = `${stat[name]}: Ꝏ`;
                }else if(augments.hasOwnProperty(stat[name])){
                    augmentString = `${stat[name]}: ${baseStatValue}`;
                    augmentValue = augments[stat[name]];
                    let nextAugmentValue = augmentValue;
                    if (augmentValue.includes('building.augment_level')) {
                        augmentValue = augmentValue.replace('building.augment_level', building.augment_level);
                        nextAugmentValue = nextAugmentValue.replace('building.augment_level', building.augment_level+1);
                    }
                    augmentValue = parseFloat(eval(augmentValue));
                    nextAugmentValue = parseFloat(eval(nextAugmentValue));
                    augmentValue = (augmentValue % 1 !== 0) ? augmentValue.toFixed(2) : augmentValue;
                    nextAugmentValue = (nextAugmentValue % 1 !== 0) ? nextAugmentValue.toFixed(2) : nextAugmentValue;
                    statString+= ` ${augmentValue}`;
                    augmentString += ` ${augmentValue} (${nextAugmentValue})`;

                }
                if (building.level !== maxLevel){
                    statString+= ` (${stat[values][building.level+1]})`;
                }
            }


            const list1 = document.createElement('li');
            list1.textContent = statString;
            buildingStats.appendChild(list1);
            const list2 = document.createElement('li');
            list2.textContent = augmentString;
            augmentStats.appendChild(list2);
        }

        // Check if field and in phase 1
        if (buildingInformation[buildingName].general_information === FIELD_GENERAL_INFO_NAME) {
            const fieldName = buildingInformation[buildingName].self_key;
            if (cropMap.isFieldEmpty(fieldName)) {
                cropPopupPreparation();
                cropPopup.classList.add('show');
            }
        }

        popup.classList.add('show');
        isPopupOpen = true;
    });
}

function cropPopupPreparation() {
    const buttons = document.querySelectorAll(".crop-buttons-grid img");
    const fieldLevel = currOpenedBuildingInformation.level;

    const cropUnlockLevels = {
        "Wheat": 1,
        "Carrot": 2,
        "Corn": 3,
        "Lettuce": 4,
        "Tomato": 5,
        "Turnip": 6,
        "Zucchini": 7,
        "Parsnip": 8,
        "Cauliflower": 9,
        "Eggplant": 10
    };

    buttons.forEach(button => {
        let originalSrc = button.src;
        let pressedSrc;
        if (originalSrc.includes("PressedButton.png")) {
            pressedSrc = originalSrc;
            originalSrc = pressedSrc.replace("PressedButton.png", "Button.png");
        } else {
            pressedSrc = originalSrc.replace("Button.png", "PressedButton.png");
        }

        const buttonId = button.id;
        const buttonCropName = buttonId.replace("-button-selector", "");
        const cropUnlockLevel = cropUnlockLevels[buttonCropName];

        if (cropUnlockLevel > fieldLevel) {
            button.src = pressedSrc;
        } else {
            button.src = originalSrc;
        }
    });
}



/**
 * Closes the pop-up and the possible crop popup
 */
export function closePopup() {
    const popup = document.querySelector('.information-popup');
    const cropPopup = document.querySelector('.cropSelector');
    popup.classList.remove('show');
    cropPopup.classList.remove('show');
    isPopupOpen = false;
}

function closeCropPopup() {
    const cropPopup = document.querySelector('.cropSelector');
    cropPopup.classList.remove('show');
}

// ————————————
// CLOSE BUTTON

// This code is responsible for correctly applying the functionality of the close button of the pop-up

const closeButton = document.getElementById('close-button');
const closeButtonPressed = document.getElementById('close-button-pressed');

function pressCloseButton() {
    closeButton.style.display = 'none';
    closeButtonPressed.style.display = 'block';
}
function softReleaseCloseButton() {
    closeButton.style.display = 'block';
    closeButtonPressed.style.display = 'none';
}
function releaseCloseButton() {
    softReleaseCloseButton()
    closePopup()
    console.log("Release upgrade button")
}

closeButton.addEventListener('mousedown', pressCloseButton);
closeButtonPressed.addEventListener('mouseup', releaseCloseButton);
closeButtonPressed.addEventListener('mouseleave', softReleaseCloseButton);

// ——————————————
// AUGMENT BUTTON

// This code is responsible for correctly applying the functionality of the augment button of the pop-up

let mouseIsDown = false;

async function sendAugmentLevel(level) {
    const BASE_URL = `${window.location.protocol}//${window.location.host}`;
    const fetchLink = BASE_URL + "/api/update-augment-level/" + buildingID;
    try {
        const response = await fetch(fetchLink, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                augment_level: level,
                cost: augmentCost(level-1)
            }),
        });
        return response.json();
    } catch (error) {
        console.error('Error:', error);
    }
}

function pressAugment() {
    document.getElementById('augment-image').src = "../../static/img/UI/augment_pbtn.png";
    mouseIsDown = true;
    buildingData.augment_level++;
    sendAugmentLevel(buildingData.augment_level).then(data => {
        if(data['status'] !== 'success'){
            buildingData.augment_level--;
        }
    });
}

function releaseAugment() {
    document.getElementById('augment-image').src = "../../static/img/UI/augment_btn.png";
    mouseIsDown = false;
    document.getElementById('augment-stats').style.display = "none";
    document.getElementById('augment-cost').style.display = "none";
    document.getElementById('stats').style.display = "block";
    document.getElementById('upgrade-cost').style.display = "flex";
}

function hoverAugment() {
    document.getElementById('augment-stats').style.display = "block";
    document.getElementById('augment-cost').style.display = "flex";
    document.getElementById('stats').style.display = "none";
    document.getElementById('upgrade-cost').style.display = "none";
   // display cost and inmprovement stats
}

function leaveAugment() {
    if (!mouseIsDown) {
        releaseAugment();
    }
}

document.getElementById('augment-btn').addEventListener('mousedown', pressAugment);
document.getElementById('augment-btn').addEventListener('mouseover', hoverAugment);
document.getElementById('augment-btn').addEventListener('mouseup' ,()=>{
    document.getElementById('augment-image').src = "../../static/img/UI/augment_btn.png";
    mouseIsDown=false;
    closePopup();
});
document.getElementById('augment-btn').addEventListener('mouseleave', leaveAugment);



// ——————————————
// UPGRADE BUTTON

// This code is responsible for correctly applying the functionality of the upgrade button of the pop-up
const upgradeButton = document.getElementById('upgrade-button');
const upgradeButtonPressed = document.getElementById('upgrade-button-pressed');


function pressUpgradeButton() {
    upgradeButton.style.display = 'none';
    upgradeButtonPressed.style.display = 'block';
    upgradeBuilding();
    mouseIsDown = true;
}
async function releaseUpgradeButton() {
    if (isUpgradableBool) {
        upgradeButton.style.display = 'block';
        upgradeButtonPressed.style.display = 'none';
        buildingMap.drawTiles();
        await buildingMap.updateBuildingMapDB();

    }
    if (mouseIsDown) {
         closePopup();
         mouseIsDown = false;
    }
}

upgradeButton.addEventListener('mousedown', pressUpgradeButton);
upgradeButtonPressed.addEventListener('mouseup', releaseUpgradeButton);
upgradeButtonPressed.addEventListener('mouseleave', releaseUpgradeButton);

// ——————————————
// UPGRADE FUNCTIONS USED FOR UPGRADING AND CHECKS

async function fetchResources() {
        const BASE_URL = `${window.location.protocol}//${window.location.host}`;
        try {
            let fetchLink = BASE_URL + "/api/resources";
            console.log("fetchResources() fetchLink: ", fetchLink);
            const response = await fetch(fetchLink);
            console.log("fetchResources() success");
            return await response.json();

        } catch(error) {
            console.error('fetchResources() failed:', error);
            throw error;
        }
    }

async function updateResources(resource, count) {
    const resources = {
        [resource]: count // Use the resource as the key and the count as the value
    };
    const BASE_URL = `${window.location.protocol}//${window.location.host}`;
    const fetchLink = `${BASE_URL}/api/add-resources`;

    try {
        const response = await fetch(fetchLink, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(resources) // Send the serialized resource data as the request body
        });

        if (response.ok) {
            const jsonResponse = await response.json();
            console.log('Resources DB update successful:', jsonResponse);
        } else {
            console.error('Add-resources DB update failed with status:', response.status);
        }
    } catch (error) {
        console.error('Failed to update resources:', error);
    }
}

let curr_level_cost;

/**
 *  checks the if the building can be upgraded, checks include:
 *  max level, has enaugh resources and townhall level
 * @param buildingInformation
 * @param info
 * @param buildingName
 * @returns {Promise<boolean>}
 */

async function upgrade_checks(buildingInformation, info, buildingName) {
    let building_type;
    let current_level;
    let townhall_level;

    // First loop to find the building's type and current level
    for (const key in buildingInformation) {
        if (buildingInformation.hasOwnProperty(key)) {
            if (buildingName === buildingInformation[key].self_key) {
                building_type = buildingInformation[key].general_information;
                current_level = buildingInformation[key].level;
            }
            if ("townhall" === buildingInformation[key].self_key) {
                console.log("th lvl " + buildingInformation[key].level);
                townhall_level = buildingInformation[key].level;
            }
        }
    }

    // Check constraints: building level can't be higher than townhall level (except townhall itself)
    if (current_level > townhall_level && building_type !== "Townhall") {
        return false;
    }

    // Check max level constraint
    if (current_level === 10) {
        return false;
    }

    // Check if the user has enough resources for the next level upgrade
    if (info.hasOwnProperty(building_type)) {
        let upgrade_cost = info[building_type].upgrade_costs;
        let next_level_key = `L${current_level + 1}`;
        let next_level_cost = upgrade_cost[next_level_key];
        curr_level_cost = next_level_cost;


        let resourcesQuantity = await fetchResources();

        for (const cost of next_level_cost) {
            const resourceType = cost[0];
            const requiredAmount = cost[1];
            const availableResource = resourcesQuantity.find(resource => resource.resource_type === resourceType);

            if (!availableResource || availableResource.amount < requiredAmount) {
                return false;
            }
        }
    }

    console.log("up true");
    return true;
}

/**
 * Upgrades a given building.
 * subtracts the cost from the user
 * @returns {boolean} returns true if the upgrade was succesfull
 */

async function upgradeBuilding(){
    currOpenedBuildingInformation.level +=1;
    console.log(curr_level_cost);
    for (const cost of curr_level_cost){
        await updateResources(cost[0], -cost[1]);
    }
    console.log(currOpenedBuildingInformation.level);
}


// ——————————————————
// SET POPUP POSITION (min gap of 70px for the top)

/**
 * Correctly adjusts the position of the pop-up relative to the screen size.
 */
function adjustPopupPosition() {
  const popup = document.querySelector('.information-popup');
  if (!popup) return;

  const viewportHeight = window.innerHeight;
  const popupHeight = popup.offsetHeight;
  const desiredTopPosition = (viewportHeight - popupHeight) / 2;

  if (desiredTopPosition < 70) {
    popup.style.top = '70px';
    popup.style.transform = 'translateY(0)'; // Reset transform when adjusting top directly
  } else {
    popup.style.top = '50%';
    popup.style.transform = 'translateY(-50%)'; // Re-apply centering transform
  }
}

window.onload = adjustPopupPosition;
window.onresize = adjustPopupPosition;


//const buttons = document.querySelectorAll(".crop-buttons-grid img");

// ——————————————————
// CROP POPUP LOGIC

function getCropName(url) {
    const filename = url.substring(url.lastIndexOf('/') + 1);
    return filename.split('Button')[0];
}



document.addEventListener("DOMContentLoaded", function() {
    const buttons = document.querySelectorAll(".crop-buttons-grid img");

    const cropUnlockLevels = {
        "Wheat": 1,
        "Carrot": 2,
        "Corn": 3,
        "Lettuce": 4,
        "Tomato": 5,
        "Turnip": 6,
        "Zucchini": 7,
        "Parsnip": 8,
        "Cauliflower": 9,
        "Eggplant": 10
    };

    buttons.forEach(button => {
        const originalSrc = button.src;
        const pressedSrc = originalSrc.replace("Button.png", "PressedButton.png");
        const buttonId = button.id;
        const buttonCropName = buttonId.replace("-button-selector", "");
        const cropUnlockLevel = cropUnlockLevels[buttonCropName];

        // Add mousedown event to change the src to the pressed version
        button.addEventListener("mousedown", function() {
            const fieldLevel = currOpenedBuildingInformation.level;
            if (cropUnlockLevel <= fieldLevel) {
                console.log("mouse down on allowed crop");
                button.src = pressedSrc;
            } else {
                console.log("mouse down on not an allowed crop");
            }
        });

        // Add mouseup event to revert src and handle hard release
        button.addEventListener("mouseup", function() {
            const fieldLevel = currOpenedBuildingInformation.level;
            if (cropUnlockLevel <= fieldLevel) {
                if (button.src === pressedSrc) {
                    button.src = originalSrc;
                    const cropType = getCropName(originalSrc);
                    console.log(cropType + " has been pressed");
                    closeCropPopup()
                    const field = currOpenedBuildingInformation.self_key;
                    cropMap.plantCrop(cropType, field);
                }
            }
        });

        // Add mouseleave event to revert src and handle soft release
        button.addEventListener("mouseleave", function() {
            const fieldLevel = currOpenedBuildingInformation.level;
            if (cropUnlockLevel <= fieldLevel) {
                if (button.src === pressedSrc) {
                    button.src = originalSrc;
                }
            }
        });
    });
});






/// — Helpers

function augmentCost(level) {
    return 50 * Math.pow(2, level) + 50;
}

function getResourceImg(resource) {
    const typeDir = {
        '': ['Money'],
        'crops/': ["Wheat", "Carrot", "Corn", "Lettuce", "Tomato", "Turnip", "Zucchini", "Parsnip", "Cauliflower", "Eggplant"],
        'raws/': ["Stick", "Plank", "Stone", "Ingot", "Log"],
        'animalproduct/': ['Egg', 'Rustic Egg', 'Crimson Egg', 'Emerald Egg', 'Sapphire Egg',
                    'Milk', 'Chocolate Milk','Strawberry Milk', 'Soy Milk', 'Blueberry Milk',
                    'Truffle', 'Bronze Truffle', 'Gold Truffle', 'Forest Truffle', 'Winter Truffle',
                    'Wool', 'Alpaca Wool', 'Cashmere Wool', 'Irish Wool', 'Dolphin Wool']
    }

    let pngName = '';
    let dir = '';
    const img = document.createElement('img');
    for (const [key, value] of Object.entries(typeDir)) {
        if (!value.includes(resource)) continue;
        pngName = (resource === 'Money') ? 'Coin' : spaceTo_(resource);
        dir = key;
        img.src = '../../static/img/resources/' + dir + pngName + '.png';
        img.alt = resource;
        img.draggable = false;
        img.title = resource;
        return img;
    }
}
function spaceTo_(input) {
    return input.replace(/ /g, '_');
}