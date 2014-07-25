Zatanna
======

Javascript functions that make it easier to build simple graphs with D3.

# Installation

Load jQuery, [D3](http://d3js.org/), and Zatanna's CSS and JS.
```
<script src="jquery-2.1.1.min.js" charset="utf-8"></script>
<script src="zatanna.js" charset="utf-8"></script>
<link href="zatanna.css" rel="stylesheet" type="text/css">
<script src="d3.v3.min.js" charset="utf-8"></script>
```

If you'll be making pie charts, you also should load [d3Pie](http://d3pie.org).
```
<script src="d3pie.min.js" charset="utf-8"></script>
```

# Usage

Currently, you can use Zatanna to create line charts and pie charts.

## Line Chart
Build a line chart using D3. (Based upon Michael Bostock's [line chart example](http://bl.ocks.org/mbostock/3883245).) 

Example:
```
d3LineChart("#chart", typed, "Keys Typed", {xAxisIsDates: true, yTicks: 7});
```

### Parameters
```
function d3LineChart(targetSelector, data, yAxisLabel, options)
```
 * targetSelector: String. The selector (#id or .class or combination) to put the SVG element in.
 * data: Array. The data array, see below for expected format.
 * yAxisLabel: String. Label for the yAxis. Optional, and can also be set to "".
 * options: hash. Optional hash of options. See below for accepted options.

### Data format
d3LineChart expects an array of hashes, with index "date" for the X axis, and "count" for the Y:w
xis.
```
var typed = [
  {"date":"2014-01-01","count":443},
  {"date":"2014-02-01","count":23},
  {"date":"2014-03-01","count":133},
  {"date":"2014-04-01","count":223},
  {"date":"2014-05-01","count":13}
];
```

### Options 
Shown as Option Name (default value).
 * margin_top (25), margin_right (20), margin_bottom (30), margin_left (60)
 * width (950)
 * height (400)
 * yTicks (10) Number of ticks to *try* to fit data to. Value is passed to d3's axis.ticks(); [documentation](https://github.com/mbostock/d3/wiki/SVG-Axes#wiki-ticks).
 * xGrid (true) Show light gray lines for each tick on the X axis.
 * yGrid (true) Show light gray lines for each tick on the Y axis.
 * labelDataPoints (true) Show the data value next to each point. (If you have dense data, you may want to turn this off.)
 * xAxisTicks (no default) Force ticks of a certain duration, eg 1 month, rather than daily. Must be passed as a hash with keys "interval" and "amount". e.g.: `{"interval": d3.time.month, "amount": 1}`


## Pie Chart
[d3Pie](http://d3pie.org) already makes it pretty easy to build a pie chart, and this function simplifies things a bit further.

```
var ages = {'18-29': 173, '30-49': 231, '50-64': 81, '65+': 0};
d3PieChart("#ages", ages, {title: "Age", width: 480, height: 300});
```

### Parameters
```
function d3PieChart(targetSelector, data, options)
```
 * targetSelector: String. The selector (#id or .class or combination) to put the SVG element in.
 * data: Array. The data array, see below for expected format.
 * options: hash. Optional hash of options. See below for accepted options.

### Data format
Will accept data in any of the following formats:
 * `{family: 213, roommates: 32, kids: 178, alone: 57 }`
 * `{'18-29': 173, '30-49': 231, '50-64': 81, '65+': 0}`
 * `{green: 10, yellow: 26, red: 33}` (You will probably want to include `"stoplight": "true"` in the options, too.)

### Options 
Shown as Option Name (default value).
 * width (320)
 * height (320)

Also note that you can add ANY option which d3Pie accepts, and it will be passed to the d3Pie call. (e.g.: `"size": { "pieInnerRadius": "90%"}`).

## Coming soon: Bar Charts
Soon!
### Data format
var votes_for_heroes = [{"x":"Superman", "count":9321}, {"x":"Captain America", "count":1942}, {"x":"Luke Skywalker", "count":1138}, {"x":"Master Chief", "count":343];
