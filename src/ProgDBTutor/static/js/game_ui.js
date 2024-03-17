document.addEventListener('DOMContentLoaded', function() {
    const resourceButton = document.getElementById('resource-btn');
    const overlay = document.getElementById('resource-overlay');
    let clickedResourceButton = false

    resourceButton.addEventListener('click', function() {
        if(!clickedResourceButton){
            overlay.style.display = 'flex';
            resourceButton.src = "../static/img/resource_pbtn.png"
        }else{
            overlay.style.display = 'none';
            resourceButton.src = "../static/img/resource_btn.png"
        }
        clickedResourceButton = !clickedResourceButton;
    });

});

