//---DATA input----------------------------------------------------------------------------------------
const dummyData = {
    'GebäudeA': {
        'temperature': [31, 11, 57, 40, 3, 80, 58, 82, 38, 6, 74, 90, 22, 84, 100, 93, 42, 5, 78, 96],
        'humidity': [58, 21, 97, 48, 66, 17, 47, 71, 70, 96, 50, 22, 84, 40, 28, 67, 95, 41, 75, 83],
        'co2': [11, 38, 22, 41, 26, 65, 95, 32, 39, 2, 74, 31, 47, 27, 99, 35, 9, 20, 36, 34],
        'time': ['2019-10-04 00:00:00', '2019-10-04 01:00:00', '2019-10-04 02:00:00', '2019-10-04 03:00:00', '2019-10-04 04:00:00', '2019-10-04 05:00:00', '2019-10-04 06:00:00', '2019-10-04 07:00:00', '2019-10-04 08:00:00', '2019-10-04 09:00:00', '2019-10-04 10:00:00', '2019-10-04 11:00:00', '2019-10-04 12:00:00', '2019-10-04 13:00:00', '2019-10-04 14:00:00', '2019-10-04 15:00:00', '2019-10-04 16:00:00', '2019-10-04 17:00:00', '2019-10-04 18:00:00', '2019-10-04 19:00:00', '2019-10-04 20:00:00']
    },
    'GebäudeB': {
        'temperature': [22, 34, 9, 95, 35, 37, 63, 14, 100, 3, 73, 10, 57, 89, 17, 81, 43, 13, 36, 25],
        'humidity': [11, 38, 22, 41, 26, 65, 95, 32, 39, 2, 74, 31, 47, 27, 99, 35, 9, 20, 36, 34],
        'co2': [11, 38, 22, 41, 26, 65, 95, 32, 39, 2, 74, 31, 47, 27, 99, 35, 9, 20, 36, 34],
        'time': ['2019-10-04 00:00:00', '2019-10-04 01:00:00', '2019-10-04 02:00:00', '2019-10-04 03:00:00', '2019-10-04 04:00:00', '2019-10-04 05:00:00', '2019-10-04 06:00:00', '2019-10-04 07:00:00', '2019-10-04 08:00:00', '2019-10-04 09:00:00', '2019-10-04 10:00:00', '2019-10-04 11:00:00', '2019-10-04 12:00:00', '2019-10-04 13:00:00', '2019-10-04 14:00:00', '2019-10-04 15:00:00', '2019-10-04 16:00:00', '2019-10-04 17:00:00', '2019-10-04 18:00:00', '2019-10-04 19:00:00', '2019-10-04 20:00:00']
    },
    'Kreisel': {
        'temperature': [67, 82, 95, 52, 85, 51, 21, 71, 74, 49, 58, 98, 57, 42, 23, 47, 84, 99, 77, 19],
        'humidity': [22, 52, 10, 91, 42, 15, 95, 58, 83, 70, 45, 50, 27, 13, 62, 47, 85, 25, 21, 87],
        'co2': [11, 38, 22, 41, 26, 65, 95, 32, 39, 2, 74, 31, 47, 27, 99, 35, 9, 20, 36, 34],
        'time': ['2019-10-04 00:00:00', '2019-10-04 01:00:00', '2019-10-04 02:00:00', '2019-10-04 03:00:00', '2019-10-04 04:00:00', '2019-10-04 05:00:00', '2019-10-04 06:00:00', '2019-10-04 07:00:00', '2019-10-04 08:00:00', '2019-10-04 09:00:00', '2019-10-04 10:00:00', '2019-10-04 11:00:00', '2019-10-04 12:00:00', '2019-10-04 13:00:00', '2019-10-04 14:00:00', '2019-10-04 15:00:00', '2019-10-04 16:00:00', '2019-10-04 17:00:00', '2019-10-04 18:00:00', '2019-10-04 19:00:00', '2019-10-04 20:00:00']
    }
}

console.log(new Date())


// iterate over json
for (var i in dummyData){
    console.log(dummyData[i])
}

// Plotly time format: '2019-10-04 00:00:00'

// silvans format: '2019-05-24T08:18:19.561276591Z'


//-----------------------------------------------------------------------------------------------

//---Plotly chart--------------------------------------------------------------------------------

//the actual data to plot

var trace1 = {
    x: dummyData.GebäudeA.time,
    y: dummyData.GebäudeA.temperature  
}
var trace2 = {
    x: dummyData.GebäudeB.time,
    y: dummyData.GebäudeB.temperature 
}

var tempData = [trace1, trace2];
var co2Data = [trace1, trace2];
var humidityData = [trace1, trace2];

//layout the plot
var tempLayout = {
    colorway: [
        "#61892F",
        "#86C232"
      
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
 