const express = require('express');
const dockerService = require('../services/dockerService');
const childService = require('../services/childService');
const OutputModel = require('../models/outputModel');

const router = express.Router();

router.get('/', async (req, res) => {
 
    
        res.status(200).json("main controller");
   
});


router.post('/', async (req, res) => {
    try {
        const { code } = req.body;

        //let output = await dockerService.runPythonCode(code);
        let output = await childService.spawnChildCode(code);
        //let output = await childService.execChildCode(code);
       

        // Save the output to MongoDB
        const newOutput = new OutputModel({ output });
        await newOutput.save();

        

        res.status(200).json({ output });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err });
    }
});

module.exports = router;
