const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameSchema = new Schema({
    chapter: {
        type: String,
        required: true
    },
    missions: {
        type: String,
        required: true
    },
    taskNo: {
        type: Number,
        required: true
    },
    Id: {
        type: String,
        required: true,
        unique: true
    },
    sampleCode: {
        type: String,
        required: true
    },
    sampleCodeOutput: {
        type: String
    },
    hiddenTestCase: {
        type: String,
        required: true
    },
    hiddenTestCaseOutput: {
        type: String,
        required: true
    },
    boilerplateCode: {
        type: String,
        required: true
    }
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
