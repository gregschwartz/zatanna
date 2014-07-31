/**
 * Zatanna, a Javascript library, v1.0
 * @requires d3 v3.4.11 or later
 * @requires jQuery v2.1.1 or later
 *
 * Zatanna is a Javascript library that makes it easy to build graphs with
 * D3. It also simplifies using d3Pie.
 *
 * For usage and examples, visit:
 * https://github.com/zipongo/zatanna/
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright (c) 2014, Greg Schwartz at Zipongo, Inc.
 */


/** 
 * Build a line chart using D3.
 * @param {string} targetSelector The selector (#id or .class or combination) to put the SVG element in.
 * @param {array} data The data array. See notes for accepted forms to the data.
 * @param {string} yAxisLabel Label for the yAxis. Can also be set to "".
 * @param {hash} options Hash of options. See notes for accepted options.
 * Example: d3LineChart("#enrolled", dataPeriod.enrollmentMonthly, "Users", {xAxisIsDates: true, yTicks: 7});
 * Based upon Michael Bostock's line chart code, http://bl.ocks.org/mbostock/3883245
 */
function d3LineChart(targetSelector, data, yAxisLabel, options) {
  options = options || {};
  yAxisLabel = yAxisLabel || "";
  var margin = {top: options.margin_top || 25, right: options.margin_right || 20, bottom: options.margin_bottom || 30, left: options.margin_left || 60};
  var width = (options.width || 950) - margin.left - margin.right;
  var height = (options.height || 400) - margin.top - margin.bottom;
  var yTicks = options.yTicks || 10;
  var xGrid = (options.xGrid || true);
  var yGrid = (options.yGrid || true);
  var labelDataPoints = (options.labelDataPoints || true);

  //later this can be allowed to be off, and the function will be able to build scatter plots. But for now, we're only supporting dates.
  options.xAxisIsDates = true;

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
  if(options.xAxisTicks && options.xAxisTicks.interval && options.xAxisTicks.amount) 
      xAxis = xAxis.ticks(options.xAxisTicks.interval, options.xAxisTicks.amount);

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

  if(xGrid || yGrid) {
    var rules = svg.selectAll("g.rule")
      .data(x.ticks(10))
     .enter().append("svg:g")
       .attr("class", "rule");
  }

  if(xGrid) {
   // Draw grid lines
   rules.append("svg:line")
    .attr("class", function(d) { return d ? null : "axis"; })
    .data(options.xAxisTicks && options.xAxisTicks.interval && options.xAxisTicks.amount ? x.ticks(options.xAxisTicks.interval, options.xAxisTicks.amount) : x.ticks())
    .attr("x1", x)
    .attr("x2", x)
    .attr("y1", 0)
    .attr("y2", height - 1);
  }

  if(yGrid) {
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

  if(labelDataPoints) {
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
 * Build a pie chart using D3pie.
 * @param {string} targetSelector The selector (#id or .class or combination) to put the SVG element in.
 * @param {array} data The data array. See notes for accepted forms to the data.
 * @param {hash} options Hash of options. See notes for accepted options.
 * Example: d3PieChart("#ages", dataPeriod.users.ages, {title: "Age", width: 480, height: 300});
 * Data is expected in one of these three formats: 
 * {family: 213, roommates: 32, kids: 178, alone: 57 }
 * {'18-29': 173, '30-49': 231, '50-64': 81, '65+': 0}
 * {green: 10, yellow: 26, red: 33} (And then you probably want to include {"stoplight": "true"} in the options.)
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

/** 
 * Build a bar chart using D3.
 * @param {string} targetSelector The selector (#id or .class or combination) to put the SVG element in.
 * @param {array} data The data array. See notes for accepted forms to the data.
 * @param {hash} options Hash of options. See notes for accepted options.
 * Based upon Michael Bostock's bar chart code, http://bl.ocks.org/mbostock/3885304
 */
function d3BarChart(targetSelector, data, options) {
  options = options || {};
  var margin = {top: options.margin_top || 20, right: options.margin_right || 20, bottom: options.margin_bottom || 30, left: options.margin_left || 40};
  var width = (options.width || 950) - margin.left - margin.right;
  var height = (options.height || 400) - margin.top - margin.bottom;
  var yTicks = options.yTicks || 10;
  var defaultBarColor = options.defaultBarColor || "steelblue";

  //optional symbols
  var leftSymbol = {
    "shape": "triangle",
    "color": "gray",
    "showLine": true,
    "lineColor": "black",
    "width": 8
  };
  var rightSymbol = {
    "shape": "circle",
    "color": "gray",
    "showLine": true,
    "lineColor": "black",
    "width": leftSymbol.width //by default, same size
  };

  //convert the data to force it into the right format
  var convertedData = [];
  for(var i in data) {
    var item = {
      "label": i,
      "value": +data[i].value || +data[i],
      "color": data[i].color || defaultBarColor
    };

    //merge the symbol defaults with optional passed values
    if(data[i].leftSymbol && data[i].leftSymbol.value > 0) {
      item["leftSymbol"] = { "value": +data[i].leftSymbol.value };
      jQuery.extend(item["leftSymbol"], leftSymbol, options.leftSymbol);
    }
    if(data[i].rightSymbol && data[i].rightSymbol.value > 0) {
      item["rightSymbol"] = { "value": +data[i].rightSymbol.value };
      jQuery.extend(item["rightSymbol"], rightSymbol, options.rightSymbol);
    }

    convertedData.push(item);
  }

  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);

  var y = d3.scale.linear()
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(yTicks, yTicks);

  var svg = d3.select(targetSelector).append("svg")
      .attr("class", "barChart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  x.domain(convertedData.map(function(d) { return d.label; }));
  y.domain([0, d3.max(convertedData, function(d) { 
    //find the max of the value, and both symbol's values, if set
    var values = [d.value];
    if(d.leftSymbol) values.push(d.leftSymbol.value);
    if(d.rightSymbol) values.push(d.rightSymbol.value);
    return d3.max(values); 
  })]);

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
      .text(options.yAxisTitle || "");

  //bars
  svg.selectAll(".bar")
      .data(convertedData)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.label) + (d.leftSymbol ? d.leftSymbol.width -1 : 0); })
      .attr("width", function(d) { return x.rangeBand() - (d.leftSymbol ? d.leftSymbol.width : 0) - (d.rightSymbol ? d.rightSymbol.width : 0); })
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
      .style("fill", function(d) { return d.color; });

  //left symbols
  svg.selectAll(".symbol")
    .data(convertedData)
    .enter().append("path")
    .attr("transform", function(d) {if(d.leftSymbol) return "translate(" + x(d.label) + "," + y(d.leftSymbol.value) + ")" + (d.leftSymbol.shape=="triangle" ? "rotate(90)" : ""); })
    .attr("d", d3.svg.symbol()
      .size(function(d) { if(d.leftSymbol) return Math.pow(d.leftSymbol.width,2); })
      .type(function(d) { if(d.leftSymbol) { if(d.leftSymbol.shape=="triangle") return "triangle-up"; else return d.leftSymbol.shape; } })
    )
    .style("fill", function(d) { if(d.leftSymbol) return d.leftSymbol.color; });

  //left symbol labels
  svg.selectAll(".leftLabel")
    .data(convertedData)
    .enter().append("text")
      .attr("class", "symbolLabel")
      .attr("transform", function(d) {if(d.leftSymbol) return "translate(" + (x(d.label)-d.leftSymbol.width/2) + "," + (y(d.leftSymbol.value)+d.leftSymbol.width) + ") rotate(-90)"; })
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(function(d) { if(d.leftSymbol) return d.leftSymbol.label; });

  //left symbol lines
  svg.selectAll(".leftLines")
    .data(convertedData)
    .enter().append("line")
      .style("stroke-dasharray", ("3, 3"))
      .attr("stroke-width", function(d) { return (d.leftSymbol && d.leftSymbol.showLine ? 1 : 0); }) //if !showLine, line isn't visible
      .attr("stroke", function(d) { if(d.leftSymbol) return d.leftSymbol.lineColor; })
      .attr("x1", function(d) { if(d.leftSymbol) return x(d.label) + d.leftSymbol.width - 2; })
      .attr("y1", function(d) { if(d.leftSymbol) return y(d.leftSymbol.value); })
      .attr("x2", function(d) { if(d.leftSymbol) return x(d.label) + d.leftSymbol.width + x.rangeBand() - (d.rightSymbol ? d.rightSymbol.width : 0) - 2; })
      .attr("y2", function(d) { if(d.leftSymbol) return y(d.leftSymbol.value); });

  //right symbols
  svg.selectAll(".symbol")
    .data(convertedData)
    .enter().append("path")
    .attr("transform", function(d) {
      if(d.rightSymbol) 
        return "translate(" + (x(d.label)+x.rangeBand()-d.rightSymbol.width+4) + "," + y(d.rightSymbol.value) + ")" + (d.rightSymbol.shape=="triangle" ? "rotate(-90)" : "");
    })
    .attr("d", d3.svg.symbol()
      .size(function(d) { if(d.rightSymbol) return Math.pow(d.rightSymbol.width,2); })
      .type(function(d) { if(d.rightSymbol) { if(d.rightSymbol.shape=="triangle") return "triangle-up"; else return d.rightSymbol.shape; } })
    )
    .style("fill", function(d) { if(d.rightSymbol) return d.rightSymbol.color; });

  //right symbol labels
  svg.selectAll(".rightLabel")
    .data(convertedData)
    .enter().append("text")
      .attr("class", "symbolLabel")
      .attr("transform", function(d) {if(d.rightSymbol) return "translate(" + (x(d.label)+x.rangeBand()-d.rightSymbol.width+1) + "," + (y(d.rightSymbol.value)+d.rightSymbol.width) + ") rotate(-90)"; })
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(function(d) { if(d.rightSymbol) return d.rightSymbol.label; });

  //right symbol lines
  svg.selectAll(".rightLines")
    .data(convertedData)
    .enter().append("line")
      .style("stroke-dasharray", ("3, 3"))
      .attr("stroke-width", function(d) { return (d.rightSymbol && d.rightSymbol.showLine ? 1 : 0); }) //if !showLine, line isn't visible
      .attr("stroke", function(d) { if(d.rightSymbol) return d.rightSymbol.lineColor; })
      .attr("x1", function(d) { if(d.rightSymbol) return x(d.label) + (d.leftSymbol ? d.leftSymbol.width + 1 : 0); })
      .attr("y1", function(d) { if(d.rightSymbol) return y(d.rightSymbol.value); })
      .attr("x2", function(d) { if(d.rightSymbol) return x(d.label) + (d.leftSymbol ? d.leftSymbol.width : 0) + x.rangeBand() - (d.rightSymbol ? d.rightSymbol.width : 0); })
      .attr("y2", function(d) { if(d.rightSymbol) return y(d.rightSymbol.value); });
}
