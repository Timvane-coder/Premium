// app.js
const express = require('express');
const bodyParser = require('body-parser');
const botRoutes = require('./routes/botRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/bot', botRoutes);

// Error handling middleware (add more specific error handlers as needed)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});