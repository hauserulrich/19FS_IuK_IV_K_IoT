//---MQTT----------------------------------------------------------------------------------------
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
//-----------------------------------------------------------------------------------------------

//make the plot
Plotly.plot(document.getElementById("tempPlot"), tempData, tempLayout);
Plotly.plot(document.getElementById("co2Plot"), co2Data, co2Layout);
Plotly.plot(document.getElementById("luftfPlot"), humidityData, luftfLayout);
//Plotly.update(CHART, data, layout);

//------------------------------------------------------------------------------------------------

//---Own Functions--------------------------------------------------------------------------------
function flipIt() {
  document.getElementById("settings").classList.toggle("flipRigth");
  document.getElementById("tempPlot").classList.toggle("flipLeft");
  document.getElementById("co2Plot").classList.toggle("flipLeft");
  document.getElementById("luftfPlot").classList.toggle("flipLeft");
}

function checkPlots() {
  var boxes = document.querySelectorAll('#plotBoxes > input');
  for (var i = 0; i < boxes.length; i++) {
    if (boxes[i].checked) {
      addChart(boxes[i].value)
    } else {
      removeChart(boxes[i].value)
    }
  }
}

function checkGraphs() {
  var graphs = document.querySelectorAll('#graphBoxes > input');
  for (var i = 0; i < graphs.length; i++) {
    if (graphs[i].checked) {
      addGraph(graphs[i].value)
    } else {
      removeGraph(graphs[i].value)
    }
  }
}
//-----------------------------------------------------------------------------------------------
//SHOW OR HIDE PLOTS
function addChart(chart) {
  console.log("add Chart: " + chart);
  document.getElementById(chart).style.display = 'block';
}
function removeChart(chart) {
  document.getElementById(chart).style.display = 'none';
}

function addGraph(graph) {
  console.log("add Graph: " + graph);
}

function removeGraph(graph) {
  console.log("remove Graph: " + graph);
}

//UPDATE PLOTS
function updatePlot(chart) {
  Plotly.update(document.getElementById(chart), data, tempLayout);
}