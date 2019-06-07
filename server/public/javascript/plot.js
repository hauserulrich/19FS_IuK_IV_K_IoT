//---Plotly chart--------------------------------------------------------------------------------
//Layout template
var layout = {
  colorway: [
      "#86C232",
      "#328e0e",
      "#000000"
  ],
  plot_bgcolor: "#474B4F",
  paper_bgcolor: "#474B4F",
  title: {
    text: "EXAMPLE",
    font: {
      family: "Roboto Condensed, sans-serif",
      size: 24,
      color: "white"
    }
  },
  xaxis: {
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
      color: 'white'
    },
  }
};

//the actual data to plot
function firstPlot(data){
  var plotTitles =  ["Temparature", "CO2", "Humidity"]
  var yaxisTitles = ["Temparature in °C", "Co2 in ppm", "Humidity in %"]
  var sensorArray = ['tempPlot', 'co2Plot', 'luftfPlot']
  var sensorData1Array = [data.iuk_lora_01.data.temperature, data.iuk_lora_01.data.co2, data.iuk_lora_01.data.humidity]
  var sensorData2Array = [data.iuk_lora_02.data.temperature, data.iuk_lora_02.data.co2, data.iuk_lora_02.data.humidity]
  var sensorData3Array = [data.iuk_lora_03.data.temperature, data.iuk_lora_03.data.co2, data.iuk_lora_03.data.humidity]


  for (i in sensorArray){
    var trace1 = {
      x: data.iuk_lora_01.data.time,
      y: sensorData1Array[i],
      name:'<span style="color:white">'+ data.iuk_lora_01.info.name +'</span>'
    }
    var trace2 = {
      x: data.iuk_lora_02.data.time,
      y: sensorData2Array[i],
      name: '<span style="color:white">'+data.iuk_lora_02.info.name +'</span>'
    }
    var trace3 = {
      x: data.iuk_lora_03.data.time,
      y: sensorData3Array[i],
      name: '<span style="color:white">'+data.iuk_lora_03.info.name+'</span>'
    }

    var plotData = [trace1, trace2, trace3];
    layout.title.text = plotTitles[i]
    layout.yaxis.title = yaxisTitles[i]

    Plotly.plot(document.getElementById(sensorArray[i]), plotData, layout);
  }
}