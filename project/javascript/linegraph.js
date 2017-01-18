// set up margins, width and height for svg
var margin = {top: 40, right: 80, bottom: 80, left: 80},
    width = 750 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;

// Parse the date / time
var parseDate = d3.time.format("%Y").parse;

// set the ranges
var x = d3.time.scale()
    .range([0, width]);
var y = d3.scale.linear()
    .range([height, 0]);

// define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(4);
var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(10);

// create svg with the specified size
var svg = d3.select("#linecontainer")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("class", "linegraph")
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Define the line
var valueline = d3.svg.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.depression); });


// get data from csv file
d3.csv("data/prevalence_depression_1995-2015.csv", function(error, data) {
    if (error) throw error;
    var dataset = {};

    data.forEach(function(d) {
        d.depression = +d.depression;
        d.year = parseDate(d.year);
    });

    console.log(data);

    // Nest the entries by symbol
    var dataNest = d3.nest()
        .key(function(d) {return d.country;})
        .entries(data);

    // Loop through each symbol / key
    dataNest.forEach(function(d) {
        svg.append("path")
            .attr("class", "line")
            .attr("d", valueline(d.values));
    });

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

});
