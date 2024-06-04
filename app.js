const express = require('express');
const bodyParser = require('body-parser');
const Docker = require('dockerode');
const app = express();
const docker = new Docker();
require('dotenv').config();

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {

  
});

// Define a schema for your data
const outputSchema = new Schema({
  output: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a model based on the schema
const OutputModel = mongoose.model('Output', outputSchema);

require('dotenv').config();

console.log(process.env.PYTHON_IMAGE);

app.use(bodyParser.json());


app.post('/', async (req, res) => {
    try {
      const { code } = req.body;
  
      // Create a Docker container
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
  
      // Save the output to MongoDB
      const newOutput = new OutputModel({ output });
      await newOutput.save();
  
      res.status(200).json({ output });
  
      await container.remove();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
