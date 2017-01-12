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

// get data from csv file
d3.csv("data/suicide_by_country.csv", function(error, data) {
    if (error) throw error;
    var dataset = {};

    // set up dictionary with country per_thousands to codes
    var codes = {};
    for (var i = 0; i < country_codes.length; i++) {
        codes[country_codes[i][2]] = country_codes[i][1];
    }

    console.log(data);

    // create dataset in map format
    data.forEach(function(d) {

        d.female = +d.female;
        d.male = +d.male;
        d.suicide = +d.suicide;
        // console.log(d.country);// console.log(Country)
    });

    var worldmap = new Datamap({
      element: document.getElementById("mapcontainer")
    });

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
