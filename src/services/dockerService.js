const Docker = require('dockerode');

const docker = new Docker();

async function runPythonCode(code) {
    const container = await docker.createContainer({
        Image: 'python:3.9.19-alpine3.20',
        AttachStdout: true,
        AttachStderr: true,
        Tty: true,
        Cmd: ['python', '-c', code],
    });

    await container.start();

    const logs = await container.logs({
        follow: true,
        stdout: true,
        stderr: true,
    });

    let output = '';
    logs.on('data', (chunk) => {
        output += chunk.toString('utf8');
        console.log(chunk.toString('utf8'));
    });

    await new Promise((resolve, reject) => {
        container.wait((err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });

    await container.remove();

    return output;
}

module.exports = { runPythonCode };
