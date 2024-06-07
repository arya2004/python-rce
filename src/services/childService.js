const { spawn, exec } = require('child_process');

/**
 * Spawns a child process to execute Python code.
 * 
 * @param {string} code - The Python code to execute.
 * @returns {Promise<string>} - Resolves with the stdout output if the code executes successfully, rejects with stderr output or error message if it fails.
 */
const spawnChildCode = (code) => {
    return new Promise((resolve, reject) => {
        const process = spawn('python', ['-c', code]);

        let stdout = '';
        let stderr = '';

        process.stdout.on('data', (data) => {
            stdout += data.toString('utf8');
            console.log(`stdout: ${data.toString('utf8')}`);
        });

        process.stderr.on('data', (data) => {
            stderr += data.toString('utf8');
            console.error(`stderr: ${data.toString('utf8')}`);
        });

        process.on('close', (code) => {
            if (code === 0) {
                console.log('Process closed successfully');
                resolve(stdout);
            } else {
                console.error(`Process closed with code ${code}`);
                reject(stderr);
            }
        });

        process.on('error', (error) => {
            console.error(`Process error: ${error.message}`);
            reject(error.message);
        });
    });
};

/**
 * Executes Python code using exec.
 * 
 * @param {string} code - The Python code to execute.
 * @returns {Promise<string>} - Resolves with the stdout output if the code executes successfully, rejects with stderr output or error message if it fails.
 */
const execChildCode = (code) => {
    return new Promise((resolve, reject) => {
        exec(`python -c "${code.replace(/"/g, '\\"')}"`, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${stderr || error.message}`);
                reject(stderr || error.message);
            } else {
                console.log(`exec stdout: ${stdout}`);
                resolve(stdout);
            }
        });
    }); 
};

console.log("Child service functions loaded successfully");

module.exports = { execChildCode, spawnChildCode };
