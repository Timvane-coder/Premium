const express = require('express');
const http = require('http');
const { buddyMd } = require('./src/Utils/Buddy');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'Public' folder
app.use(express.static(path.join(__dirname, 'Public')));

// Define your other routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/Public/index.html'));
});

app.get('/ownername', (req, res) => {
    const m = global.settings.OWNER_NAME;
    res.send(m);
});

// Improved Error Handling with More Detail
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the full error stack for debugging
    const statusCode = err.statusCode || 500; // Use a custom status code if set, otherwise 500
    const errorMessage = err.message || 'Internal Server Error'; // Use a custom message if set
    res.status(statusCode).send(errorMessage);
});

// Start the server
(async () => {
    try {
        server.listen(port, async () => { // Use 'server' instead of 'app'
            console.log(`Server is listening on port ${port}`);
            await buddyMd(); // Await the start of your news function
        });
    } catch (err) {
        console.error('Error starting server or news function:', err); // More descriptive error
    }
})();
