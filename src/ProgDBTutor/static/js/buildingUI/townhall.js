const slider = document.getElementById('slider');
const slides = document.querySelectorAll('.slide');
const statsContainer = document.getElementById('stats-container');
let LVL = 5;
let ATK = 55360;
let DEF = 993422;
let COINS = 903935;


initialize()


function initialize() {
    slides.forEach(slide => {
        slide.style.display = slide.dataset.level === LVL.toString() ? 'block' : 'none';
    });
    slider.value = LVL;
    displayStats();
}



slider.addEventListener('input', () => {
    const value = slider.value;
    slides.forEach(slide => {
        slide.style.display = slide.dataset.level === value.toString() ? 'block' : 'none';
    });
    updateStats(value);
});

function updateStats(level) {
    statsContainer.textContent = `Stats for Level ${level}`;
}

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

// Listen for visibility change events
document.addEventListener('visibilitychange', handleVisibilityChange);
