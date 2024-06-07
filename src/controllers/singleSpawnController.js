const express = require('express');
const dockerService = require('../services/dockerService');
const childService = require('../services/childService');
const OutputModel = require('../models/outputModel');
const Game = require('../models/gameModel');
const { v4: uuidv4 } = require('uuid');

const createRouter = (redis) => {
    const router = express.Router();


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
            let hiddenCode = game.hiddenTestCaseBoilerplate;

            const guid = uuidv4();
            console.log(guid)
           

            for (const codeChunk of codeChunks) {
                combinedCode = combinedCode.replace('######', codeChunk);
                hiddenCode = hiddenCode.replace('######', codeChunk);
            }
            //console.log(hiddenCode, "hiddenCode")

            let totalCombinedCode = combinedCode + `\nprint("${guid}")\n` + hiddenCode;
            //console.log("\n",totalCombinedCode)
           
            //let result = await dockerService.runPythonCode(combinedCode);
            let result = await childService.spawnChildCode(totalCombinedCode); 
            //let hiddenResult = await childService.spawnChildCode(hiddenCode);
            //console.log('hiddenResult', hiddenResult);
            console.log(result);
         

            const newOutput = new OutputModel({ result });
            await newOutput.save();

            //console.log(result  == game.sampleCodeOutput, " lel",hiddenResult == game.hiddenTestCaseOutput)

            if(result == game.hiddenTestCaseOutput && result == game.sampleCodeOutput){
                res.status(200).json({ result, boolean : true  });
            }else{
                res.status(200).json({ result, boolean : false  });
            }

           
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error });
        }
    });

    return router;
};

module.exports = createRouter;
