// Import required modules
const express = require('express');
const Redis = require('ioredis');

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
    console.error('Redis Error:', err);
});

// Middleware to parse JSON bodies
app.use(express.json());

/**
 * Endpoint to set data in Redis.
 * 
 * @param {string} req.body.key - The key to set in Redis.
 * @param {string} req.body.value - The value to set in Redis.
 * @returns {string} - Success or error message.
 */
app.post('/set', async (req, res) => {
    const { key, value } = req.body;
    try {
        await client.set(key, value);
        console.log(`Data set successfully: ${key} = ${value}`);
        res.status(200).send('Data set successfully');
    } catch (err) {
        console.error('Error setting data in Redis:', err);
        res.status(500).send('Error setting data in Redis');
    }
});

/**
 * Endpoint to get data from Redis.
 * 
 * @param {string} req.params.key - The key to retrieve from Redis.
 * @returns {string} - The value associated with the key or an error message.
 */
app.get('/get/:key', async (req, res) => {
    const key = req.params.key;
    try {
        const value = await client.get(key);
        if (value === null) {
            console.warn(`Key not found in Redis: ${key}`);
            res.status(404).send('Key not found in Redis');
        } else {
            console.log(`Data retrieved successfully: ${key} = ${value}`);
            res.status(200).send(value);
        }
    } catch (err) {
        console.error('Error getting data from Redis:', err);
        res.status(500).send('Error getting data from Redis');
    }
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

console.log("App setup completed successfully");
