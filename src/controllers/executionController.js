const express = require('express');
const dockerService = require('../services/dockerService');
const childService = require('../services/childService');
const OutputModel = require('../models/outputModel');
const Game = require('../models/gameModel');

const router = express.Router();

router.get('/', async (req, res) => {
 
    console.log(req.ip)
        res.status(200).json("exec ctr");
   
});


router.post('/', async (req, res) => {
    const { taskNo, codeChunks } = req.body;

    try {
        // Retrieve game data based on task number
        const game = await Game.findOne({ taskNo });

        if (!game) {
            return res.status(404).json({ error: 'Task not found' });
        }

        // Initialize combined code with boilerplate code
        let combinedCode = game.boilerplateCode;

        // Replace code chunks in sequence
        for (const codeChunk of codeChunks) {
            combinedCode = combinedCode.replace('######', codeChunk);
        }

        // Execute the combined code
        let result = await childService.spawnChildCode(combinedCode); // Use a safer alternative to eval in production
        //let result = await dockerService.runPythonCode(combinedCode);
        
        
        // Save the output to MongoDB
        const newOutput = new OutputModel({ result });
        await newOutput.save();
      

        res.status(200).json({ result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
});

module.exports = router;
