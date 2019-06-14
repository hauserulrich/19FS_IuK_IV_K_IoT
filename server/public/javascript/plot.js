//---Plotly chart--------------------------------------------------------------------------------
var myPlots = []
var sensorArray = ['tempPlot', 'co2Plot', 'luftfPlot']

//Layout template
const layout = {
  // colorway: [
  //     "#86C232",
  //     "#328e0e",
  //     "#d7e8da",
  //     "#000000"
  // ],
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
    //range: [0, 100],
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
//make deep copys of the layout for all plots
var tempLayout = JSON.parse(JSON.stringify(layout));
var co2Layout = JSON.parse(JSON.stringify(layout));
var humLayout = JSON.parse(JSON.stringify(layout));

//Make the plots after the fetch from the api
function firstPlot(data){
  var plotTitles =  ["Temparature", "CO2", "Humidity"]
  var yaxisTitles = ["Temparature in °C", "Co2 in ppm", "Humidity in %"]
  let layoutArray = [tempLayout, co2Layout, humLayout]
  const nodeArray = ['iuk_lora_01','iuk_lora_02','iuk_lora_03','iuk_lora_04']
  var sensorData1Array = [data.iuk_lora_01.data.temperature, data.iuk_lora_01.data.co2, data.iuk_lora_01.data.humidity]
  var sensorData2Array = [data.iuk_lora_02.data.temperature, data.iuk_lora_02.data.co2, data.iuk_lora_02.data.humidity]
  var sensorData3Array = [data.iuk_lora_03.data.temperature, data.iuk_lora_03.data.co2, data.iuk_lora_03.data.humidity]
  var sensorData4Array = [data.iuk_lora_04.data.temperature, data.iuk_lora_04.data.co2, data.iuk_lora_04.data.humidity]

  //change timeformat to gmt +2
  var timeStamps = []
  for (obj in data){
    let timeArray = []
    for (timestamp of data[obj].data.time){
      let actDate = new Date(timestamp)
      timeArray.push(actDate)
    }
    timeStamps.push(timeArray);
  }

  //dt.setHours( dt.getHours() + 2 );

  //set name of nodes to the checkboxes
  for (i of nodeArray){
    document.querySelector("label[for="+i+"]").innerHTML = data[i].info.name;
  }

  for (i in sensorArray){
    var trace1 = {
      x: timeStamps[0],
      y: sensorData1Array[i],
      name:'<span style="color:white">'+ data.iuk_lora_01.info.name +'</span>',
      visible: true,
      line: {
        color: "#86C232"
      }
    }
    var trace2 = {
      x: timeStamps[1],
      y: sensorData2Array[i],
      name: '<span style="color:white">'+data.iuk_lora_02.info.name +'</span>',
      visible: true,
      line: {
        color: "#328e0e"
      }
    }
    var trace3 = {
      x: timeStamps[2],
      y: sensorData3Array[i],
      name: '<span style="color:white">'+data.iuk_lora_03.info.name+'</span>',
      visible: true,
      line: {
        color: "#d7e8da"
      }
    }
    var trace4 = {
      x: timeStamps[3],
      y: sensorData4Array[i],
      name: '<span style="color:white">'+data.iuk_lora_04.info.name+'</span>',
      visible: true,
      line: {
        color: "#000000"
      }
    }

    const plotData = [trace1, trace2, trace3, trace4];
    layoutArray[i].title.text = plotTitles[i]
    layoutArray[i].yaxis.title = yaxisTitles[i]
    Plotly.plot(document.getElementById(sensorArray[i]), plotData, layoutArray[i]).then((actPlot)=>myPlots.push(actPlot))
  }
}

//Update plots (shoots on every mqtt message)
function updatePlots(nodeName, xData, yDataArray) {
  console.log('----------UpdatePlot---------')
  console.log('Node: '+nodeName)
  console.log(xData)
  console.log(yDataArray)
  console.log('-----------------------------')
  //set timestamps
  let actDate = new Date(xData)

  const nodeArray = ['iuk_lora_01', 'iuk_lora_02', 'iuk_lora_03', 'iuk_lora_04']
  const index = nodeArray.indexOf(nodeName)
  if(index==-1){return} //stop if node is not in array
  //update temparature trace
  if(yDataArray[0] != null){
    Plotly.extendTraces(document.getElementById('tempPlot'), {y: [[yDataArray[0]]], x: [[actDate]]}, [index])
    console.log("updating trace "+index+" in temparature plot")
  }
  //update co2 trace
  if(yDataArray[1] != null){
    Plotly.extendTraces(document.getElementById('co2Plot'), {y: [[yDataArray[1]]], x: [[actDate]]}, [index])
    console.log("updating trace "+index+" in co2 plot")
  }
  //update humidity trace
  if(yDataArray[2] != null){
    Plotly.extendTraces(document.getElementById('luftfPlot'), {y: [[yDataArray[2]]], x: [[actDate]]}, [index])
    console.log("updating trace "+index+" in humidityPlot")
  }
  //0: temparature, 1: co2, 2:humidity
}