const express = require('express');
const mongoose = require('mongoose');
const mainController = require('./controllers/mainController');
const executionController = require('./controllers/executionController');
const singleSpawnController = require('./controllers/singleSpawnController');
const gameController = require('./controllers/gameController');
const bodyParserMiddleware = require('./middlewares/bodyParserMiddleware');
const Redis = require('ioredis');
const { PORT, MONGODB_URI } = require('./config');

const app = express();

// Middleware to parse the body of incoming requests
app.use(bodyParserMiddleware);

// Initialize Redis client

const redis = new Redis();



redis.on('error', (err) => {
    console.error('Redis Error:', err);
});

// Define routes
app.use('/test', executionController(redis));
app.use('/', singleSpawnController(redis));
app.use('/game', gameController);
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
