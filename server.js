const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;
const filename = './gpuData.json';

app.use(express.static('public'));
// Middleware to parse JSON body
app.use(express.json());

// Read data
app.get('/gpus', (req, res) => {
    fs.readFile(filename, (err, data) => {
        if (err) {
            res.status(500).send('Error reading file');
        } else {
            res.send(JSON.parse(data || '[]'));
        }
    });
});

// Add data
app.post('/add_gpu', (req, res) => {
    const newGPU = req.body;
    fs.readFile(filename, (err, data) => {
        const gpuList = data ? JSON.parse(data) : [];
        gpuList.push(newGPU);
        fs.writeFile(filename, JSON.stringify(gpuList, null, 2), (err) => {
            if (err) {
                res.status(500).send('Error writing file');
            } else {
                res.send('GPU added successfully');
            }
        });
    });
});

// Remove data
app.post('/remove_gpu', (req, res) => {
    const gpuList = req.body;
    fs.writeFile(filename, JSON.stringify(gpuList, null, 2), (err) => {
        if (err) {
            res.status(500).send('Error writing file');
        } else {
            res.send('GPU added successfully');
        }
    });
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));