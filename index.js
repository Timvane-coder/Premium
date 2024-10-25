require('dotenv').config();
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const axios = require('axios');
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
app.use(bodyParser.json());

// Facebook Page Access Token and Verification Token
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// Sample product list
const products = [
    { name: 'Laptop', category: 'electronics', description: 'High-performance laptop for professionals', price: '$1200' },
    { name: 'Smartphone', category: 'electronics', description: 'Latest smartphone with 5G connectivity', price: '$800' },
    { name: 'Running Shoes', category: 'sportswear', description: 'Comfortable running shoes for all terrains', price: '$60' },
    { name: 'Headphones', category: 'electronics', description: 'Noise-cancelling over-ear headphones', price: '$150' },
    { name: 'Yoga Mat', category: 'sportswear', description: 'Non-slip yoga mat with cushioning', price: '$25' }
];

// Webhook verification
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('Webhook verified');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});

// Webhook endpoint to handle incoming messages
app.post('/webhook', (req, res) => {
    const body = req.body;

    if (body.object === 'page') {
        body.entry.forEach(async (entry) => {
            const webhookEvent = entry.messaging[0];
            const senderPsid = webhookEvent.sender.id;

            if (webhookEvent.message && webhookEvent.message.text) {
                const receivedMessage = webhookEvent.message.text;
                const recommendedProducts = getRecommendedProducts(receivedMessage);
                
                if (recommendedProducts.length > 0) {
                    await sendProductRecommendations(senderPsid, recommendedProducts);
                } else {
                    await sendTextMessage(senderPsid, `Sorry, I couldn't find any recommendations for "${receivedMessage}". Try keywords like "electronics" or "sportswear".`);
                }
            }
        });
        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.sendStatus(404);
    }
});

// Function to filter products based on user message
function getRecommendedProducts(message) {
    const lowerCaseMessage = message.toLowerCase();
    return products.filter(product =>
        product.name.toLowerCase().includes(lowerCaseMessage) || 
        product.category.toLowerCase().includes(lowerCaseMessage)
    );
}

// Function to send a list of recommended products
async function sendProductRecommendations(senderPsid, products) {
    for (const product of products) {
        const messageData = {
            recipient: { id: senderPsid },
            message: {
                text: `*${product.name}*\nCategory: ${product.category}\nDescription: ${product.description}\nPrice: ${product.price}`
            }
        };
        await callSendAPI(messageData);
    }
}

// Function to send a text message
async function sendTextMessage(senderPsid, message) {
    const messageData = {
        recipient: { id: senderPsid },
        message: { text: message }
    };
    await callSendAPI(messageData);
}

// Function to send message via Facebook Send API
async function callSendAPI(messageData) {
    try {
        await axios.post(`https://graph.facebook.com/v11.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, messageData);
        console.log('Message sent successfully');
    } catch (error) {
        console.error('Error sending message:', error.response ? error.response.data : error.message);
    }
}

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



let songs = [
  {
    id: "1",
    title: "longing dance by Lee Ji Eun",
    avatar: "images/jennie.jpg",
    path:"images/longing.mp3",
  },
  {
    id: "2",
    title: "yamica by Jose Joaquim Chefe",
    avatar: "images/josep.jpg",
    path:"images/yamica.mp3",
  },
  {
    id: "3",
    title: "hold me by Heize",
    avatar: "images/heize.webp",
    path:"images/hold_me.mp3",
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


// Set up database (run once to create the table)


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

db.run(
  `CREATE TABLE music (id INTEGER PRIMARY KEY AUTOINCREMENT, title text,avatar text,path text)`,
  (err) => {
    if (err) {
      // console.log(err)
      // Table already created
    } else {
      // Table just created, creating some rows
      var insert = "INSERT INTO music (title, avatar, path) VALUES (?,?,?)";
      songs.map((music) => {
        db.run(insert, [
          `${music.title}`,
          `${music.avatar}`,
          `${music.path}`,
        ]);
      });
    }
  }
);


// API to get music data

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

app.get('/music', (req, res) => {
    db.all('SELECT * FROM music', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ music: rows });
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
