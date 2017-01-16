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

    var legend = svg.selectAll("g.legend")
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
        .text(function(d, i) { return legendLabels[i]; });

    return legend;

    // // inital legend title
    // svg.append("text")
    //     .attr("id", "legendTitle")
    //     .attr("x", 20)
    //     .attr("y", 290)
    //     .text("Suicide");
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
function updateMap() {
    // create dataset in map format
    var new_data = {};
    suicide_data.forEach(function(d) {
        var iso = codes[d.country];
        new_data[iso] = { fillColor: colorScale(d.suicide) };
    });

    // update map colors
    console.log("updateMap");
    console.log(new_data);
    worldmap.updateChoropleth(new_data);
    // updateLegend();
    // updateTable();
    // updateCircles();
}

function revertMap() {
    // create dataset in map format
    var new_data = {};
    depression_data.forEach(function(d) {
        var iso = codes[d.country];
        new_data[iso] = { fillColor: colorScale2(d.depression) };
    });

    // change values back
    console.log("revertMap");
    console.log(new_data);
    worldmap.updateChoropleth(new_data);
    // revertLegend();
    // revertTable();
    // revertCircles();
}

function updateLegend() {
    // remove current legend labels and title
    d3.selectAll("g.legend text")
        .remove();
    // d3.selectAll("#legendTitle")
    //     .remove();

    var newLabels = ["45+", "40 - 45", "35 - 40", "30 - 35", "25 - 30", "20 - 25", "15 - 20", "10 - 15", "<10"];
    newLabels.reverse();

    // add new labels to legend
    legend.append("text")
        .attr("x", 45)
        .attr("y", function(d, i) { return legendHeight - (i * r_height) - r_height - 5; })
        .text(function(d, i) { return newLabels[i]; });

    // add new legend title
    svg.append("text")
        .attr("id", "legendTitle")
        .attr("x", 10)
        .attr("y", 290)
        .text("Happy Years");
}

function revertLegend() {
    // remove current labels and title
    d3.selectAll("g.legend text")
        .remove();
    d3.selectAll("#legendTitle")
        .remove();

    // add new labels to legend
    legend.append("text")
        .attr("x", 45)
        .attr("y", function(d, i) { return legendHeight - (i * r_height) - r_height - 5; })
        .text(function(d, i) { return legendLabels[i]; });

    // add new legend title
    svg.append("text")
        .attr("id", "legendTitle")
        .attr("x", 20)
        .attr("y", 290)
        .text("HPI");
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

// function dutchMap() {
//     var map = new Datamap({
//         element: document.getElementById('nl_container'),
//         geographyConfig: {
//             dataUrl: 'javascript/gemeentes.topojson'
//         },
//     });
// }
