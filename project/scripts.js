// set up margins, width and height for svg
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

// create svg with the specified size
var svg = d3.select("#linecontainer").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "barchart")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// all colors to be used for the data (source: http://colorbrewer2.org/)
var all_colors = ['#ffffb2','#fed976','#feb24c','#fd8d3c','#fc4e2a','#e31a1c','#b10026'];
var color_values = [3, 5, 7, 10, 15, 20, 20.1];
    // 44.6, 40.7, 36.7, 32.7, 28.7, 24.7, 20.8];

// get data from csv file
d3.csv("data/suicide_by_country.csv", function(error, data) {
    if (error) throw error;
    var dataset = {};

    // set up dictionary with country names to country codes
    var codes = {};
    for (var i = 0; i < country_codes.length; i++) {
        codes[country_codes[i][2]] = country_codes[i][1];
    }

    console.log(data);

    colorScale = d3.scale.quantile()
        .domain(color_values)
        .range(all_colors);

    // create dataset in map format
    data.forEach(function(d) {

        d.female = +d.female;
        d.male = +d.male;
        d.suicide = +d.suicide;
        var iso = codes[d.country];
        dataset[iso] = {
            suicide: d.suicide,
            male: d.male,
            female: d.female,
            fillColor: colorScale(d.suicide)
        };
    });

    var worldmap = new Datamap({
        element: document.getElementById("mapcontainer"),
    fills: {
      // fill for countries without data
      defaultFill: '#e2e2e2'
    },
    data: dataset
    });

    // set up attributes for legend
    var legendWidth = 110,
        legendHeight = 500;

    // create svg for legend
    var svg = d3.select(".datamap").append("svg")
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .attr("id", "legendContainer");

    var legend = svg.selectAll("g.legend")
        .data(color_values)
        .enter().append("g")
        .attr("class", "legend");

    // width and height for rects of legend
    var r_width = 20,
        r_height = 20;


    var legendLabels = ["< 3", "3 - 5", "5 - 7", "7 - 10", "10 - 15", "15 - 20", "> 20"];
    legendLabels.reverse();
    makeLegend();

    function makeLegend() {
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

    // render the table
    var table = makeTable(data, ["country", "suicide", "male", "female"]);

    // sort values in table by HPI
    table.selectAll("tbody tr")
        .sort(function(a, b) { return d3.descending(a.suicide, b.suicide); });

    // format table header
    table.selectAll("thead th")
        .text(function(column) { return column.charAt(0).toUpperCase() + column.substr(1); });

});

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
