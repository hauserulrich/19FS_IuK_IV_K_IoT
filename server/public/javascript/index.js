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

//---Plotly chart--------------------------------------------------------------------------------
CHART = document.getElementById("chart");

//layout the plot
var layout = {
  colorway: [
    "#86C232",
    "#86C232",
    "#222629",
    "#474B4F",
    "#6B6E70",
    "#6B6E70",
    "#6B6E70"
  ],
  plot_bgcolor: "#474B4F",
  paper_bgcolor: "#474B4F",
  title: {
    text: "Temparature",
    font: {
      family: "Roboto Condensed, sans-serif",
      size: 24,
      color: "white"
    }
  },
  xaxis: {
    color: "white",
    showline: true,
    linecolor: "white"
  },
  yaxis: {
    color: "white",
    showline: true,
    linecolor: "white"
  }
};
//the actual data to plot
var x = [1, 2, 3, 4, 5];
var y = [0, 20, 100, 40, 50];
var data= [
  {
    x: x,
    y: y
  }
];

//make the plot
Plotly.plot(
  CHART,
  data,
  layout
);
//------------------------------------------------------------------------------------------------

//---Own Functions--------------------------------------------------------------------------------
function flipIt() {
  document.getElementById("settings").classList.toggle("flipRigth");
  document.getElementById("chart").classList.toggle("flipLeft");
}

var slider = document.getElementById("slider");
slider.oninput = function() {
  updateSlider();
}


function updateSlider(){
  var i = slider.value;
  y[4]=Number(i);
  console.log(x);
  Plotly.update(CHART, data, layout);
}
//-----------------------------------------------------------------------------------------------
