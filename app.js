const express = require('express');
const bodyParser = require('body-parser');
const Chart = require('chart.js');
const chartjsNode = require('chartjs-node');
const palette = require('./palette');

const app = express();


function getColourScheme(length) {
  var _palette,
      colourScheme = [];

  _palette = palette.palette('tol-rainbow', length);

  if (length > colourScheme.length) {
    for (var i = 0; i < length; i++) {
      colourScheme.push(
        '#' + _palette[i]
      );
    }
  }

  return colourScheme;
}


// Parse any content type as JSON
app.use(bodyParser.json({
    type: "*/*"
}));


app.post('/', function (req, res) {
  var data = req.body;

  if ( !data.width || !data.height ) {
    res.status(400).send('Missing width and/or height');
    return;
  }

  if ( !data.options ) {
    res.status(400).send('Missing options');
    return;
  }

  // Fill the canvas with a white background. Otherwise it will render using a transparent background
  var plugins = {
    beforeDraw: function(chartInstance) {
      var ctx = chartInstance.chart.ctx;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, chartInstance.chart.width, chartInstance.chart.height);
    },
  };

  // Add a callback to draw values and percent on pie charts
  if ( data.options.type === 'pie' ) {
    plugins.afterDraw = function(chartInstance) {
      var ctx = chartInstance.chart.ctx;
      ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontFamily, 'normal', Chart.defaults.global.defaultFontFamily);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';

      chartInstance.data.datasets.forEach(function (dataset) {

        for (var i = 0; i < dataset.data.length; i++) {
          var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model,
            total = dataset._meta[Object.keys(dataset._meta)[0]].total,
            mid_radius = model.innerRadius + (model.outerRadius - model.innerRadius)/2,
            start_angle = model.startAngle,
            end_angle = model.endAngle,
            mid_angle = start_angle + (end_angle - start_angle)/2;

          var x = mid_radius * Math.cos(mid_angle);
          var y = mid_radius * Math.sin(mid_angle);

          ctx.fillStyle = '#fff';
          if (i == 3){ // Darker text color for lighter background
            ctx.fillStyle = '#444';
          }
          var percent = String(Math.round(dataset.data[i]/total*100)) + "%";
          ctx.fillText(dataset.data[i], model.x + x, model.y + y);
          // Display percent in another line, line break doesn't work for fillText
          ctx.fillText(percent, model.x + x, model.y + y + 15);
        }
      });
    };
  }

  // Add the plugins to options, so that the chart background is properly rendered
  data.options.plugins = plugins;

  var chartNode = new chartjsNode(data.width, data.height),
      colourScheme,
      i;

  // Populate datasets with random colours
  if ( (data.options.data.datasets.length > 1) || data.options.singleColor ) {
    // Multiple datasets
    // Each dataset will get its own colour
    colourScheme = getColourScheme(data.options.data.datasets.length);

    for (i = 0; i < data.options.data.datasets.length; i++) {
      var datasetColor= colourScheme[i];
      data.options.data.datasets[i].backgroundColor = [];

      for (var j = 0; j < data.options.data.datasets[i].data.length; j++) {
        data.options.data.datasets[i].backgroundColor.push(datasetColor);
      }
    }
  } else {
    // A single dataset
    // Each value in the dataset will get its own colour
    colourScheme = getColourScheme(data.options.data.labels.length);

    data.options.data.datasets[0].backgroundColor = [];
    for (i = 0; i < data.options.data.datasets[0].data.length; i++) {
      data.options.data.datasets[0].backgroundColor.push(colourScheme[i]);
    }
  }

  chartNode.drawChart(data.options).then(() => {
    // After creating chart, get image as png buffer
    return chartNode.getImageBuffer('image/png');
  }).then(buffer => {
    // Return the image buffer
    res.send(buffer);
    chartNode.destroy();
  });
});

app.listen(3000);

