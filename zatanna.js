/** 
 * Build a line chart using D3.
 * Example: d3LineChart("#enrolled", dataPeriod.enrollmentMonthly, "Users", {xAxisIsDates: true, yTicks: 7});
 * @param {string} targetSelector The selector (#id or .class or combination) to put the SVG element in.
 * @param {array} data The data array. See notes for accepted forms to the data.
 * @param {string} yAxisLabel Label for the yAxis. Can also be set to "".
 * @param {hash} options Hash of options. See notes for accepted options.
 */
function d3LineChart(targetSelector, data, yAxisLabel, options) {
  options = options || {};
  var margin = {top: options.margin_top || 25, right: options.margin_right || 20, bottom: options.margin_bottom || 30, left: options.margin_left || 60};
  var width = (options.width || 950) - margin.left - margin.right;
  var height = (options.height || 400) - margin.top - margin.bottom;
  var yTicks = options.yTicks || 10;

  var parseDate = d3.time.format("%Y-%m-%d").parse;

  data.forEach(function(d) {
    if(options.xAxisIsDates) d.date = parseDate(d.date);
    else                     d.x = +d.x;
    d.count = +d.count;
  });

  var x = d3.time.scale()
      .range([0, width]);

  var y = d3.scale.linear()
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");
  if(options.xAxisIsDates) 
      xAxis = xAxis.ticks(d3.time.month, 1);

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(yTicks);

  var line = d3.svg.line()
      .x(function(d) { return x(options.xAxisIsDates ? d.date : d.x); })
      .y(function(d) { return y(d.count); });

  var svg = d3.select(targetSelector).append("svg")
      .attr("class", "lineChart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  x.domain(d3.extent(data, function(d) { return (options.xAxisIsDates ? d.date : d.x); }));
  y.domain(d3.extent(data, function(d) { return d.count; }));

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(yAxisLabel);

  if(!options.noGridX || !options.noGridY) {
    var rules = svg.selectAll("g.rule")
      .data(x.ticks(10))
     .enter().append("svg:g")
       .attr("class", "rule");
  }

  if(!options.noGridX) {
   // Draw grid lines
   rules.append("svg:line")
    .attr("class", function(d) { return d ? null : "axis"; })
    .data(options.xAxisIsDates ? x.ticks(d3.time.month, 1) : x.ticks())
    .attr("x1", x)
    .attr("x2", x)
    .attr("y1", 0)
    .attr("y2", height - 1);
  }

  if(!options.noGridY) {
   rules.append("svg:line")
    .attr("class", function(d) { return d ? null : "axis"; })
    .data(y.ticks(yTicks))
    .attr("y1", y)
    .attr("y2", y)
    .attr("x1", 0)
    .attr("x2", width - 10);
  }

  svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);

  if(!options.doNotLabelDataPoints) {
    //show a dot at each datapoint
    svg.selectAll(".dataLabel")
        .data(data)
      .enter().append("text")
        .attr("class", "dataLabel")
        .text(function(d,i) { return (i>0 ? d.count : ""); })
        .attr("text-anchor", "middle")
        .attr("x", function(d) { return x(options.xAxisIsDates ? d.date : d.x); })
        .attr("y", function(d) { return y(d.count) - 9; });

    //show a dot at each datapoint
    svg.selectAll(".dot")
        .data(data)
      .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 3.5)
        .attr("cx", function(d) { return x(options.xAxisIsDates ? d.date : d.x); })
        .attr("cy", function(d) { return y(d.count); });
  }
} 



/**
 * Data is expected in one of these three formats: 
   {family: 213, roommates: 32, kids: 178, alone: 57 }
   {'18-29': 173, '30-49': 231, '50-64': 81, '65+': 0}
   {green: 10, yellow: 26, red: 33}
 */
/** 
 * Build a line chart using D3.
 * Example: d3PieChart("#ages", dataPeriod.users.ages, {title: "Age", width: 480, height: 300});
 * @param {string} targetSelector The selector (#id or .class or combination) to put the SVG element in.
 * @param {array} data The data array. See notes for accepted forms to the data.
 * @param {hash} options Hash of options. See notes for accepted options.
 */
function d3PieChart(targetSelector, data, options) {
  options = options || {};

  var stoplightColors = {green: "#6ABC22", yellow: "#FAD130", red: "#F7181B"};
  var colorSet = null;
  if(options.colors)
    colorSet = options.colors;
  else
    colorSet = ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"];

  var convertedData = Array(), colorCounter = 0;
  for(var i in data) {
    var item = {
      "label": i,
      "value": +data[i],
      "color": colorSet[colorCounter++]
    };

    //don't show a label
    if(options.stoplight && stoplightColors[i]) {
      item["color"] = stoplightColors[i];
      item["label"] = data[i];
    }

    convertedData.push(item);
 
    if(colorCounter > colorSet.length-1) colorCounter=0;
  }

  var settings = {
    "header": {
      "titleSubtitlePadding": 9,
      "location": "pie-center"
    },
    "size": {
      "canvasHeight": options.height || 320,
      "canvasWidth": options.width || 320,
      "pieInnerRadius": "70%",
      "pieOuterRadius": "100%"
    },
    "data": {
      "sortOrder": "value-desc",
      "content": convertedData
    },
    "labels": {
      "outer": {
        "pieDistance": 32
      },
      "inner": {
        "hideWhenLessThanPercentage": 3
      },
      "mainLabel": {
        "fontSize": 16
      },
      "percentage": {
        "color": "#ffffff",
        "fontSize": 12,
        "decimalPlaces": 0
      },
      "value": {
        "color": "#adadad",
        "fontSize": 11
      },
      "lines": {
        "enabled": true
      }
    },
    "effects": {
      "pullOutSegmentOnClick": {
        "effect": "linear",
        "speed": 400,
        "size": 8
      }
    },
    "misc": {
      "gradient": {
        "enabled": !options.stoplight,
        "percentage": 100
      }
    }
  };

  if(options.title) {
    settings["header"]["title"] = {
      "text": options.title,
      "fontSize": 24,
      "font": "open sans"
    };
  }

  if(options.subtitle) {
    settings["header"]["subtitle"] = {
      "text": options.subtitle,
      "color": "#999999",
      "fontSize": 14,
      "font": "open sans"
    };
  }

  if(options.footer) {
    settings["footer"] = {
      "text": options.footer,
      "color": "#999999",
      "fontSize": 10,
      "font": "open sans",
      "location": "bottom-left"
    };
  }

  //merge in other options to allow tweaking ANYTHING in the d3Pie call!
  jQuery.extend(true, settings, options);

  var pie = new d3pie(targetSelector, settings);
  return pie;
}