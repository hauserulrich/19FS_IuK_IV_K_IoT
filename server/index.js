const { data, application } = require("ttn");
const express = require("express");
const path = require("path");

const storedDataPath = "./data.json";
const storedData = require(storedDataPath);
var fs = require("fs");

const app = express();

app.use("/", express.static("public"));
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname + "/public/html/index.html"))
);
app.get("/api/v1/data", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*"); // for cors
  res.header("Access-Control-Allow-Headers", "*"); // for cors
  res.json(storedData);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

const appID = process.env.TTN_APPID;
const accessKey = process.env.TTN_ACCESSKEY;

//** Receive payload from the things network**/
data(appID, accessKey)
  .then(function(client) {
    client.on("uplink", function(devID, payload) {
      console.log("Received uplink from ", devID);

      console.log(payload);
      decodePayload(payload.payload_raw, payload.port, payload.metadata);
    });
  })
  .catch(function(err) {
    console.error(err);
    process.exit(1);
  });

function decodePayload(payload, port, metadata) {
  let time = metadata.time;
  // the case represents the port
  switch (port) {
    case 1: // GebäudeA
      let humidity = (payload[0] << 8) | payload[1];
      let temperature = (payload[2] << 8) | payload[3];
      let data = { humidity, temperature, time };
      updateStoredData("GebäudeA", data);

      client.publish("htwchurwebofthings:gebäudea", JSON.stringify(data));
      break;
    // case 2: // GebäudeB
    //   let emissionsInside = (payload[0] << 8) | payload[1];
    //   let emissionsOutside = (payload[2] << 8) | payload[3];
    //   let emissions = { emissionsInside, emissionsOutside, time };
    //   updateStoredData("2", emissions);
    //   client.publish("htwchurwebofthings:gebäudeb", JSON.stringify(emissions));
    //   break;
    // case 3: // Kreisel
    //   let emissionsInside2 = (payload[0] << 8) | payload[1];
    //   let emissionsOutside2 = (payload[2] << 8) | payload[3];
    //   let emissions2 = { emissionsInside2, emissionsOutside2, time };
    //   updateStoredData("3", emissions2);
    //   client.publish("htwchurwebofthings:kreisel", JSON.stringify(emissions2));
    //   break;
  }
}

function updateStoredData(location, data) {
  let { temperature, humidity, time } = data;
  if (storedData[location].temperature.length === 10000)
    storedData[location].temperature.splice(0, 1);
  storedData[location].humidity.splice(0, 1);
  storedData[location].time.splice(0, 1);

  storedData[location].temperature.push(temperature);
  storedData[location].humidity.push(humidity);
  storedData[location].time.push(time);

  fs.writeFile(storedDataPath, JSON.stringify(storedData), "utf8");
}

//** MQTT **/

const urlBroker = "mqtt://broker.hivemq.com";
const mqtt = require("mqtt");
const client = mqtt.connect(urlBroker);

client.on("connect", onConnected);

function onConnected() {
  // after the connection has been established send all stored data to the client
  console.log("connected to broker " + urlBroker);
}
