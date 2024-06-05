const express = require('express');
const dockerService = require('../services/dockerService');
const childService = require('../services/childService');
const OutputModel = require('../models/outputModel');
const Game = require('../models/gameModel');

const createRouter = (redis) => {
    const router = express.Router();


    const checkForSlurs = (req, res, next) => {
        const slurRegex = /import|print/gi; 

        if (req.method === 'POST' && req.body && slurRegex.test(JSON.stringify(req.body))) {
            const ip = req.ip;
            redis.set(ip, 'blacklisted', 'EX', 60); 
            console.log(`IP ${ip} blacklisted for posting a slur.`);
            return res.status(403).json({ error: 'You are blacklisted for posting a slur.' });
        }

        next();
    };

    router.get('/', async (req, res) => {
        console.log(req.ip);
        res.status(200).json("exec ctr");
    });

    router.post('/', checkForSlurs, async (req, res) => {
        const { taskNo, codeChunks } = req.body;

        try {

            const isBlacklisted = await redis.get(req.ip);
            if (isBlacklisted === 'blacklisted') {
                return res.status(403).json({ error: 'You are blacklisted for posting a slur.' });
            }

           
            const game = await Game.findOne({ taskNo });

            if (!game) {
                return res.status(404).json({ error: 'Task not found' });
            }

        
            let combinedCode = game.boilerplateCode;


            for (const codeChunk of codeChunks) {
                combinedCode = combinedCode.replace('######', codeChunk);
            }

           
            //let result = await dockerService.runPythonCode(combinedCode);
            let result = await childService.spawnChildCode(combinedCode); 
            //let result = await dockerService.runPythonCode(combinedCode);

            const newOutput = new OutputModel({ result });
            await newOutput.save();

            res.status(200).json({ result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error });
        }
    });

    return router;
};

module.exports = createRouter;
