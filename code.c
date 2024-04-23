#include <ArduinoHttpClient.h>
#include <Ultrasonic.h>
#include <Wifi101.h>

#include <Arduino_JSON.h>

#include <ArduinoHttpClient.h>
#include <WiFi101.h>
#include <HTTPClient.h>
#define TRIG_PIN 8
#define ECHO_PIN 9

// WiFi credentials
const char* ssid = "Aadarsh's Nord";
const char* password = "aadarsh1234";

// API endpoint
const char* serverUrl = "https://embedded-production.up.railway.app/waterLevel";

// Household data
const int householdID = 1;  // Assuming household ID is 1

const float tankHeighcm = 150;
const float tankRadiuscm = 50;
const int tankCapacityLiters = 5000;
Ultrasonic ultrasonic(TRIGGER_PIN, ECHO_PIN);

WifiClient wifi;
HttpClient client = HttpClient(wifi, serverUrl, 80);
int status = WL_IDLE_STATUS;

void setup() {
  while (status != WL_CONNECTED) {
    Serial.print("Attempting to connect to Network named: ");
    Serial.println(ssid);  // print the network name;

    // Connect network:
    status = WiFi.begin(ssid, pass);
  }

  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());

  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);
}

void loop() {
  sendPost();
  delay(3600000);
}

void sendPostRequest() {
  HttpClient http;
  StaticJsonDocument<200> jsonDoc;
  char timestamp[25];
  getTimestamp(timestamp);
  float sensorReadingCm = getSensorReading();
  Serial.print("Sensor reading (cm): ");
  Serial.println(sensorReadingCm);
  float waterVolume = calculateWaterRemaining(tankHeightcm, sensorReadingCm);
  jsonDoc["householdID"] = 2;
  jsonDoc["sensorID"] = 1;
  jsonDoc["waterLevelLiters"] = waterVolume;
  jsonDoc["timestamp"] = timestamp;
  String jsonString;
  serializeJson(jsonDoc, jsonString);

  // Send HTTP POST request
  http.beginRequest();
  http.post(serverUrl);
  http.sendHeader("Content-Type", "application/json");
  http.sendHeader("Content-Length", jsonString.length());
  http.beginBody();
  http.print(jsonString);
  http.endRequest();

  // Check response
  int statusCode = http.responseStatusCode();
  String response = http.responseBody();

  Serial.print("HTTP Response code: ");
  Serial.println(statusCode);
  Serial.println("Response:");
  Serial.println(response);
}

void getTimestamp(char* timestamp) {
  // Get current time
  time_t now = time(nullptr);

  // Format time as ISO 8601 string
  strftime(timestamp, 25, "%Y-%m-%dT%H:%M:%SZ", gmtime(&now));
}

float calculateTankCapacity(float tankHeightCm) {
  // Assuming tank is a cylinder
  float tankVolumeLiters = PI * tankRadiusCm * tankRadiusCm * tankHeightCm / 1000.0;  // Convert from cm^3 to liters

  return tankVolumeLiters;
}
float getSensorReading() {
  // Measure distance in centimeters
  return ultrasonic.read();
}
