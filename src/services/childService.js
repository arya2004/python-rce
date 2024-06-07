const { spawn } = require('child_process');
const { exec } = require('child_process');

const spawnChildCode = (code) => {
    return new Promise((resolve, reject) => {
        const process = spawn('python', ['-c', code]);

        let stdout = '';
        let stderr = '';

        process.stdout.on('data', (data) => {
            stdout += data.toString('utf8');
            //console.log(stdout)
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



const execChildCode = (code) => {
    return new Promise((resolve, reject) => {
        exec(`python -c "${code.replace(/"/g, '\\"')}"`, (error, stdout, stderr) => {
            if (error) {
                reject(stderr || error.message);
            } else {
                resolve(stdout);
            }
        });
    }); 
};

module.exports = { execChildCode, spawnChildCode };
