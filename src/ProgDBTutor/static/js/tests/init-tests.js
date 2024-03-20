document.getElementById('run-tests-btn').addEventListener('click', function() {
    // Check if boot1.js has already been loaded
    if (!window.jasmineBoot1Loaded) {
        var boot1Script = document.createElement('script');
        boot1Script.src = "https://cdn.jsdelivr.net/npm/jasmine-core@latest/lib/jasmine-core/boot1.js";
        boot1Script.onload = function() {
            console.log('Jasmine tests are starting...');
            window.jasmineBoot1Loaded = true; // Mark as loaded
        };
        document.head.appendChild(boot1Script);
    } else {
        console.log('Jasmine tests have already been initialized.');
    }
});