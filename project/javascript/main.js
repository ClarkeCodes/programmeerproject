// set up queue to load data
queue()
    .defer(d3.csv, "/data/suicide_by_country.csv")
    .defer(d3.csv, "/data/depression_2015.csv")
    .await(main);

var legend;



// create svg with the specified size
// var svg = d3.select("#linecontainer").append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//     .attr("class", "barchart")
//     .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// all colors to be used for the data (source: http://colorbrewer2.org/)
var all_colors = ['#ffffb2','#fed976','#feb24c','#fd8d3c','#fc4e2a','#e31a1c','#b10026'];
var color_values = [3, 5, 7, 10, 15, 20, 20.1];
var color_values2 = [3.5, 4, 4.5, 5, 5.5, 6, 6.5];

// set up attributes for legend
var legendWidth = 110,
    legendHeight = 500;

// width and height for rects of legend
var r_width = 20,
    r_height = 20;

var suicideLabels = ["< 3", "3 - 5", "5 - 7", "7 - 10", "10 - 15", "15 - 20", "> 20"];
suicideLabels.reverse();
var depressionLabels = ["< 3.5", "3.5 - 4", "4 - 4.5", "4.5 - 5", "5 - 5.5", "5.5 - 6", "6.5 >"];
depressionLabels.reverse();

var dataset;
var dataset2;
var worldmap;
var suicide_data;
var depression_data;

// datasets in map format
var data_s = {},
    data_d = {};

colorScale = d3.scale.quantile()
    .domain(color_values)
    .range(all_colors);

colorScale2 = d3.scale.quantile()
    .domain(color_values2)
    .range(all_colors);

// set up dictionary with country names to country codes
var codes = {};
for (var i = 0; i < country_codes.length; i++) {
    codes[country_codes[i][2]] = country_codes[i][1];
}

function main(error, data, data2) {
    if (error) throw error;
    dataset = {};
    dataset2 = {};

    var dutchmap = new Datamap({
        element: document.getElementById('nl_container'),
        scope: "gemeentes",
        geographyConfig: {
            dataUrl: "/javascript/gemeentes.topojson"
        },
        fills: {
          // fill for countries without data
          defaultFill: '#9ebcda'
        },
        setProjection: function(element) {
            var projection = d3.geo.mercator()
                .scale(6500)
                .center([0, 53])
                .rotate([-5.5, 0.75])
                .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
            var path = d3.geo.path()
                .projection(projection);

            return {path: path, projection: projection};
        },
    });


    depression_data = data2;
    suicide_data = data;

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

    data2.forEach(function(d) {
        d.depression = +d.depression * 100;
        d.year = +d.year;
        var iso = codes[d.country];
        dataset2[iso] = {
            depression: d.depression,
            fillColor: colorScale2(d.depression)
        };
    });

    // datasets for the colorscale
    suicide_data.forEach(function(d) {
        var iso = codes[d.country];
        data_s[iso] = { fillColor: colorScale(d.suicide) };
    });

    depression_data.forEach(function(d) {
        var iso = codes[d.country];
        data_d[iso] = { fillColor: colorScale2(d.depression) };
    });


    // create map, legend and table
    worldmap = colorMap(dataset2);
    makeLegend();
    var table = makeTable(data, ["country", "suicide", "male", "female"]);

    // sort values in table by suicide
    table.selectAll("tbody tr")
        .sort(function(a, b) { return d3.descending(a.suicide, b.suicide); });
    // format table header
    table.selectAll("thead th")
        .text(function(column) { return column.charAt(0).toUpperCase() + column.substr(1); });

    makeBarchart();
    makeLinegraph();

}

// change graph to selected value (depression/suicide)
window.toggle = function(d) {
    if (d.value == "suicide") {
        updateMap("suicide");
    } else if (d.value == "depression") {
        updateMap("depression");
    }
};

// http://ghdx.healthdata.org/gbd-results-tool?params=querytool-permalink/6a6d68f2958f34482c33ecd1f831e9e5
// http://ghdx.healthdata.org/gbd-results-tool?params=querytool-permalink/8cf6cac732db37277625c44b2da6b12d
// http://ghdx.healthdata.org/gbd-results-tool?params=querytool-permalink/ad846927870303fd5d05624bf298cfc9