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


//---DATA input----------------------------------------------------------------------------------------
dummyData = {
  'GebäudeA': {
    'temperature': [31, 11, 57, 40, 3, 80, 58, 82, 38, 6, 74, 90, 22, 84, 100, 93, 42, 5, 78, 96],
    'humidity': [58, 21, 97, 48, 66, 17, 47, 71, 70, 96, 50, 22, 84, 40, 28, 67, 95, 41, 75, 83],
    'time': []
  },
  'GebäudeB': {
    'temperature': [22, 34, 9, 95, 35, 37, 63, 14, 100, 3, 73, 10, 57, 89, 17, 81, 43, 13, 36, 25],
    'humidity': [11, 38, 22, 41, 26, 65, 95, 32, 39, 2, 74, 31, 47, 27, 99, 35, 9, 20, 36, 34],
    'time': []
  },
  'Kreisel': {
    'temperature': [67, 82, 95, 52, 85, 51, 21, 71, 74, 49, 58, 98, 57, 42, 23, 47, 84, 99, 77, 19],
    'humidity': [22, 52, 10, 91, 42, 15, 95, 58, 83, 70, 45, 50, 27, 13, 62, 47, 85, 25, 21, 87],
    'time': []
  }
}
//-----------------------------------------------------------------------------------------------


//---Plotly chart--------------------------------------------------------------------------------

//layout the plot
var tempLayout = {
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
    range: [0, 11],
    color: "white",
    showline: true,
    linecolor: "white",
    title: 'Time',
    titlefont: {
      family: 'Roboto Condensed, sans-serif',
      size: 14,
      color: 'white'
    },
  },
  yaxis: {
    range: [0, 100],
    color: "white",
    showline: true,
    linecolor: "white",
    title: 'Temparature in C',
    titlefont: {
      family: 'Roboto Condensed, sans-serif',
      size: 14,
      color: 'lightgrey'
    },
  }
};

var co2Layout = {
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
    text: "CO2",
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

var luftfLayout = {
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
    text: "Luftfeuchtigkeit",
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
var x = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var y = [0, 20, 100, 40, 50, 60, 34, 56, 23, 2];
var data = [
  {
    x: x,
    y: y
  }
];

//make the plot
Plotly.plot(document.getElementById("tempPlot"), data, tempLayout);
Plotly.plot(document.getElementById("co2Plot"), data, co2Layout);
Plotly.plot(document.getElementById("luftfPlot"), data, luftfLayout);
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

var counter = 0;
window.setInterval(function () {
  counter += 0.1;
  adder = 0.4;
  y[0] = Math.sin(counter + 0 * adder) * 50 + 50;
  y[1] = Math.sin(counter + 1 * adder) * 50 + 50;
  y[2] = Math.sin(counter + 2 * adder) * 50 + 50;
  y[3] = Math.sin(counter + 3 * adder) * 50 + 50;
  y[4] = Math.sin(counter + 4 * adder) * 50 + 50;
  y[5] = Math.sin(counter + 5 * adder) * 50 + 50;
  y[6] = Math.sin(counter + 6 * adder) * 50 + 50;
  y[7] = Math.sin(counter + 7 * adder) * 50 + 50;
  y[8] = Math.sin(counter + 8 * adder) * 50 + 50;
  y[9] = Math.sin(counter + 9 * adder) * 50 + 50;
  y[10] = Math.sin(counter + 10 * adder) * 50 + 50;
  updatePlot('tempPlot');
}, 20);