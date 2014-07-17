zatana
======

Javascript functions that make it easier to build simple graphs with D3.

*Line Chart*

 * Build a line chart using D3.
 * Example: d3LineChart("#enrolled", dataPeriod.enrollmentMonthly, "Users", {xAxisIsDates: true, yTicks: 7});
 * @param {string} targetSelector The selector (#id or .class or combination) to put the SVG element in.
 * @param {array} data The data array. See notes for accepted forms to the data.
 * @param {string} yAxisLabel Label for the yAxis. Can also be set to "".
 * @param {hash} options Hash of options. See notes for accepted options.

