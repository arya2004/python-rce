const { spawn } = require('child_process');

const runChildCode = (code) => {
    return new Promise((resolve, reject) => {
        const process = spawn('python', ['-c', code]);

        let stdout = '';
        let stderr = '';

        process.stdout.on('data', (data) => {
            stdout += data.toString('utf8');
        });

        process.stderr.on('data', (data) => {
            stderr += data.toString('utf8');
        });

        process.on('close', (code) => {
            if (code === 0) {
                resolve(stdout);
            } else {
                reject(stderr);
            }
        });

        process.on('error', (error) => {
            reject(error.message);
        });
    });
};

  module.exports = { runChildCode };