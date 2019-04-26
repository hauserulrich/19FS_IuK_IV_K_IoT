const urlBroker = "ws://broker.hivemq.com:8000/mqtt";
var client = mqtt.connect(urlBroker);

client.on("connect", onConnected);
client.on("message", onMessage);

function onConnected() {
  console.log("connected to broker " + urlBroker);
  client.subscribe("silvanknecht:temperatures");
  client.subscribe("silvanknecht:emissions");
}

function onMessage(topic, message) {
  console.log("topic: " + topic + ", message: " + message);
}

//Plotly chart-----------------------------------------------------------------
CHART = document.getElementById('chart');

var layout = {
  colorway : ['#f3cec9', '#e7a4b6', '#cd7eaf', '#a262a9', '#6f4d96', '#3d3b72', '#182844']
};

Plotly.plot( CHART, [{
x: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
y: [1, 2, 4, 8, 16, 14, 6, 3, 3, 7, 10, 25, 30, 20, 15, 12, 12, 5, 7, 6] }], layout );
//-----------------------------------------------------------------------------