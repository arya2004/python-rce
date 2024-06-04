const express = require('express');
const dockerService = require('../services/dockerService');
const OutputModel = require('../models/outputModel');

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { code } = req.body;

        const output = await dockerService.runPythonCode(code);

        // Save the output to MongoDB
        const newOutput = new OutputModel({ output });
        await newOutput.save();

        res.status(200).json({ output });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
