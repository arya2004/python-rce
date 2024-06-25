const express = require('express');
const childService = require('../services/childService');
const OutputModel = require('../models/outputModel');
const Game = require('../models/gameModel');
const { v4: uuidv4 } = require('uuid');

/**
 * Creates an Express router with endpoints for handling code execution.
 * @param {Object} redis - Redis client for handling blacklisting.
 * @returns {Object} - Configured Express router.
 */
const createRouter = (redis) => {
    const router = express.Router();

    /**
     * Middleware to check for slurs in POST requests.
     * Blacklists the IP if a slur is found.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @param {Function} next - Express next middleware function.
     */
    const checkForSlurs = (req, res, next) => {
        const slurRegex = /\b(import|print)\b/gi;

        if (req.method === 'POST' && req.body && slurRegex.test(JSON.stringify(req.body))) {
            const ip = req.ip;
            redis.set(ip, 'blacklisted', 'EX', 60);
            console.log(`IP ${ip} blacklisted for posting a slur.`);
            return res.status(403).json({ message: 'You are blacklisted for posting a slur.' });
        }

        next();
    };

    /**
     * GET endpoint to check server status.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    router.get('/', async (req, res) => {
        console.log(`GET request from IP: ${req.ip}`);
        res.status(200).json("Execution Controller is operational.");
    });

    /**
     * POST endpoint to execute provided code chunks.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    router.post('/', checkForSlurs, async (req, res) => {

        console.log("\n\n", req.body, "\n\n")

        const { codes } = req.body;

        try {
            const isBlacklisted = await redis.get(req.ip);
            if (isBlacklisted === 'blacklisted') {
                console.warn(`Blacklisted IP ${req.ip} attempted to post.`);
                return res.status(403).json({ message: 'You are blacklisted for posting malicious code.' });
            }

            const guid = uuidv4();
            console.log(`Generated GUID: ${guid}`);

            let totalCombinedCode = `${codes[0]}`;

            for (let i = 1; i < codes.length; i++) {
                totalCombinedCode += `\nprint("${guid}")\n${codes[i]}`;
            }

            let result = await childService.spawnChildCode(totalCombinedCode);

            const newOutput = new OutputModel({ result });
            await newOutput.save();
                

            //change below in production, remove \r
            const answerArray = result.split(`${guid}\r\n`);
            console.log(`Result split by GUID: ${answerArray}`);


            let userCodeOutput = answerArray[0];
            let success = true;
            
            


            res.status(200).json({ userCodeOutput, success });
        } catch (error) {
            console.error(`Error processing request: ${error}`);
            res.status(500).json({ message: 'Internal server error', error });
        }
    });

    return router;
};

module.exports = createRouter;
