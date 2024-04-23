-- Table for storing information about households
CREATE TABLE
    Household (
        householdID INT PRIMARY KEY AUTO_INCREMENT,
        householdName VARCHAR(255) NOT NULL,
        contactEmail VARCHAR(255) NOT NULL UNIQUE,
        address VARCHAR(255) NOT NULL,
        city VARCHAR(255) NOT NULL,
        state VARCHAR(255) NOT NULL,
        country VARCHAR(255) NOT NULL,
        timezoneID INT NOT NULL,
        gpsLatitude DECIMAL(10, 8) NOT NULL,
        gpsLongitude DECIMAL(11, 8) NOT NULL,
        FOREIGN KEY (timezoneID) REFERENCES Timezone (timezoneID)
    );

-- Table for storing tank properties for each household
CREATE TABLE
    Tank (
        tankID INT PRIMARY KEY AUTO_INCREMENT,
        householdID INT NOT NULL,
        capacityLiters INT NOT NULL,
        heightCm INT NOT NULL,
        radiusCm INT NOT NULL,
        -- Add other relevant fields as needed
        FOREIGN KEY (householdID) REFERENCES Household (householdID)
    );

-- Table for storing sensor data
CREATE TABLE
    SensorData (
        dataID INT PRIMARY KEY AUTO_INCREMENT,
        householdID INT NOT NULL,
        sensorID VARCHAR(255) NOT NULL,
        waterLevelLiters INT NOT NULL,
        timestamp DATETIME NOT NULL,
        -- Add other relevant fields as needed
        FOREIGN KEY (householdID) REFERENCES Household (householdID)
    );

-- Table for storing additional sensor metadata
CREATE TABLE
    Sensor (
        sensorID INT PRIMARY KEY AUTO_INCREMENT,
        sensorName VARCHAR(255) NOT NULL,
        sensorVersion VARCHAR(255) NOT NULL,
    );

-- Table for storing timestamps in different timezones
CREATE TABLE
    Timezone (
        timezoneID INT PRIMARY KEY AUTO_INCREMENT,
        timezoneName VARCHAR(2000) NOT NULL,
        timeDifference DECIMAL(4, 2) NOT NULL
    );

-- Inserting additional data into the Timezone table
INSERT INTO Timezone (timezoneName, timeDifference) VALUES ('IST - Indian Standard Time', 5.30);
INSERT INTO Timezone (timezoneName, timeDifference) VALUES ('EST - Eastern Standard Time', -5.00);
INSERT INTO Timezone (timezoneName, timeDifference) VALUES ('PST - Pacific Standard Time', -8.00);
INSERT INTO Timezone (timezoneName, timeDifference) VALUES ('CET - Central European Time', 1.00);
INSERT INTO Timezone (timezoneName, timeDifference) VALUES ('AEST - Australian Eastern Standard Time', 10.00);
INSERT INTO Timezone (timezoneName, timeDifference) VALUES ('JST - Japan Standard Time', 9.00);
INSERT INTO Timezone (timezoneName, timeDifference) VALUES ('CST - China Standard Time', 8.00);
INSERT INTO Timezone (timezoneName, timeDifference) VALUES ('GST - Gulf Standard Time', 4.00);
INSERT INTO Timezone (timezoneName, timeDifference) VALUES ('BRT - Brasília time', -3.00);
INSERT INTO Timezone (timezoneName, timeDifference) VALUES ('CAT - Central Africa Time', 2.00);

INSERT INTO Household (householdName, contactEmail, address, city, state, country, timezoneID, gpsLatitude, gpsLongitude) 
VALUES ('Smith Household', 'smith@example.com', '123 Main St', 'Anytown', 'CA', 'USA', 3, 37.7749, -122.4194);
INSERT INTO Household (householdName, contactEmail, address, city, state, country, timezoneID, gpsLatitude, gpsLongitude) 
VALUES ('Jha Household', 'jha@example.com', '123 Main St', 'VIT Vellore', 'TN', 'IN', 1, 83.7749, -122.4194);

INSERT INTO Household (householdName, contactEmail, address, city, state, country, timezoneID, gpsLatitude, gpsLongitude) 
VALUES 
('Smith Residence', 'smithh@example.com', '123 Main St', 'Anytown', 'CA', 'USA', 3, 37.7749, -122.4194),
('Johnson House', 'johnson@example.com', '456 Elm St', 'Sometown', 'NY', 'USA', 2, 40.7128, -74.0060),
('Brown Home', 'brown@example.com', '789 Oak St', 'Villagetown', 'TX', 'USA', 1, 29.7604, -95.3698),
('Miller Manor', 'miller@example.com', '101 Pine St', 'Smalltown', 'FL', 'USA', 4, 28.5383, -81.3792),
('Wilson Residence', 'wilson@example.com', '202 Cedar St', 'Hometown', 'IL', 'USA', 5, 41.8781, -87.6298);

INSERT INTO Tank (householdID, capacityLiters, heightCm, radiusCm) 
VALUES 
(1, 5000, 200, 100),
(2, 7000, 250, 120),
(8, 10000, 300, 150),
(9, 4000, 180, 90),
(10, 6000, 220, 110);


INSERT INTO Sensor (sensorName, sensorVersion) 
VALUES 
('Water Level Sensor 1', 'v1.0'),
('Water Level Sensor 2', 'v1.1'),
('Water Level Sensor 3', 'v2.0'),
('Temperature Sensor 1', 'v1.0'),
('Pressure Sensor 1', 'v1.0');