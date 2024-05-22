// todo mss er voor zorgen dat de popup ook echt verdwijnt

// These are to make the code more readable and to avoid magic numbers
const values = 1;
const name = 0;
const maxLevel = 10;
let buildingID= "";

function Log6(x) {
    return Math.log(x) / Math.log(6);
}

/**
 * Toggles the pop-up. When pop-up is showing this function will hide it and vice-versa.
 */
export function togglePopup() {
    const popup = document.querySelector('.test-popup');
    popup.classList.toggle('show');
}

export let isPopupOpen = false;
let prevBuildingName = "";



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
 * @param building building information json found in buildingLayer.
 * @param buildingId The unique name of the building.
 */
export function openPopup(building, buildingId) {
    buildingID = buildingId;
    if (isPopupOpen && prevBuildingName !== buildingId) {
        closePopup();
        setTimeout(function() { // Wait 200 ms
            actualOpenPopup(building, buildingId);
        }, 100);
    } else {
        // If the popup is not already open, open it directly
        actualOpenPopup(building, buildingId);
    }
    prevBuildingName = buildingId
}

/**
 * This is the function that actually opens the pop-up.
 * @param building building information json found in buildingLayer.
 * @param buildingID The unique name of the building.
 */
export function actualOpenPopup(building, buildingID) {
    const popup = document.querySelector('.test-popup');
    fetchBuildingPopupInformation().then((info) => {
        const buildingInfo = info[building.general_information];

        // Set the building name and description
        document.getElementById('building-display-name').innerText = building.general_information;
        if (buildingInfo.hasOwnProperty('explanation')) {
            document.getElementById('building-explanation').innerText = buildingInfo.explanation;
        }

        // If the building has a UI, add a button to view it
        if (buildingInfo.hasOwnProperty('ui') && building.level > 0) {
            document.getElementById('building-explanation').innerHTML += '<button id="view-btn" class="view-btn"> <a href="' + buildingInfo.ui + '"><img src="../../static/img/UI/view_btn.png" alt="view"> </a> </button>';
        }

        // Only show upgrade button and stats for upgradable buildings
        const buildingStats = document.getElementById('building-stats');
        while (buildingStats.children.length > 3) {
            buildingStats.removeChild(buildingStats.lastChild);
        }
        const upgradeButton = document.getElementById('upgrade-button');
        if (!buildingInfo.hasOwnProperty('upgrade_costs') || building.level < 0) {
            upgradeButton.style.display = "none";
            buildingStats.style.display = "none";
            popup.classList.add('show');
            isPopupOpen = true;
            return;
        }
        upgradeButton.style.display = (building.level === maxLevel) ? "none" : "block";
        buildingStats.style.display = "block";

        // Display the building level
        document.getElementById('level-stat').innerText = "Level: " + building.level;


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
            augmentCostDiv.innerHTML = '';

            augmentCostDiv.appendChild(textNode);
            augmentCostDiv.appendChild(image);
        } else {
            document.getElementById('augment-btn').style.display = "none";
        }

        if (building.augment_level !== 10) {
            const upgradeCost = buildingInfo.upgrade_costs[`L${building.level+1}`];
            document.getElementById('building-upgrade-cost-number').innerText = '';
            for (let i = 0; i < upgradeCost.length; i++) {
                document.getElementById('building-upgrade-cost-number').innerText += upgradeCost[i][values] + " ";
                break; //TODO rest of costs
            }
        }


        // Set the building stats
        let statString = "";
        let augmentValue = 0;
        for (let i = 0; i < buildingInfo.other_stats.length; i++) {
            const stat = buildingInfo.other_stats[i];
            const baseStatValue = stat[values][building.level];

            if (Number.isInteger(baseStatValue)){
                augmentValue = augments.hasOwnProperty(stat[name]) ? augments[stat[name]] * building.augment_level : 0;
                statString = `${stat[name]}: ${baseStatValue + augmentValue}`;
                if (building.level !== maxLevel){
                    statString+= ` (+${stat[values][building.level+1] - stat[values][building.level]})`;
                }
            }else{
                statString = `${stat[name]}: ${baseStatValue}`;
                if(augments.hasOwnProperty(stat[name])){
                    if (augments[stat[name]].includes('building.augment_level')) {
                        augmentValue = augments[stat[name]].replace('building.augment_level', building.augment_level);
                    }
                    augmentValue = eval(augmentValue);
                    if (augmentValue % 1 !== 0) {
                        augmentValue.toFixed(2);
                    }
                    statString+= ` ${augmentValue}`;
                }
                if (building.level !== maxLevel){
                    statString+= ` (${stat[values][building.level+1]})`;
                }
            }


            const listItem = document.createElement('li');
            listItem.textContent = statString;
            buildingStats.appendChild(listItem);

        }
        popup.classList.add('show');
        isPopupOpen = true;
    });
}

/**
 * Closes the pop-up
 */
export function closePopup() {
    const popup = document.querySelector('.test-popup');
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
}

closeButton.addEventListener('mousedown', pressCloseButton);
closeButtonPressed.addEventListener('mouseup', releaseCloseButton);
closeButtonPressed.addEventListener('mouseleave', softReleaseCloseButton);

// ——————————————
// AUGMENT BUTTON

// This code is responsible for correctly applying the functionality of the augment button of the pop-up


function pressAugment() {
    document.getElementById('augment-image').src = "../../static/img/UI/augment_pbtn.png";
}

function releaseAugment() {
    document.getElementById('augment-image').src = "../../static/img/UI/augment_btn.png";
    document.getElementById('augment-cost').style.display = "none";
}

function hoverAugment() {
    document.getElementById('augment-cost').style.display = "block";
   // display cost and inmprovement stats
}

document.getElementById('augment-btn').addEventListener('mousedown', pressAugment);
document.getElementById('augment-btn').addEventListener('mouseover', hoverAugment);
document.getElementById('augment-btn').addEventListener('mouseup', releaseAugment);
document.getElementById('augment-btn').addEventListener('mouseleave', releaseAugment);



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
    upgradeButton.style.display = 'block';
    upgradeButtonPressed.style.display = 'none';
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
  const popup = document.querySelector('.test-popup');
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




/// — Helpers

function augmentCost(level) {
    return 50 * Math.pow(2, level) + 50;
}