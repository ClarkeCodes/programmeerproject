function colorMap(dataset){
    var worldmap = new Datamap({
        element: document.getElementById("mapcontainer"),
    fills: {
      // fill for countries without data
      defaultFill: '#e2e2e2'
    },
    data: dataset
    });
    return worldmap;
}

function makeLegend() {
    // create svg for legend
    var svg = d3.select(".datamap").append("svg")
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .attr("id", "legendContainer");

    legend = svg.selectAll("g.legend")
        .data(color_values)
        .enter().append("g")
        .attr("class", "legend");

    color_values.reverse();
    // add containers for legend
    legend.append("rect")
        .attr("x", 20)
        .attr("y", function(d, i) { return legendHeight - (i * r_height) - 2 * r_height; })
        .attr("width", r_width)
        .attr("height", r_height)
        .style("fill", function(d, i) { return colorScale(color_values[i]); })
        .style("opacity", 0.8);

    // add labels to legend
    legend.append("text")
        .attr("x", 45)
        .attr("y", function(d, i) { return legendHeight - (i * r_height) - r_height - 5; })
        .text(function(d, i) { return depressionLabels[i]; });

    // inital legend title
    legend.append("text")
        .attr("id", "legendTitle")
        .attr("x", 20)
        .attr("y", 290)
        .text("Depression");
}

// The table generation function
function makeTable(data, columns) {
    var table = d3.select("#tablecontainer").append("table")
        .attr("class", "table table-hover")
        .attr("id", "info_table"),
        thead = table.append("thead")
        .attr("class", "thead-inverse"),
        tbody = table.append("tbody");

    // append the header row
    thead.append("tr")
        .selectAll("th")
        .data(columns)
        .enter()
        .append("th")
        .text(function(column) { return column; });

    // create a row for each object in the data
    var rows = tbody.selectAll("tr")
        .data(data)
        .enter()
        .append("tr");

    // create a cell in each row for each column
    var cells = rows.selectAll("td")
        .data(function(row) {
            return columns.map(function(column) {
                return {
                    column: column,
                    value: row[column]
                };
            });
        })
        .enter()
        .append("td")
        .html(function(d) { return d.value; });

    return table;
}

// functions to toggle map updates
function updateMap(dataset) {
    if (dataset == "suicide") {
        worldmap.updateChoropleth(data_s);
        updateLegend("suicide");
    }
    else {
        worldmap.updateChoropleth(data_d);
        updateLegend("depression");
    }
}

function updateLegend(dataset) {
    // remove current legend labels and title
    d3.selectAll("g.legend text")
        .remove();
    d3.selectAll("#legendTitle")
        .remove();

    if (dataset == "suicide") {
        // add new labels to legend
        legend.append("text")
            .attr("x", 45)
            .attr("y", function(d, i) { return legendHeight - (i * r_height) - r_height - 5; })
            .text(function(d, i) { return suicideLabels[i]; });

        // add new legend title
        legend.append("text")
            .attr("id", "legendTitle")
            .attr("x", 10)
            .attr("y", 290)
            .text("Suicide");
    }
    else if (dataset == "depression") {
        // add new labels to legend
        legend.append("text")
            .attr("x", 45)
            .attr("y", function(d, i) { return legendHeight - (i * r_height) - r_height - 5; })
            .text(function(d, i) { return depressionLabels[i]; });

        // add new legend title
        legend.append("text")
            .attr("id", "legendTitle")
            .attr("x", 10)
            .attr("y", 290)
            .text("Depression");
    }
}


// function that lets users search for a country
// adapted from this example: http://www.w3schools.com/howto/howto_js_filter_table.asp
function searchTable() {
    // Declare variables
    var input, filter, table, tr, td, i;
    input = document.getElementById("tableInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("info_table");
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

function makeBarchart() {

    // set up margins, width and height for the barchart
    var margin = {top: 20, right: 20, bottom: 110, left: 50},
        width = 550 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // create svg with the specified size
    var svg = d3.select("#barcontainer").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("class", "barchart")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

}

var highlightLine;

function makeLinegraph() {

    // set up margins, width and height for svg
    var margin = {top: 40, right: 50, bottom: 80, left: 50},
        width = 850 - margin.left - margin.right,
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
        .orient("bottom").ticks(6);
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
    d3.csv("/data/prevalence_depression_1995-2015.csv", function(error, data) {
        if (error) throw error;

        data.forEach(function(d) {
            d.depression = +d.depression;
            // d.year = +d.year;
            d.year = parseDate(d.year);
            console.log(d.year);
        });

        console.log(data);

        // var focus = svg.append("g")
        //     .style("display", "none");

        // scale the range of the data
        x.domain(d3.extent(data, function(d) { return d.year; }));
        // x.domain(data.map(function(d) { return d.year; }));
        var minimum = d3.min(data, function(d) { return d.depression; });
        y.domain([minimum, d3.max(data, function(d) { return d.depression; }) ]);

        // Nest the entries by symbol
        var dataNest = d3.nest()
            // .key(function(d) {return d.year;})
            .key(function(d) {return d.country;})
            .entries(data);

        console.log(dataNest);

        // Loop through each symbol / key
        // dataNest.forEach(function(d) {
        //     svg.append("path")
        //         .attr("class", "line")
        //         .attr("id", d.key)
        //         .attr("d", valueline(d.values));
        // });
        // var focus = this;

        focus.legendtip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function (d) {
                return d.country ;
            });

        var countries = svg.selectAll(".country")
            .data(dataNest, function(d) { return d.key; })
           .enter().append("g")
            .attr("id", function(d) { return d.key; })
            // .attr("id", function(d) { return d.values["0"].continent; })
            .attr("class", "country");

        countries.append("path")
            .attr("id", function(d) {return d.values["0"].continent; })
            .attr("class", "line")
            // .attr("id", function(d) { return d.continent; })
            .attr("d", function(d) { return valueline(d.values); });

        // focus.svg.call(focus.legendtip);

        svg.selectAll(".line")
            .on("mouseover", function() {
                d3.select(this)
                    .attr("z-index", "100")
                    .style("stroke", "steelblue")
                    .style("stroke-width", "3px");
                    // .append("text")
                    // .attr("class", "country_name")
                    // .attr("dx", 8)
                    // .attr("dy", "-.3em")
                    // .text(function(d) { return d.country; });
                })
            .on("mouseout", function () {
                d3.select(this)
                    .style("stroke", "#eee")
                    .style("stroke-width", "1px"); });

        // Add the X Axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        // Add the Y Axis
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        highlightLine = function(continent) {
            var continent_path = "path#" + continent + ".line";
            console.log(continent_path);
            svg.selectAll(continent_path)
                .style("stroke", "red");

            console.log(test);
        };
    });
}

// // change graph to selected value (depression/suicide)
// window.lineSelect = function(d) {
//     highlightLine(d.value);
// };
