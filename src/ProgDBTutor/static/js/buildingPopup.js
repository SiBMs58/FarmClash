import { buildingMap } from "./canvas.js";
import { cropMap } from "./canvas.js";

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
    console.log(buildingName);
    currBuildingName = buildingName;
    currBuildingInfo = buildingInformation;
    // todo : check is max level, has resources, can be upgraded (level -1)
    let test = await upgrade_checks(buildingInformation, buildingGeneralInformation, buildingName);
    console.log(test);
    if ( test === true){
        console.log("true up if");
        isUpgradableBool = true;
        console.log("isupgrade true");
        return true; // ook nog true returnen
    }
    console.log("upgrade true");
    isUpgradableBool = false;
    return false; // ook nog true returnen
}

/**
 * Opens the pop-up. When another pop-up is already open it initialises a switch animation and delays the actual opening
 * of the pop-up.
 * @param buildingInformation building information json found in buildingLayer.
 * @param buildingGeneralInformation building general information json found in buildingLayer.
 * @param buildingName The unique name of the building.
 */
export function openPopup(buildingInformation, buildingGeneralInformation, buildingName) {
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
    currOpenedBuildingInformation = buildingInformation[buildingName]
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

    // Set all the right text elements
    const building = buildingInformation[buildingName];
    const generalInformation = buildingGeneralInformation[building.general_information];

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

    // Check if field and in phase 1
    if (buildingInformation[buildingName].general_information === "Field") {
        const fieldName = buildingInformation[buildingName].self_key;
        if (cropMap.isFieldEmpty(fieldName)) {
            cropPopup.classList.add('show');
        }
    }

    popup.classList.add('show');
    isPopupOpen = true;
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
// UPGRADE BUTTON

// This code is responsible for correctly applying the functionality of the upgrade button of the pop-up
const upgradeButton = document.getElementById('upgrade-button');
const upgradeButtonPressed = document.getElementById('upgrade-button-pressed');


function pressUpgradeButton() {
    upgradeButton.style.display = 'none';
    upgradeButtonPressed.style.display = 'block';
    console.log("press upgrade");
    console.log(1);
    console.log("silo");
    console.log(2);
    upgradeBuilding();

}
async function releaseUpgradeButton() {
    if (isUpgradableBool) {
        upgradeButton.style.display = 'block';
        upgradeButtonPressed.style.display = 'none';
        // level += 1
        buildingMap.drawTiles();
        await buildingMap.updateBuildingMapDB();
    }
}

upgradeButton.addEventListener('mousedown', pressUpgradeButton);
upgradeButtonPressed.addEventListener('mouseup', releaseUpgradeButton);
upgradeButtonPressed.addEventListener('mouseleave', releaseUpgradeButton);

// ——————————————
// UPGRADE CHECKS

async function fetchResources(resourceType) {
    const BASE_URL = `${window.location.protocol}//${window.location.host}`;
    try {
        let fetchLink = `${BASE_URL}/api/single-resource-quantity?resource_type=${resourceType}`;
        console.log("fetchResources() fetchLink: ", fetchLink);
        const response = await fetch(fetchLink);

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const resourceData = await response.json();
        console.log("Resource Data: ", resourceData);

        // Process the resource data as needed
        return resourceData.quantity;
    } catch (error) {
        console.error('fetchResources() failed:', error);
        throw error;
    }
}

async function upgrade_checks(buildingInformation, buildingGeneralInformation, buildingName) {
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
    console.log("curr lvl " + current_level);
    console.log(building_type);
    if (current_level>townhall_level && building_type !== "Townhall"){
        console.log("th false");
        return false;
    }
    if (current_level===10){
        console.log("lvl false");
        return false;
    }
    console.log("up true");
    return true;

    /*let current_resources = await fetchResources("Money");
    let upgrade_cost;*/

    /*if (building_type && current_level !== undefined) {
        // Second loop to check if the current level is the max level for this building type
        if (buildingGeneralInformation.hasOwnProperty(building_type)) {
            upgrade_cost = buildingGeneralInformation[building_type].upgrade_costs[current_level-1];
            if (current_resources<upgrade_cost){
                return false;
            }
            if (current_level === buildingGeneralInformation[building_type].maxLevel) {
                return true;
            } else {
                return false;
            }
        }*/

    // Return false if building type or current level is not found
}

/**
     * Upgrades a given building.
     * @returns {boolean} returns true if the upgrade was succesfull
     */

function upgradeBuilding(){
    console.log(currBuildingName);
    for (const key in currBuildingInfo) {
        console.log(buildingName);
        if (currBuildingName === currBuildingInfo[key].self_key) {
            currBuildingInfo[key].level = currBuildingInfo[key].level+1;
            console.log(currBuildingInfo[key].level);
            }
        }
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


const buttons = document.querySelectorAll(".crop-buttons-grid img");

function getCropName(url) {
    const filename = url.substring(url.lastIndexOf('/') + 1);
    return filename.split('Button')[0];
}

document.addEventListener("DOMContentLoaded", function() {
    const buttons = document.querySelectorAll(".crop-buttons-grid img");

    buttons.forEach(button => {
        const originalSrc = button.src;
        const pressedSrc = originalSrc.replace("Button.png", "PressedButton.png");

        // Add mousedown event to change the src to the pressed version
        button.addEventListener("mousedown", function() {
            button.src = pressedSrc;
        });

        // Add mouseup event to revert src and handle hard release
        button.addEventListener("mouseup", function() {
            if (button.src === pressedSrc) {
                button.src = originalSrc;
                const cropType = getCropName(originalSrc);
                console.log(cropType + " has been pressed");
                closeCropPopup()
                const field = currOpenedBuildingInformation.self_key;
                cropMap.plantCrop(cropType, field);
                debugger;
            }
        });

        // Add mouseleave event to revert src and handle soft release
        button.addEventListener("mouseleave", function() {
            if (button.src === pressedSrc) {
                button.src = originalSrc;
            }
        });
    });
});

