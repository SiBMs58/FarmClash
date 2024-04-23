// todo mss er voor zorgen dat de popup ook echt verdwijnt
// Toggle popup
export function togglePopup() {
    const popup = document.querySelector('.test-popup');
    popup.classList.toggle('show');
}

export let isPopupOpen = false;
let prevBuildingName = "";

export function openPopup(buildingInformation, buildingGeneralInformation, buildingName) {
    if (isPopupOpen && prevBuildingName !== buildingName) {
        closePopup();
        setTimeout(function() { // Wait 200 ms
            actualOpenPopup(buildingInformation, buildingGeneralInformation, buildingName);
        }, 100);
    } else {
        // If the popup is not already open, open it directly
        actualOpenPopup(buildingInformation, buildingGeneralInformation, buildingName);
    }
    prevBuildingName = buildingName
}

export function actualOpenPopup(buildingInformation, buildingGeneralInformation, buildingName) {
    const popup = document.querySelector('.test-popup');

    // Set all the right text elements
    const building = buildingInformation[buildingName];
    const generalInformation = buildingGeneralInformation[building.general_information];

    document.getElementById('building-display-name').innerText = generalInformation.display_name;
    document.getElementById('building-explanation').innerText = generalInformation.explanation;
    const buildingStats = document.getElementById('building-stats');
    const upgradeButton = document.getElementById('upgrade-button');
    if (building.level === -1) {
        buildingStats.style.display = "none";
        upgradeButton.style.display = "none";
    } else {
        buildingStats.style.display = "block";
        upgradeButton.style.display = "block";
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

export function closePopup() {
    const popup = document.querySelector('.test-popup');
    popup.classList.remove('show');
    isPopupOpen = false;
}

// ————————————
// CLOSE BUTTON

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
// UPGRADE BUTTON

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