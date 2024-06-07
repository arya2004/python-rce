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
        unique: true,
        description: "Unique identifier for the game"
    },
    sampleCode: {
        type: String,
        required: true,
        description: "Sample code provided for the task"
    },
    sampleCodeOutput: {
        type: String,
        description: "Output of the sample code"
    },
    hiddenTestCase: {
        type: String,
        required: true,
        description: "Hidden test case for validating code"
    },
    hiddenTestCaseBoilerplate: {
        type: String,
        required: true,
        description: "Boilerplate code for hidden test case"
    },
    hiddenTestCaseOutput: {
        type: String,
        required: true,
        description: "Expected output of the hidden test case"
    },
    boilerplateCode: {
        type: String,
        required: true,
        description: "Boilerplate code provided for the task"
    }
});

/**
 * Mongoose model for the Game schema.
 */
const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
