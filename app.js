// Import required modules
const express = require('express');
const { Redis } = require('ioredis');

// Create an Express application
const app = express();
const port = 3000;

// Create a Redis client
const client = new Redis({
    host: 'localhost',
    port: 6379,
    db: 0,
});
// Handle Redis connection errors
client.on('error', (err) => {
    console.log('Redis Error:', err);
});

// Middleware to parse JSON bodies
app.use(express.json());

// Endpoint to set data in Redis
app.post('/set', async (req, res) => {
    const { key, value } = req.body;
    try {
        await client.set(key, value);
        res.status(200).send('Data set successfully');
    } catch (err) {
        res.status(500).send('Error setting data in Redis');
    }
});

// Endpoint to get data from Redis
app.get('/get/:key', async (req, res) => {
    const key = req.params.key;
    try {
        const value = await client.get(key);
        if (value === null) {
            res.status(404).send('Key not found in Redis');
        } else {
            res.status(200).send(value);
        }
    } catch (err) {
        res.status(500).send('Error getting data from Redis');
    }
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
