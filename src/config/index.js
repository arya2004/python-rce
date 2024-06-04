require('dotenv').config();

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
const PYTHON_IMAGE = process.env.PYTHON_IMAGE;

module.exports = { PORT, MONGODB_URI, PYTHON_IMAGE };
