const express = require('express');
const childService = require('../services/childService');
const OutputModel = require('../models/outputModel');

const router = express.Router();

/**
 * GET /main
 * Responds with a confirmation message.
 */
router.get('/', async (req, res) => {
    console.log(`GET request from IP: ${req.ip}`);
    res.status(200).json("Main Controller is operational.");
});

/**
 * POST /main
 * Executes the provided code and returns the output.
 * 
 * @param {Object} req.body - The request body containing the code.
 */
router.post('/', async (req, res) => {
    try {
        const { code } = req.body;
        console.log(`POST request from IP: ${req.ip} with code: ${code}`);

        let output = await childService.spawnChildCode(code);

        // Save the output to MongoDB
        const newOutput = new OutputModel({ output });
        await newOutput.save();

        console.log(`Code executed successfully. Output saved to database.`);
        res.status(200).json({ output });
    } catch (err) {
        console.error(`Error executing code: ${err}`);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
