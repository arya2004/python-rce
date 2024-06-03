const express = require('express');
const bodyParser = require('body-parser');
const Docker = require('dockerode');
const app = express();
const docker = new Docker();

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('test get');

});

app.post('/', async (req, res) => {
    const { code } = req.body;

    try {
        
        const container = await docker.createContainer({
            Image: 'python:3.9.19-alpine3.20',
            Cmd: ['python', '-c', code],
            Tty: false,
        });

        await container.start();

        const output = await new Promise((resolve, reject) => {
            container.attach({ stream: true, stdout: true, stderr: true }, (err, stream) => {
                if (err) {
                    return reject(err);
                }

                let result = '';
           
                
                
                stream.on('data', (data) => {
                    console.log(data.toString().replace(/[^\x03-\xFF]/g, ''));




                    result += data.toString().replace(/[^\x03-\xFF]/g, '');
                });

                stream.on('end', () => {
                    resolve(result);
                });

                stream.on('error', reject);
            });     
        });

        //await container.remove();
        res.send({ output: output.trim() }); 
    } catch (error) {
        res.status(500).send(`Execution error: ${error.message}`);
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
