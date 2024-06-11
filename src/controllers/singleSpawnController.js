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
            return res.status(403).json({ error: 'You are blacklisted for posting a slur.' });
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
        res.status(200).json("Single Spawn Controller is operational.");
    });

    /**
     * POST endpoint to execute provided code chunks.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
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
            const guid = uuidv4();
            console.log(`Generated GUID: ${guid}`);

            for (const codeChunk of codeChunks) {
                combinedCode = combinedCode.replace('######', codeChunk);
                hiddenCode = hiddenCode.replace('######', codeChunk);
            }

            let totalCombinedCode = `${combinedCode}\nprint("${guid}")\r\n${hiddenCode}`;
            let result = await childService.spawnChildCode(totalCombinedCode);

            const newOutput = new OutputModel({ result });
            await newOutput.save();

            const answerArray = result.split(`${guid}\n`);
            console.log(`Result split by GUID: ${answerArray}`);

            let first = answerArray[0];
            const isSuccessful = answerArray[1] == game.hiddenTestCaseOutput && answerArray[0] == game.sampleCodeOutput;

            res.status(200).json({ first, success: isSuccessful });
        } catch (error) {
            console.error(`Error processing request: ${error}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    return router;
};

module.exports = createRouter;
