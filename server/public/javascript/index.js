//---MQTT----------------------------------------------------------------------------------------
const urlBroker = "ws://broker.hivemq.com:8000/mqtt";
var client = mqtt.connect(urlBroker);

client.on("connect", onConnected);
client.on("message", onMessage);

function onConnected() {
  console.log("connected to broker " + urlBroker);
  client.subscribe("htwchurwebofthings:newData");
}

function onMessage(topic, message) {
  console.log("new MQTT message:")
  console.log(JSON.parse(message));
  //{"iuk_lora_01":{"data":{"humidity":44461,"temperature":0,"co2":34,"time":"2019-06-05T16:29:00.74462403Z"}}}
}
//-----------------------------------------------------------------------------------------------
//get Data

fetch('http://localhost:2222/api/v1/data')
  .then(response => response.json())
  .then(data => {
    firstPlot(data)
  }
).catch(error => console.error(error))


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