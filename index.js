const express = require('express');
const bodyParser = require('body-parser');
const db = require('./lib/mysql');
const app = express();
require('dotenv').config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the application' });
});

app.get('/ping', (req, res) => {
    res.json({ message: 'pong' });
});

app.post('/waterLevel', async (req, res) => {
    try {
        //Receives water level data from the sensor
        const waterLevelData = req.body;
        const {
            householdID,
            sensorID,
            waterLevelLiters,
            timestamp
        } = waterLevelData;
        //Get timezone from db and convert timestamp to UTC
        const userTimezone = await db.query(`SELECT timezoneID FROM Household WHERE householdID = ?`, [householdID], "Get user timezone query");
        if (!userTimezone.length) {
            return res.status(400).json({ success: 0, message: "Household not found" });
        }
        const timezone = await db.query(`SELECT timezoneID, timeDifference, timezoneName FROM Timezone WHERE timezoneID = ?`, [userTimezone[0].timezoneID], "Get timezone query");
        const timestampUTC = new Date(new Date(timestamp).getTime() + timezone[0].timeDifference * 60000);
        console.log("TIMESTAMP", timestampUTC);
        //Insert the data into the database
        const results = await db.query(`INSERT INTO SensorData (householdID, sensorID, waterLevelLiters, timestamp)
        VALUES (?, ?, ?, ?)`, [householdID, sensorID, waterLevelLiters, timestampUTC], "Add Sensor Data query");
        //console.log(results);
        return res.status(200).json({ success: 1, message: 'Data inserted successfully' });

    } catch (error) {
        console.log("Zod parse error", error);
        return res.status(400).json({ success: 0, message: error.errors });
    }
});

app.post("/createHousehold", async (req, res) => {
    try {
        const householdData = req.body;
        const { householdName, contactEmail, address, city, state, country, timezoneID, gpsLatitude, gpsLongitude, tank } = householdData;
        if (!householdName || !contactEmail || !address || !city || !state || !country || !timezoneID || !gpsLatitude || !gpsLongitude) {
            return res.status(400).json({ success: 0, message: "Missing required fields" });
        }
        const results = await db.query(`INSERT INTO Household (householdName, contactEmail, address, city, state, country, timezoneID, gpsLatitude, gpsLongitude) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [householdName, contactEmail, address, city, state, country, timezoneID, gpsLatitude, gpsLongitude], "Add Household query");
        //console.log(results);
        if (!results.insertId) {
            return res.status(400).json({ success: 0, message: "Cannot create household" });
        }
        //Add to tank
        const tankResults = await db.query(`INSERT INTO Tank (householdID, capacityLiters, heightCm,radiusCm) 
        VALUES (?, ?, ?, ?)`, [results.insertId, tank.capacityLiters, tank.heightCm, tank.radiusCm], "Add Tank query");

        return res.status(200).json({ success: 1, message: 'Household created successfully', householdID: results.insertId });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ success: 0, message: "Cannot create household" });
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0",() => {
    console.log('Server is running on port ',PORT);
    db.init();
});