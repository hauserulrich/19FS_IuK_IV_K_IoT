const { data, application } = require("ttn");
const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname + "/public/index.html"))
);
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
  switch (port) {
    case 1:
      var humidity = (payload[0] << 8) | payload[1];
      var temperatur = (payload[2] << 8) | payload[3];

      let temperaturs = { humidity, temperatur, time };

      client.publish("silvanknecht:temperatures", JSON.stringify(temperaturs));
    case 2:
      var emissionsInside = (payload[0] << 8) | payload[1];
      var emissionsOutside = (payload[2] << 8) | payload[3];
      let emissions = { emissionsInside, emissionsOutside, time };
      client.publish("silvanknecht:emissions", JSON.stringify(emissions));
  }
}

//** MQTT **/

const urlBroker = "mqtt://broker.hivemq.com";
const mqtt = require("mqtt");
const client = mqtt.connect(urlBroker);

client.on("connect", onConnected);

function onConnected() {
  console.log("connected to broker " + urlBroker);
}
