import { buildingMap } from "./canvas.js";

/**
 * Toggles the pop-up. When pop-up is showing this function will hide it and vice-versa.
 */
export function togglePopup() {
    const popup = document.querySelector('.information-popup');
    popup.classList.toggle('show');
}

export let isPopupOpen = false;
let prevBuildingName = "";


// CHECKS FOR UPGRADE BUTTON
let currOpenedBuildingInformation;
let currOpenedBuildingGeneralInformation;
let isUpgradableBool = true;

function isUpgradable(buildingInformation, buildingGeneralInformation) {
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
    currOpenedBuildingInformation = buildingInformation
    currOpenedBuildingGeneralInformation = buildingGeneralInformation
}

/**
 * This is the function that actually opens the pop-up.
 * @param buildingInformation building information json found in buildingLayer.
 * @param buildingGeneralInformation building general information json found in buildingLayer.
 * @param buildingName The unique name of the building.
 */
export function actualOpenPopup(buildingInformation, buildingGeneralInformation, buildingName) {
    const popup = document.querySelector('.information-popup');

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
        debugger;
        buildingStats.style.display = "block";
        if (isUpgradable(buildingInformation, buildingGeneralInformation)) {
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

    popup.classList.add('show');
    isPopupOpen = true;
}

/**
 * Closes the pop-up
 */
export function closePopup() {
    const popup = document.querySelector('.information-popup');
    popup.classList.remove('show');
    isPopupOpen = false;
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
}
function releaseUpgradeButton() {
    if (isUpgradableBool) {
        upgradeButton.style.display = 'block';
        upgradeButtonPressed.style.display = 'none';
        // level += 1
        buildingMap.drawTiles();
    }
}

upgradeButton.addEventListener('mousedown', pressUpgradeButton);
upgradeButtonPressed.addEventListener('mouseup', releaseUpgradeButton);
upgradeButtonPressed.addEventListener('mouseleave', releaseUpgradeButton);

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