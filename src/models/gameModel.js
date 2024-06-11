const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Schema definition for the Game model.
 */
const gameSchema = new Schema({
    chapter: {
        type: String,
        required: true,
        description: "Chapter name or number"
    },
    missions: {
        type: String,
        required: true,
        description: "Missions included in the game"
    },
    taskNo: {
        type: Number,
        required: true,
        description: "Task number"
    },
    Id: {
        type: String,
        required: true,
        description: "Unique identifier for the game"
    },
    masterCode: {
        type: String,
        required: true,
        description: "Sample code provided for the task"
    },
    masterCodeBoilerplate: {
        type: String,
        required: true,
        description: "Boilerplate code provided for the task"
    },
    masterCodeOutput: {
        type: String,
        description: "Output of the sample code"
    },
    hiddenTestCases: {
        type: [String],  
        required: true,
        description: "Hidden test cases for validating code"
    },
    hiddenTestCasesBoilerplate: {
        type: [String],
        required: true,
        description: "Boilerplate code for hidden test case"
    },
    hiddenTestCasesOutput: {
        type: [String],
        required: true,
        description: "Expected output of the hidden test case"
    },
    
});

/**
 * Mongoose model for the Game schema.
 */
const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
