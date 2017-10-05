const express = require('express');
const bodyParser = require('body-parser');
const chartjsNode = require('chartjs-node');
const app = express();

// Parse any content type as JSON
app.use(bodyParser.json({
    type: "*/*"
}));

app.post('/', function (req, res) {
  var data = req.body;

  if ( !data.width || !data.height ) {
    res.status(400).send('Missing width and/or height');
    return
  }

  if ( !data.options ) {
    res.status(400).send('Missing options');
    return
  }

  // Fill the canvas with a white background. Otherwise it will render using a transparent background
  var plugins = {
    beforeDraw: function(chartInstance) {
      var ctx = chartInstance.chart.ctx;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, chartInstance.chart.width, chartInstance.chart.height);
    }
  };

  // Add the plugins to options, so that the chart background is properly rendered
  data.options.plugins = plugins;

  var chartNode = new chartjsNode(data.width, data.height);

  chartNode.drawChart(data.options).then(() => {
    // After creating chart, get image as png buffer
    return chartNode.getImageBuffer('image/png');
  }).then(buffer => {
    // Return the image buffer
    res.send(buffer)
  });
})

app.listen(3000);

