const express = require('express');
const bodyParser = require('body-parser');
const Docker = require('dockerode');
require('dotenv').config();

const app = express();
const docker = new Docker();
const PORT = process.env.PORT || 3000;
const PYTHON_IMAGE = process.env.PYTHON_IMAGE || 'python:3.9.19-alpine3.20';

console.log(`Using Python Docker image: ${PYTHON_IMAGE}`);

app.use(bodyParser.json());

/**
 * Endpoint to execute Python code inside a Docker container.
 * 
 * @param {string} req.body.code - The Python code to execute.
 * @returns {Object} - The output from the executed code.
 */
app.post('/', async (req, res) => {
    try {
        const { code } = req.body;

        // Create a Docker container
        const container = await docker.createContainer({
            Image: PYTHON_IMAGE,
            AttachStdout: true,
            AttachStderr: true,
            Tty: true,
            Cmd: ['python', '-c', code],
        });

        console.log("Docker container created successfully");

        await container.start();
        console.log("Docker container started successfully");

        const logs = await container.logs({
            follow: true,
            stdout: true, 
            stderr: true,
        });

        let output = '';
        logs.on('data', (chunk) => {
            const logChunk = chunk.toString('utf8');
            output += logChunk;
            console.log(`Container log: ${logChunk}`); 
        });

        await new Promise((resolve, reject) => {
            container.wait((err, data) => {
                if (err) {
                    console.error("Error waiting for container:", err);
                    reject(err);
                } else {
                    console.log("Container finished execution:", data);
                    resolve(data);
                }
            });
        });

        res.status(200).json({ output });

        await container.remove();
        console.log("Docker container removed successfully");
    } catch (err) {
        console.error("Internal Server Error:", err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

console.log("Server setup completed successfully");
