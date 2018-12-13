<script>
function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  return color;
}

function convertHex(hex) {
  hex = hex.replace("#", "");
  r = parseInt(hex.substring(0, 2), 16);
  g = parseInt(hex.substring(2, 4), 16);
  b = parseInt(hex.substring(4, 6), 16);

  return [r, g, b];
}

function colorDistance(color1, color2) {
  rgb1 = convertHex(color1);
  rgb2 = convertHex(color2);

  return Math.sqrt(
    (rgb2[0] - rgb1[0]) ^
      (2 + (rgb2[1] - rgb1[1])) ^
      (2 + (rgb2[1] - rgb1[1])) ^
      2
  );
}

function allDist(col, cols, thresh) {
  for (let o = 0; o < cols.length; o++) {
    console.log(colorDistance(col, cols[o]));

    if (colorDistance(col, cols[o]) < thresh) return false;
  }
  return true;
}

var dummy_data = [];
var colors = [];
for (let i = 0; i < 5; i++) {
  var random = [];
  random[0] = 10;
  for (let j = 1; j < 12; j++) {
    random.push(Math.random() * (100 - random[j - 1]) + 20);
  }

  var col = "#" + Math.floor(Math.random() * 16777215).toString(16);
  while (col in colors) {
    col = "#" + Math.floor(Math.random() * 16777215).toString(16);
  }
  colors.push(col);

  dummy_data.push({
    label: "Data " + i,
    borderColor: col,
    // borderColor: window.chartColors.blue,
    // backgroundColor: window.chartColors.blue,
    fill: false,
    // pointBackgroundColor: "white",
    // borderWidth: 1,
    // pointBorderColor: "#249EBF",
    // fill: false,
    // Data to be represented on y-axis
    data: random
  });
}

// Importing Line class from the vue-chartjs wrapper
import { Line } from "vue-chartjs";

// Exporting this so it can be used in other components
export default {
  extends: Line,
  data() {
    return {
      datacollection: {
        // Data to be represented on x-axis
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December"
        ],
        datasets: dummy_data // some array of values of lenght equals to the lenghts of LABLES
      },
      // Chart.js options that controls the appearance of the chart
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              },
              gridLines: {
                display: true
              }
            }
          ],
          xAxes: [
            {
              gridLines: {
                display: true
              }
            }
          ]
        },
        legend: {
          display: true
        },
        responsive: true,
        maintainAspectRatio: false
      }
    };
  },
  mounted() {
    // renderChart function renders the chart with the datacollection and options object.
    this.renderChart(this.datacollection, this.options);
  }
};
</script>
