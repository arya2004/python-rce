const express = require('express');
const mongoose = require('mongoose');
const mainController = require('./controllers/mainController');
const executionController = require('./controllers/executionController');
const gameController = require('./controllers/gameController');
const bodyParserMiddleware = require('./middlewares/bodyParserMiddleware');
const { PORT, MONGODB_URI } = require('./config');

const app = express();

app.use(bodyParserMiddleware);

//app.use('/', mainController);
app.use('/', executionController);
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
