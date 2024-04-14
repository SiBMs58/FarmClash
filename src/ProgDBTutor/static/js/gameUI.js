        let clickedResourceButton = false;

        function clickResources() {
            const resourceButton = document.getElementById('resource-btn');
            const overlay = document.getElementById('resource-overlay');

            overlay.style.display = clickedResourceButton ? 'none' : 'flex';
            resourceButton.querySelector('img').src = clickedResourceButton ? "../static/img/UI/resource_btn.png" : "../static/img/UI/resource_pbtn.png";
            clickedResourceButton = !clickedResourceButton;

            fetch('/api/resources')
            .then(response => response.json())
            .then(data => {
                updateResources(data);
                updateMoney(data); // Call a separate function to update money
            })
            .catch(error => {
                console.error('Error fetching resources:', error);
                document.querySelector('.popup').innerHTML = `<p>Error fetching resources. Please try again later.</p>`;
            });
        }

        function updateMoney(resources) {
            const moneyDisplay = document.querySelector('.money-display');
            const moneyResource = resources.find(resource => resource.resource_type === 'Money');

            if (moneyResource) {
                moneyDisplay.innerHTML = '<img src="../../static/img/UI/display.left.short.png" alt="" draggable="false">';
                moneyDisplay.innerHTML += getAmountDisplay(moneyResource.amount);
                moneyDisplay.innerHTML += '<img src="../../static/img/UI/display.money.right.png" alt="🪙" draggable="false">'
            }
        }

        function updateResources(resources) {
            const popupDiv = document.querySelector('.popup');
            let resourceHTML = '<img src="../../static/img/UI/display.left.short.png" alt="" draggable="false">';

            resources.forEach((resource, index) => {
                if(resource.resource_type === 'Money') return; // Skip money
                resourceHTML += getAmountDisplay(resource.amount)
                resourceHTML += getResourceDisplay(resource.resource_type);
                if (index < resources.length - 1) {
                 resourceHTML += '<img src="../../static/img/UI/display.extender.png" alt=" " draggable="false">'.repeat(5);
                }
            });
            resourceHTML += '<img src="../../static/img/UI/display.right.short.png" alt="" draggable="false">'
            popupDiv.innerHTML = resourceHTML;
        }



        function getResourceDisplay(resourceType) {
            switch(resourceType) {
                case 'Corn': return '<img src="../../static/img/UI/display.corn.png" alt="🌽" draggable="false">';
                case 'Carrot': return '<img src="../../static/img/UI/display.carrot.png" alt="🥕" draggable="false">';
                case 'Cauliflower': return '<img src="../../static/img/UI/display.cauliflower.png" alt="⚪🥦" draggable="false">';
                case 'Tomato': return '<img src="../../static/img/UI/display.tomato.png" alt="🍅" draggable="false">';
                case 'Eggplant': return '<img src="../../static/img/UI/display.eggplant.png" alt="🍆" draggable="false">';
                case 'Lettuce': return '<img src="../../static/img/UI/display.lettuce.png" alt="🥬" draggable="false">';
                case 'Wheat': return '<img src="../../static/img/UI/display.wheat.png" alt="🌾" draggable="false">';
                case 'Turnip': return '<img src="../../static/img/UI/display.turnip.png" alt="🟣🌱" draggable="false">';
                case 'Parsnip': return '<img src="../../static/img/UI/display.parsnip.png" alt="⚪🌱" draggable="false">';
                case 'Zucchini': return '<img src="../../static/img/UI/display.zucchini.png" alt="🥒" draggable="false">';
                // Add more as needed
                default: return ''; // Default case if no symbol is matched
            }
        }
        function getAmountDisplay(amount){
            let value = amount.toString();
            if (value === "0"){
                return `<img src="../../static/img/UI/display.0.png" alt="0" draggable="false">`;
            }
            let HTML = ''
            for (let i = 0; i < value; i++) {
                let digit = value.charAt(i);
                HTML += `<img src="../../static/img/UI/display.${digit}.png" alt="${digit}" draggable="false">`;
            }
            return HTML
        }