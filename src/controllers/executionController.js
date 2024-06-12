const express = require('express');
const dockerService = require('../services/dockerService');
const childService = require('../services/childService');
const OutputModel = require('../models/outputModel');
const Game = require('../models/gameModel');

/**
 * Create and configure the execution router.
 * 
 * @param {Object} redis - The Redis client.
 * @returns {Router} - The configured router.
 */
const createRouter = (redis) => {
    const router = express.Router();

    /**
     * Middleware to check for slurs in the request body.
     */
    const checkForSlurs = (req, res, next) => {
        const slurRegex = /\b(import|print)\b/gi;

        if (req.method === 'POST' && req.body && slurRegex.test(JSON.stringify(req.body))) {
            const ip = req.ip;
            redis.set(ip, 'blacklisted', 'EX', 60); 
            console.log(`IP ${ip} blacklisted for posting a slur.`);
            return res.status(403).json({ error: 'You are blacklisted for posting a slur.' });
        }

        next();
    };

    router.get('/', async (req, res) => {
        console.log(`GET request from IP: ${req.ip}`);
        res.status(200).json("Execution Controller is operational. test 4");
    });

    router.get('/py', async (req, res) => {
        console.log(`GET request from IP: ${req.ip}`);
        try {
            

            let combinedCode = "num1 = 5\nnum2 = 10\nnum3 = num1 + num2\nprint(num3)";
            let hiddenCode = "print('hello')";
           
            let result = await childService.spawnChildCode(combinedCode);
           
            console.log(`Result split by GUID: ${result}`);

            res.status(200).json({ result, success: true });
        } catch (error) {
            console.error(`Error processing request: ${error}`);
            res.status(500).json({ error: error });
        }
    });

   

    return router;
};

module.exports = createRouter;
