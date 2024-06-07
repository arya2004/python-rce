const express = require('express');
const bodyParser = require('body-parser');
const Redis = require('ioredis');

const app = express();
const port = 3000;

// Create a Redis client with ioredis
const redis = new Redis();

redis.on('error', (err) => {
    console.error('Redis Error:', err);
});

/**
 * Middleware to check for slurs in the request body.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const checkForSlurs = (req, res, next) => {
    const slurRegex = /import|print/gi; 
    if (req.method === 'POST' && req.body && slurRegex.test(req.body.codeChunks)) {
        const ip = req.ip; // Get the IP address of the requester
        redis.set(ip, 'blacklisted', 'EX', 60); // Blacklist IP for 1 minute
        console.log(`IP ${ip} blacklisted for posting a slur: ${req.body.codeChunks}`);
    }
    next();
};

app.use(bodyParser.json());
app.use(checkForSlurs);

/**
 * Example route that checks for slurs and responds accordingly.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
app.post('/', (req, res) => {
    redis.get(req.ip, (err, reply) => {
        if (err) {
            console.error('Redis Error:', err);
            return res.status(500).send('Internal Server Error');
        }

        if (reply === 'blacklisted') {
            console.warn(`Request from blacklisted IP ${req.ip} blocked.`);
            return res.status(403).send('You are blacklisted for posting a slur.');
        }

        // Process the request if not blacklisted
        console.log(`Request from IP ${req.ip} processed successfully.`);
        res.send('Post request processed successfully.');
    });
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

console.log("Block service setup completed successfully");
