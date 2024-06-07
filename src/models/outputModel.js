const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * Output Schema
 * Defines the structure of the Output documents in MongoDB.
 */
const outputSchema = new Schema({
    output: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

/**
 * Output Model
 * The model for the Output schema.
 */
const OutputModel = mongoose.model('Output', outputSchema);

console.log("OutputModel schema created successfully");

module.exports = OutputModel;
