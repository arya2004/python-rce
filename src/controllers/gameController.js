const express = require('express');
const Game = require('../models/gameModel');
const router = express.Router();

router.get('/', async (req, res) => {
 
    
        res.status(200).json("gem ctro");
   
});


router.post('/', async (req, res) => {
    const gameData = req.body;

    try {
        const newGame = await Game.create(gameData);
        res.status(201).json(newGame);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
