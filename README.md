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
var typed = [{"date":"2014-01-01","count":43},{"date":"2014-01-02","count":23},{"date":"2014-01-03","count":133},{"date":"2014-01-04","count":223},{"date":"2014-01-05","count":13},{"date":"2014-01-09","count":235}];
d3LineChart("#chart", typed, "Keys Typed", {xAxisIsDates: true, yTicks: 7});
```

Produces:
![Line chart example](http://i.imgur.com/DV32CNk.png)

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

Example:
```
var ages = {'18-29': 173, '30-49': 231, '50-64': 81, '65+': 1};
d3PieChart("#ages", ages, {title: "Age", width: 480, height: 300});
```

Produces:

<img src="http://i.imgur.com/jzOPcCm.png" alt="Pie chart example" height=300 />


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



## Bar Charts
Build a bar chart using D3. (Based upon Michael Bostock's [bar chart example](http://bl.ocks.org/mbostock/3883245).) 

### Example
```
var votes = {"Superman":9321, "Captain America":1942, "Luke Skywalker":1138, "Master Chief":343};
d3BarChart("#heroes", votes_for_heroes , {title: "Votes", width: 480, height: 300});
```

Produces:
![LINE chart example](http://i.imgur.com/DV32CNk.png)

### Parameters
```
function d3BarChart(targetSelector, data, options)
```
 * targetSelector: String. The selector (#id or .class or combination) to put the SVG element in.
 * data: Array. The data array, see below for expected format.
 * options: hash. Optional hash of options. See below for accepted options.

### Data format
d3BarChart expects at minimum a hash, with each key being the label, and the value being the number to create a bar for.
```
var votes = {"Superman":9321, "Captain America":1942, "Luke Skywalker":1138, "Master Chief":343};
```

You can also overide the default bar color by turning the value into a hash, and providing the color and bar value in the inner hash:
```
var votes = [
  {
    "Superman": {
      "value": 9321, 
      "color": "red"
    }
  }, 
  //...
];
```

### Symbols for context
Support is also provided to show a left and/or right symbol, next to each bar. This allows you to provide context. (e.g.: Value last year, Recommendation, Typical, Average, etc)
```
var votes = {
  "Superman": {
    "value": 9321, 
    "leftSymbol": { 
      "value": 8324,
      "label": "Last year",
      "shape": "triangle"
    }
  },
  "Captain America": {
    "value": 1942,
    "leftSymbol": { 
      "value": 1948,
      "label": "Last year",
      "shape": "triangle"
    }
  },
  //...
};
```

And you can simplify that: instead of specifying the label and shape repeatedly, they can be provided in the `options` hash:
```
var votes = {
  "Superman": {
    "value": 9321, 
    "leftSymbol": { "value": 8324 }
  }, 
  "Captain America": {
    "value": 1942,
    "leftSymbol": { "value": 1948 }
  },
  //...
};
d3BarChart("#heroes", votes_for_heroes , {title: "Votes", width: 480, height: 300, "leftSymbol": { "label": "Last year", "shape": "triangle"} });
```




### Options 
Shown as Option Name (default value).
 * margin_top (20), margin_right (20), margin_bottom (30), margin_left (40)
 * width (950)
 * height (400)
 * yTicks (10) Number of ticks to *try* to fit data to. Value is passed to d3's axis.ticks(); [documentation](https://github.com/mbostock/d3/wiki/SVG-Axes#wiki-ticks).
 * yAxisTitle ("") Title to display on the y-axis.
 * defaultBarColor  ("steelblue") The default color for the bars.
 * leftSymbol Default options for the left symbols. Individual settings will override the defaults. Symbols are only shown if values are provided.
   * shape (triangle) Supported shapes are "triangle", "circle", "square", and "cross".
   * color (gray) Can be a named color or a hexcode.
   * width (8) Icons are essentially square, so width will also be height.
   * showLine (true) If true, draws a dashed line across the bar, at the height of the symbol. Helps make it easier to compare bar and symbol values.
 * rightSymbol Default options for the right symbols. Individual settings will override the defaults. Symbols are only shown if values are provided.
   * shape (circle) Supported shapes are "triangle", "circle", "square", and "cross".
   * color (gray) Can be a named color or a hexcode.
   * width (8) Icons are essentially square, so width will also be height.
   * showLine (true) If true, draws a dashed line across the bar, at the height of the symbol. Helps make it easier to compare bar and symbol values.
