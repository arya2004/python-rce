const Docker = require('dockerode');

const docker = new Docker();

/**
 * Runs Python code inside a Docker container.
 * 
 * @param {string} code - The Python code to execute.
 * @returns {Promise<string>} - Resolves with the combined stdout and stderr output from the container.
 */
async function runPythonCode(code) {
    try {
        const container = await docker.createContainer({
            Image: 'python:3.9.19-alpine3.20',
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
            console.log(logChunk);
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

        await container.remove();
        console.log("Docker container removed successfully");

        return output;
    } catch (error) {
        console.error("Error running Python code in Docker container:", error);
        throw error;
    }
}

console.log("Docker service loaded successfully");

module.exports = { runPythonCode };
