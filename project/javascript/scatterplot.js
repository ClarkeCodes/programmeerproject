/**
 * d3linkedViews.js
 *
 * Eline Jacobse
 * Data Processing
 * Student.nr: 11136235
 *
 */

// set up margins, width and height for the scatterplot svg
var margin = {
        top: 10,
        right: 20,
        bottom: 110,
        left: 50
    },
    width = 600 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;

// create svg for the scatterplot
var scatterplot = d3.select("#plotcontainer").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "scatterplot")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// all colors to be used for the data (source: http://colorbrewer2.org/)
var all_colors = ["#d73027", "#f46d43", "#fdae61", "#fee090", "#ffffbf", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4"];
var color_values = [44.6, 40.7, 36.7, 32.7, 28.7, 24.7, 20.8, 16.8, 16.7];

// color values to be used for dropown menu
var new_values = [5, 10, 15, 20, 25, 30, 35, 40, 45];
var colorScale;

// get data from csv file
d3.csv("data.csv", function(error, data) {
    if (error) throw error;
    var dataset = {};

    // set up dictionary with country per_thousands to codes
    var codes = {};
    for (var i = 0; i < country_codes.length; i++) {
        codes[country_codes[i][2]] = country_codes[i][1];
    }

    colorScale = d3.scale.quantile()
        .domain(color_values)
        .range(all_colors);

    makeScatterPlot();

    function makeScatterPlot() {
        var xScale = d3.scale.linear()
            .domain([
                d3.min([0, d3.min(data, function(d) { return d.wellbeing; })]),
                d3.max([0, d3.max(data, function(d) { return d.wellbeing; })])])
            .range([0, width]);

        var yScale = d3.scale.linear()
            .domain([
                d3.min([0, d3.min(data, function(d) { return d.happy_years; })]),
                d3.max([0, d3.max(data, function(d) { return d.happy_years; })])])
            .range([height, 0]);

        // set up x and y axis
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .ticks(10)
            .orient('bottom');
        var yAxis = d3.svg.axis()
            .scale(yScale)
            .ticks(10)
            .orient('left');

        // add circles to scatterplot
        var circles = scatterplot.selectAll('circle')
            .data(data)
            .enter()
           .append('circle')
            .attr('cx', function(d) { return xScale(d.wellbeing); })
            .attr('cy', function(d) { return yScale(d.happy_years);})
            .attr('r', '5')
            .attr('stroke', 'black')
            .attr('stroke-width', 0.8)
            .attr('id', function(d) { return codes[d.country]; })
            .attr('fill', function(d) { return colorScale(d.hpi); })
            .on('mouseover', function() {
                // make circles big on mouseover
                d3.select(this)
                    .attr('r', 10)
                    .attr('stroke-width', 2);

                // highlight country and table row
                // var country_code = d3.select(this).attr('id');
                // highlightCountry(country_code);
                // highlightTable(country_code);
            })
            .on('mouseout', function() {
                // make circle small again
                d3.select(this)
                    .transition()
                    .duration(100)
                    .attr('r', 5)
                    .attr('stroke-width', 0.5);

                // undo higlhight on map and table
                // var country_code = d3.select(this).attr('id');
                // revertCountry(country_code);
                // revertTable(country_code);
            });

        // create x-axis
        scatterplot.append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis)
            .append('text')
            .attr('class', 'label')
            .attr('y', -10)
            .attr('x', width)
            .attr('dy', '.71em')
            .style('text-anchor', 'end')
            .text('Wellbeing (1 - 10)');

        // create y-axis
        scatterplot.append('g')
            .attr('class', 'axis')
            .call(yAxis)
            .append('text')
            .attr('class', 'label')
            .attr('transform', 'rotate(-90)')
            .attr('x', 0)
            .attr('y', 5)
            .attr('dy', '.71em')
            .style('text-anchor', 'end')
            .text('Happy Life Years');
    }
});
