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
        res.status(200).json("Execution Controller is operational.");
    });

    router.post('/', checkForSlurs, async (req, res) => {
        const { taskNo, codeChunks } = req.body;

        try {
            const isBlacklisted = await redis.get(req.ip);
            if (isBlacklisted === 'blacklisted') {
                console.warn(`Blacklisted IP ${req.ip} attempted to post.`);
                return res.status(403).json({ error: 'You are blacklisted for posting a slur.' });
            }

            const game = await Game.findOne({ taskNo });
            if (!game) {
                console.warn(`Task not found for taskNo: ${taskNo}`);
                return res.status(404).json({ error: 'Task not found' });
            }

            let combinedCode = game.boilerplateCode;
            let hiddenCode = game.hiddenTestCaseBoilerplate;

            for (const codeChunk of codeChunks) {
                combinedCode = combinedCode.replace('######', codeChunk);
                hiddenCode = hiddenCode.replace('######', codeChunk);
            }
            console.log(`Hidden Code: ${hiddenCode}`);

            // Replace dockerService.runPythonCode with childService.spawnChildCode
            let result = await childService.spawnChildCode(combinedCode); 
            let hiddenResult = await childService.spawnChildCode(hiddenCode);
            console.log(`Result: ${result}, Hidden Result: ${hiddenResult}`);

            const newOutput = new OutputModel({ result });
            await newOutput.save();

            const success = (hiddenResult === game.hiddenTestCaseOutput && result === game.sampleCodeOutput);
            res.status(200).json({ result, success });
        } catch (error) {
            console.error(`Error processing request: ${error}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    return router;
};

module.exports = createRouter;
