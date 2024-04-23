const express = require('express');
const bodyParser = require('body-parser');
const { waterLevelSchema } = require('./lib/zodSchema');
const connection = require('./lib/mysql');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the application' });
});

app.get('/ping', (req, res) => {
    res.json({ message: 'pong' });
});

app.post('/waterlevel', (req, res) => {
    try {
        //Receives water level data from the sensor
        const waterLevelData = req.body;
        console.log(waterLevelData);
        const {
            deviceID,
            sensorID,
            homeLocation,
            waterLevel,
            timestamp,
            timezone,
            tankCapacity,
            tankHeight,
            tankRadius,
            tankVolume,
        } = waterLevelSchema.parse(waterLevelData);




    } catch (error) {
        console.log("Zod parse error",error);
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
    connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
        if (error) throw error;
        console.log('The solution is: ', results[0].solution);
    });
});