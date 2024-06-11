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



module.exports = router;
