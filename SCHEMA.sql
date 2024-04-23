-- Table for storing information about households
CREATE TABLE Household (
    householdID INT PRIMARY KEY AUTO_INCREMENT,
    householdName VARCHAR(255) NOT NULL,
    contactEmail VARCHAR(255) NOT NULL UNIQUE,
    -- Add other relevant fields as needed
);

-- Table for storing tank properties for each household
CREATE TABLE Tank (
    tankID INT PRIMARY KEY AUTO_INCREMENT,
    householdID INT NOT NULL,
    capacityLiters INT NOT NULL,
    heightCm INT NOT NULL,
    radiusCm INT NOT NULL,
    -- Add other relevant fields as needed
    FOREIGN KEY (householdID) REFERENCES Household(householdID)
);

-- Table for storing sensor data
CREATE TABLE SensorData (
    dataID INT PRIMARY KEY AUTO_INCREMENT,
    householdID INT NOT NULL,
    sensorID VARCHAR(255) NOT NULL,
    waterLevelLiters INT NOT NULL,
    timestamp DATETIME NOT NULL,
    -- Add other relevant fields as needed
    FOREIGN KEY (householdID) REFERENCES Household(householdID)
);

-- Table for storing additional sensor metadata
CREATE TABLE Sensor (
    sensorID INT PRIMARY KEY AUTO_INCREMENT,
    sensorName VARCHAR(255) NOT NULL,
    -- Add other relevant fields as needed
);

-- Table for storing timestamps in different timezones
CREATE TABLE Timezone (
    timezoneID INT PRIMARY KEY AUTO_INCREMENT,
    timezoneName VARCHAR(255) NOT NULL,
    -- Add other relevant fields as needed
);
