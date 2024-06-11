const express = require('express');
const Game = require('../models/gameModel');
const childService = require('../services/childService');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

/**
 * GET /games/new
 * Render the create game form.
 */
router.get('/new', (req, res) => {
    res.render('createGame');
});

/**
 * POST /games
 * Creates a new game with the provided data.
 * 
 * @param {Object} req.body - The game data.
 */
router.post('/', async (req, res) => {
   
    

   console.log("\n\n", req.body, "\n\n")

        const gameData = req.body;

        try {
            

            let codeOutput = await childService.spawnChildCode(gameData.masterCode);
            gameData.masterCodeOutput = codeOutput;
            gameData.hiddenTestCasesOutput = []

            for (let i = 0; i < gameData.hiddenTestCases.length; i++) {
                let codeOutputHidden = await childService.spawnChildCode(gameData.hiddenTestCases[i]);
                console.log("codeOutputHidden: ", gameData.hiddenTestCasesOutput);
                gameData.hiddenTestCasesOutput.push(codeOutputHidden);
            }

       
            const newGame = await Game.create(gameData);

            console.log(`New game created with ID: ${newGame._id}`);
            res.status(201).json(newGame);

           
        } catch (error) {
            console.error(`Error creating game: ${error}`);
            res.status(500).json({ error: 'Server error' });
        }
});

module.exports = router;
