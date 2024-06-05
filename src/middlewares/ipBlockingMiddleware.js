const express = require('express');

// Middleware to check for slurs in the request body
const checkForSlurs = (req, res, next) => {
    const slurRegex = /import|print/gi; // Replace with actual slurs
    console.log('Slur detected in request body:', req.body.mc);
    if (req.method === 'POST' && req.body && slurRegex.test(req.body.mc)) {
        
        const ip = req.ip; // Get the IP address of the requester
        redis.set(ip, 'blacklisted', 'EX', 60); // Blacklist IP for 1 minute
        console.log(`IP ${ip} blacklisted for posting a slur.`);
    }

    next();
};


module.exports = checkForSlurs;