const mongoose = require('mongoose');

const { Schema } = mongoose;

const outputSchema = new Schema({
    output: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const OutputModel = mongoose.model('Output', outputSchema);

module.exports = OutputModel;


