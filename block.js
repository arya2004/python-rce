const express = require('express');
const bodyParser = require('body-parser');
const Redis = require('ioredis');

const app = express();
const port = 3000;

const redis = new Redis(); // Create a Redis client with ioredis

redis.on('error', (err) => {
    console.error('Redis Error:', err);
});

// Middleware to check for slurs in the request body
const checkForSlurs = (req, res, next) => {
    const slurRegex = /import|print/gi; // Replace with actual slurs
    console.log('Slur detected in request body:', req.body.codeChunks);
    if (req.method === 'POST' && req.body && slurRegex.test(req.body.codeChunks)) {
        
        const ip = req.ip; // Get the IP address of the requester
        redis.set(ip, 'blacklisted', 'EX', 60); // Blacklist IP for 1 minute
        console.log(`IP ${ip} blacklisted for posting a slur.`);
    }

    next();
};

app.use(bodyParser.json());
app.use(checkForSlurs);

// Example route that checks for slurs and responds accordingly
app.post('/', (req, res) => {
    redis.get(req.ip, (err, reply) => {
        if (err) {
            console.error('Redis Error:', err);
            return res.status(500).send('Internal Server Error');
        }

        if (reply === 'blacklisted') {
            return res.status(403).send('You are blacklisted for posting a slur.');
        }

        // Process the request if not blacklisted
        res.send('Post request processed successfully.');
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
