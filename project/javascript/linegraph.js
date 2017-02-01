/**
 * linegraph.js
 *
 * Eline Jacobse
 * Programmeerproject
 * Student: 11136235
 *
 */


var highlightLines;
var highlightLine;
var revertLine;

var continentColors = {
    Europe: '#ED7C31',
    EastAsia: '#00BBD6',
    SouthAsia: '#6E9E75',
    NorthAfrica: '#E25f82',
    SubSaharan: '#895881',
    LatinAmerica: '#82A5C0',
    NorthAmerica: '#BE1932'
};





function makeLinegraph() {
    // set up margins, width and height for svg
    var margin = {
            top: 40,
            right: 100,
            bottom: 80,
            left: 50
        },
        width = 600 - margin.left - margin.right,
        height = 650 - margin.top - margin.bottom;

    // create svg with the specified size
    var svg = d3.select("#linecontainer")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("class", "linegraph")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Parse the date / time
    var parseDate = d3.time.format("%Y").parse;

    // set the ranges
    var x = d3.time.scale()
        .range([0, width]);
    var y = d3.scale.linear()
        .range([height, 0]);

    // define the axes
    var xAxis = d3.svg.axis().scale(x)
        .orient("bottom").ticks(6);
    var yAxis = d3.svg.axis().scale(y)
        .orient("left").ticks(10);

    // Define the line
    var valueline = d3.svg.line()
        .x(function(d) { return x(d.year); })
        .y(function(d) { return y(d.depression); });

    // get data from csv file
    d3.csv("project/data/prevalence_depression_1995-2015.csv", function(error, data) {
        if (error) throw error;

        data.forEach(function(d) {
            d.depression = +d.depression;
            d.year = parseDate(d.year);
        });

        var focus = svg.append("g")
            .attr('class', 'focus')
            .style("visibility", "hidden");

        // add text placeholders for date and temperatures
        focus.append("text")
            .attr("class", "countryName")
            .attr("dx", 8)
            .attr("dy", "-.3em");

        var selected = svg.append("g")
            .attr('class', 'focus')
            .style("visibility", "hidden");

        selected.append("text")
            .attr("class", "selected")
            .attr("dx", 8)
            .attr("dy", "-.3em");

        // scale the range of the data
        x.domain(d3.extent(data, function(d) { return d.year; }));
        var minimum = d3.min(data, function(d) { return d.depression; });
        y.domain([minimum, d3.max(data, function(d) { return d.depression; })]);

        // Nest the entries by symbol
        var dataNest = d3.nest()
            .key(function(d) { return d.country; })
            .entries(data);

        var countries = svg.selectAll(".country")
            .data(dataNest, function(d) { return d.key; })
            .enter().append("g")
            .attr("class", "country");

        countries.append("path")
            .attr("id", function(d) { return d.values["0"].continent; })
            .attr("class", function(d) {
                var lineClass = "line " + codes[d.key];
                return lineClass;
            })
            .attr("d", function(d) { return valueline(d.values); });

        var lineColor;

        svg.selectAll(".line")
            .on("mouseover", function(d) {
                var country = d3.select(this)[0][0].classList[1];
                // console.log(country);
                // var selector = '.datamaps-subunit.' + country;
                // console.log(selector);
                // d3.selectAll(selector)
                //     .style("fill", "black");

                var thisHeight = y(d.values[4].depression);
                // add text to be displayed when moving cursor over graph
                focus.select("text.countryName")
                    .attr("transform", "translate(" + (width - 5) + "," + (thisHeight + 5) + ")")
                    .text(d.key);

                d3.selectAll('.focus')
                    .style("visibility", "visible");

                d3.select(this)
                    .classed("hovered", true);

            })
            .on("mouseout", function() {
                // var country = d3.select(this)[0][0].classList[1];
                d3.selectAll('.focus')
                    .style("visibility", "hidden");

                d3.select(this)
                    .classed("hovered", false);

            })
            .on("click", function(d) {
                var country = d3.select(this)[0][0].classList[1];
                country = codes_reverse[country];
                updateBarchart(country);

                d3.selectAll('.selected')
                    .style("visibility", "hidden");

                var thisHeight = y(d.values[4].depression);
                // add text to be displayed next to graph
                selected.select("text.selected")
                    .attr("transform", "translate(" + (width - 5) + "," + (thisHeight + 5) + ")")
                    .text(d.key);
                d3.selectAll('.selected')
                    .style("visibility", "visible");

                var selector = '.line.' + d3.select(this)[0][0].classList[1];
                highlightLine(selector);

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


        highlightLines = function(button, continent) {
            var continent_path = "path#" + continent + ".line";
            var selector = '#btn' + continent;

            // highlight lines of continent
            d3.selectAll(continent_path)
                .classed(continent, function (d, i) {
                    return !d3.select(this).classed(continent);
                });

            // change buton color
            d3.selectAll(selector)
                .classed('clicked', function (d, i) {
                    return !d3.select(this).classed('clicked');
                });
        };
        highlightLine = function(selector) {
            d3.select('.line.clicked')
                .classed("clicked", false);
            var line = d3.select(selector)
                .classed("clicked", true);

        };
        revertLine = function() {
            svg.selectAll('.line')
                .style("stroke-width", "1px")
                .style("stroke", '#eee');
        };
    });
}
