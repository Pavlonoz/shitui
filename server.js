const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const port = 8000;

// Middleware to parse JSON bodies with increased limit
app.use(bodyParser.json({ limit: '10mb' })); // Adjust the limit as needed

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to serve the scripts folder
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));

let currentScript = null;

// Endpoint to get a list of scripts in the scripts directory
app.get('/scripts', (req, res) => {
    fs.readdir(path.join(__dirname, 'scripts'), (err, files) => {
        if (err) {
            return res.status(500).send('Error reading scripts directory');
        }
        // Filter to include only .lua files
        const luaFiles = files.filter(file => file.endsWith('.lua'));
        res.json(luaFiles); // Respond with the list of scripts
    });
});

// Endpoint to get script content
app.get('/scripts/:name', (req, res) => {
    const scriptName = req.params.name;
    const scriptPath = path.join(__dirname, 'scripts', scriptName);

    if (fs.existsSync(scriptPath)) {
        res.sendFile(scriptPath);
    } else {
        res.status(404).send('Script not found');
    }
});

// Endpoint to receive commands from the web interface
app.post('/command', (req, res) => {
    const { script } = req.body; // Get the script from the request body
    if (script) {
        currentScript = script; // Store the script to be sent to the executor
        console.log('Script execution requested:', script); // Log for debugging
        res.send('Script execution requested'); // Send response back
    } else {
        res.status(400).send('Invalid command');
    }
});

// Endpoint for executor to poll for new scripts
app.get('/poll', (req, res) => {
    if (currentScript) {
        res.json({ script: currentScript });
        currentScript = null; // Clear the script after sending it
    } else {
        res.json({ script: null });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
