const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const mainController = require('./controllers/mainController');
const executionController = require('./controllers/executionController');
const singleSpawnController = require('./controllers/singleSpawnController');
const gameController = require('./controllers/gameController');
const Redis = require('ioredis');
const { PORT, MONGODB_URI } = require('./config');

const app = express();

// Middleware to parse the body of incoming requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware for serving static files (if any)
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Redis client
const redis = new Redis();

redis.on('error', (err) => {
    console.error('Redis Error:', err);
});

// Define routes
app.use('/test', executionController(redis));
app.use('/', singleSpawnController(redis));
app.use('/games', gameController); // Changed to '/games' for consistency
app.use('/main', mainController);

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {

})
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => console.error('MongoDB connection error:', err));

console.log("Server setup completed successfully");

module.exports = app;
