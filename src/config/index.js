require('dotenv').config();

/**
 * Application configuration constants.
 * 
 * @constant {number} PORT - The port on which the server runs.
 * @constant {string} MONGODB_URI - The URI for connecting to MongoDB.
 * @constant {string} PYTHON_IMAGE - The Docker image for Python.
 */
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
const PYTHON_IMAGE = process.env.PYTHON_IMAGE;

if (!MONGODB_URI) {
    console.error('Error: MONGODB_URI is not set in environment variables.');
    process.exit(1);
}

if (!PYTHON_IMAGE) {
    console.error('Error: PYTHON_IMAGE is not set in environment variables.');
    process.exit(1);
}

console.log(`Configuration loaded: PORT=${PORT}, MONGODB_URI=${MONGODB_URI ? 'set' : 'not set'}, PYTHON_IMAGE=${PYTHON_IMAGE ? 'set' : 'not set'}`);

module.exports = { PORT, MONGODB_URI, PYTHON_IMAGE };
