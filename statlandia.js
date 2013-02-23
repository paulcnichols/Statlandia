var express = require('express');
var app = express();

/*
 Time series - teleported goats per second.
*/

var time_series = [];
var time_series_total = 0;
var time_series_max = 0;
var time_series_min = 1000;
for (var i=0; i < 60; ++i) {
  time_series[i] = {
    'large' : 0,
    'medium' : 0,
    'small' : 0,
    'time' : 0
  };
}
var pie_chart = {
  'large' : 0,
  'medium' : 0,
  'small' : 0,
}

app.get('/data/time_series', function(req, res) {
  var t = (Math.round((new Date()).getTime() / 1000) + 1) % time_series.length;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({
    'name' : 'time_series', 
    'xaxis' : 'Seconds',
    'yaxis' : 'Teleported Goats',
    'desc' : 'Real time counter of teleported goats per second.',
    'data': time_series.slice(t, time_series.length).concat(time_series.slice(0, t)).reverse()}));
});

app.get('/data/pie_chart', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({
    'name' : 'pie_chart',
    'desc' : 'Breakdown of Teleported Goats by Size',
    'data' : pie_chart
  }));
});

/*
 Update data - update 4 times per second.
*/
setInterval(function () {
  var t  = Math.round((new Date()).getTime() / 1000) 
  var t0 = t % time_series.length;
  var t1 = (t0 + 1) % time_series.length;
  var l = Math.ceil(Math.random()*25), 
      m = Math.ceil(Math.random()*75),
      s = Math.ceil(Math.random()*40),
      n = l + m + s;
  time_series_total += n;
  time_series[t0].large += l;
  time_series[t0].medium += m;
  time_series[t0].small += s;
  time_series[t0].time = t;
  time_series[t1].large = 0;
  time_series[t1].medium = 0;
  time_series[t1].small = 0;
  time_series[t1].time = 0;
  pie_chart.large += l;
  pie_chart.medium += m;
  pie_chart.small += s;
}, 250);

/*
 Add required resources to the public director.
*/
app.use(express.static(__dirname + '/public'));
app.listen(8000);
