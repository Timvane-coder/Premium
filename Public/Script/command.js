 // Command response functions
 document.getElementById('checkCommandsBtn').addEventListener('click', function () {
    document.getElementById('commandResponse').classList.remove('hidden');
    document.getElementById('commandResponse').innerHTML = '<p>Checking commands... Please wait.</p>';
    // Simulate API call
    setTimeout(() => {
        document.getElementById('commandResponse').innerHTML = '<p>All commands are up to date!</p>';
    }, 2000);
});

document.getElementById('getResponseBtn').addEventListener('click', function () {
    document.getElementById('commandResponse').classList.remove('hidden');
    document.getElementById('commandResponse').innerHTML = '<p>Getting response... Please wait.</p>';
    // Simulate API call
    setTimeout(() => {
        document.getElementById('commandResponse').innerHTML = '<p>Response received: Bot is functioning normally.</p>';
    }, 2000);
});