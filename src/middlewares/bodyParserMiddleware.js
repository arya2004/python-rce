const express = require('express');
const bodyParser = require('body-parser');

const app = express();

/**
 * Middleware to parse JSON bodies of incoming requests.
 */
app.use(bodyParser.json());

module.exports = app;
