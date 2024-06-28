const express = require('express');
const http = require('http');
const { buddyMd } = require('./src/Utils/Bot');

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define your other routes 
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/Public/index.html'); 
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
        await buddyMd(); // Await the start of your news function
        server.listen(port, () => { // Use 'server' instead of 'app'
            console.log(`Server is listening on port ${port}`);
        });
    } catch (err) {
        console.error('Error starting server or news function:', err); // More descriptive error
    }
})();
