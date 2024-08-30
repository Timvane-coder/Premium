const express = require('express');
const http = require('http');
const { buddyMd } = require('./src/Utils/Buddy');
const path = require('path');
const { buddyStatistic } = require('./src/Plugin/BuddyStatistic');
const socketIo = require('socket.io'); // Require Socket.IO

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketIo(server); // Initialize Socket.IO with the HTTP server

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'Public' folder
app.use(express.static(path.join(__dirname, 'Public')));

// Define your other routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/Public/index.html'));
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('A user connected'); // Log when a user connects
    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
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
        buddyStatistic(app, io);
        // Main function to download ffmpeg
        server.listen(port, async () => {
            console.log(`Server is listening on port ${port}`);
            await buddyMd(io, app);
        });
    } catch (err) {
        console.error('Error starting server or running functions:', err);
    }
})();
