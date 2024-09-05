const express = require('express');
const http = require('http');
const { buddyMd } = require('./src/Utils/Buddy');
const path = require('path');
const { buddyStatistic } = require('./src/Plugin/BuddyStatistic');
const socketIo = require('socket.io'); // Require Socket.IO
const sqlite3 = require("sqlite3").verbose();
const app = express();
const port = process.env.PORT || 9001;
const server = http.createServer(app);
const io = socketIo(server); // Initialize Socket.IO with the HTTP server

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let blogs = [
  {
    id: "1",
    title: "How To Build A RESTAPI With Javascript",
    avatar: "images/blog1.jpg",
    intro:
      "iste odio beatae voluptas dolor praesentium illo facere optio nobis magni, aspernatur quas.",
  },
  {
    id: "2",
    title: "How to Build an PWA application with Node.js",
    avatar: "images/blog2.jpg",
    intro:
      "iste odio beatae voluptas dolor praesentium illo facere optio nobis magni, aspernatur quas.",
  },
  {
    id: "3",
    title: "Building a Trello Clone with React DnD",
    avatar: "images/blog3.jpg",
    intro:
      "iste odio beatae voluptas dolor praesentium illo facere optio nobis magni, aspernatur quas.",
  },
];

const db = new sqlite3.Database("db.sqlite", (err) => {
  if (err) {
    // Cannot open database
    console.error(err.message);
    throw err;
  } else {
    console.log("Connected to the SQLite database.");
  }
});

db.run(
  `CREATE TABLE blog (id INTEGER PRIMARY KEY AUTOINCREMENT, title text,avatar text,intro text)`,
  (err) => {
    if (err) {
      // console.log(err)
      // Table already created
    } else {
      // Table just created, creating some rows
      var insert = "INSERT INTO blog (title, avatar, intro) VALUES (?,?,?)";
      blogs.map((blog) => {
        db.run(insert, [
          `${blog.title}`,
          `${blog.avatar}`,
          `${blog.intro}`,
        ]);
      });
    }
  }
);

// Serve static files from the 'Public' folder
app.use(express.static(path.join(__dirname, 'Public')));

// Define your other routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/Public/index.html'));
});

app.get("/blogs", async (req, res) => {
  db.all("select * from blog", (err, rows) => {
    if (err) return err;
    res.status(200).json({
      rows,
    });
  });
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
