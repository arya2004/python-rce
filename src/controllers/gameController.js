const express = require('express');
const Game = require('../models/gameModel');
const childService = require('../services/childService');

const router = express.Router();

/**
 * GET /games
 * Responds with a confirmation message.
 */
router.get('/', async (req, res) => {
    console.log(`GET request from IP: ${req.ip}`);
    res.status(200).json("Game Controller is operational.");
});

/**
 * POST /games
 * Creates a new game with the provided data.
 * 
 * @param {Object} req.body - The game data.
 */
router.post('/', async (req, res) => {
    const gameData = req.body;

    try {
        console.log(`Creating new game with data: ${JSON.stringify(gameData)}`);

        let codeOutput = await childService.spawnChildCode(gameData.sampleCode);
        gameData.sampleCodeOutput = codeOutput;

        let codeOutputHidden = await childService.spawnChildCode(gameData.hiddenTestCase);
        gameData.hiddenTestCaseOutput = codeOutputHidden;

        const newGame = await Game.create(gameData);

        console.log(`New game created with ID: ${newGame._id}`);
        res.status(201).json(newGame);
    } catch (error) {
        console.error(`Error creating game: ${error}`);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
