const { data } = require("ttn");
const express = require("express");
const path = require("path");

const storedDataPath = "./data.json";
const fs = require("fs");

const app = express();

app.use(express.static(__dirname + "/public"));
app.use(function(req, res, next) {
  let allowedOrigins = [
    "http://silvanknecht.ch",
    "http://silviojaeger.ch",
    "http://localhost:2222"
  ];
  let origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) > -1) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET");
  return next();
});
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname + "/public/html/index.html"))
);

// route to fetch all stored Data
app.get("/api/v1/data", (req, res) => {
  console.log("All Data requested!");
  let rawdata = fs.readFileSync(storedDataPath);
  let dataToSend = JSON.parse(rawdata);
  res.json(dataToSend);
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
  console.log("Ascii Payload: ", payload_ascii);
  let humidity = Number(payload_ascii.substring(4, 6).replace(/[^0-9]/g));
  console.log("humidity", humidity);
  let temperature = payload_ascii.substring(0, 4) / 10;
  console.log("temperature", temperature);
  let co2 = Number(payload_ascii.substring(6, 11).replace(/[^0-9]/g, ""));
  console.log("co2", co2);
  let data = { humidity, temperature, co2, time };

  if (
    typeof co2 === "number" &&
    typeof humidity === "number" &&
    typeof temperature === "number" &&
    String(co2) !== "NaN" &&
    String(humidity) !== "NaN" &&
    String(temperature) !== "NaN"
  ) {
    console.log("Data is stored!");
    try {
      updateStoredData(dev_id, data);
      client.publish(
        "htwchurwebofthings:newData",
        JSON.stringify({ [dev_id]: { data } }, { qos: 2 })
      );
    } catch (error) {
      console.log("Updating Storage not possible: ", error);
    }
  } else {
    console.log("Something was wrong with the payload: ", payload_ascii);
  }
}

function updateStoredData(dev_id, data) {
  let rawdata = fs.readFileSync(storedDataPath);
  let dataToUpdate = JSON.parse(rawdata);
  let { temperature, humidity, co2, time } = data;

  // constrain size of storage json
  if (dataToUpdate[dev_id].data.time.length === 10000) {
    for (let prop in dataToUpdate[dev_id].data) {
      dataToUpdate[dev_id].data[prop].splice(0, 1);
    }
  }

  dataToUpdate[dev_id].data.temperature.push(temperature);
  dataToUpdate[dev_id].data.humidity.push(humidity);
  dataToUpdate[dev_id].data.co2.push(co2);
  dataToUpdate[dev_id].data.time.push(time);

  fs.writeFileSync(
    storedDataPath,
    JSON.stringify(dataToUpdate),
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
