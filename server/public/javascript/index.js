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
  const json = JSON.parse(message)
  console.log(json)
  const nodeName = Object.keys(json)[0]
  const xData = json[nodeName].data.time
  const yDataArray = [json[nodeName].data.temperature, json[nodeName].data.co2, json[nodeName].data.humidity]
  updatePlots(nodeName, xData, yDataArray)
}
//-----------------------------------------------------------------------------------------------

//---GET DATA------------------------------------------------------------------------------------
//const url = 'https://htw-chur-wot.herokuapp.com/api/v1/data'
const url = 'http://localhost:2222/api/v1/data'
fetch(url)
  .then(response => response.json())
  .then(data => {
    firstPlot(data)
  }
).catch(error => console.error(error))
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
  var boxes = document.querySelectorAll('#graphBoxes > input');
  for (var i = 0; i < boxes.length; i++) {
    if (boxes[i].checked) {
      addGraph(i)
    } else {
      removeGraph(i)
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

function addGraph(i) {
  for (plot of myPlots){
    plot.data[i].visible = true;
    Plotly.extendTraces(plot, {y: [[]]}, [i])
  }
}

function removeGraph(i) {
  for (plot of myPlots){
    plot.data[i].visible = false;
    Plotly.extendTraces(plot, {y: [[]]}, [i])
  }
}
//-----------------------------------------------------------------------------------------------