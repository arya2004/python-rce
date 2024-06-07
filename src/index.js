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

app.use(bodyParserMiddleware);



const redis = new Redis();

redis.on('error', (err) => {
    console.error('Redis Error:', err);
});

//app.use('/', mainController);
app.use('/', executionController(redis));
app.use('/s', singleSpawnController(redis));
app.use('/game', gameController);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {})
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });
    })
    .catch((err) => console.error('MongoDB connection error:', err));
