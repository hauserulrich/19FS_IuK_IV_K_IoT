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

// route to fetch all stored Data
app.get("/api/v1/data", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*"); // for cors
  res.header("Access-Control-Allow-Headers", "*"); // for cors
  res.json(storedData);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App listening on port ${port}!`));

const appID = process.env.TTN_APPID;
const accessKey = process.env.TTN_ACCESSKEY;

//** Receive payload from the things network**/
data(appID, accessKey)
  .then(function(client) {
    client.on("uplink", function(devID, payload) {
      console.log("Received uplink from ", devID);
      decodePayload(payload);
    });
  })
  .catch(function(err) {
    console.error("Connection to TTN failed", err);
    process.exit(1);
  });

function decodePayload(payload) {
  let { payload_raw, metadata, dev_id } = payload;
  let time = metadata.time;
  let payload_ascii = String(payload_raw);
  let humidity = Number(payload_ascii.substring(4, 6));
  console.log("humidity", humidity);
  let temperature = payload_ascii.substring(0, 4) / 10;
  console.log("temperature", temperature);
  let co2 = payload_ascii.substring(7, 10) * 100;
  console.log("co2", co2);
  let data = { humidity, temperature, co2, time };
  updateStoredData(dev_id, data);

  client.publish(
    "htwchurwebofthings:newData",
    JSON.stringify({ [dev_id]: { data } })
  );
}

function updateStoredData(dev_id, data) {
  let { temperature, humidity, co2, time } = data;

  // constrain size of storage json
  if (storedData[dev_id].data.time.length === 10000) {
    storedData[dev_id].data.temperature.splice(0, 1);
    storedData[dev_id].data.humidity.splice(0, 1);
    storedData[dev_id].data.time.splice(0, 1);
  }

  storedData[dev_id].data.temperature.push(temperature);
  storedData[dev_id].data.humidity.push(humidity);
  storedData[dev_id].data.co2.push(co2);
  storedData[dev_id].data.time.push(time);

  fs.writeFile(
    storedDataPath,
    JSON.stringify(storedData),
    "utf8",
    (data, err) => {
      if (err) {
        console.log("Error during file writing: ", err);
      }
    }
  );
}

//** MQTT **//
const urlBroker = "mqtt://broker.hivemq.com";
const mqtt = require("mqtt");
const client = mqtt.connect(urlBroker);

client.on("connect", onConnected);

function onConnected() {
  console.log("connected to broker " + urlBroker);
}
