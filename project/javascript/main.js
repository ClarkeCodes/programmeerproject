// var q = d3_queue.queue();
// set up queue to load data
queue()
    .defer(d3.csv, "project/data/suicide_by_country.csv")
    .defer(d3.csv, "project/data/depression_2015.csv")
    .defer(d3.csv, "project/data/depression_both_2015.csv")
    .defer(d3.csv, "project/data/depression_female_2015.csv")
    .defer(d3.csv, "project/data/depression_male_2015.csv")
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

var dataBoth;
var dataFemale;
var dataMale;

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

var codes_reverse = {};
for (var i = 0; i < country_codes.length; i++) {
    codes_reverse[country_codes[i][1]] = country_codes[i][2];
}

function main(error, data, data2, both, female, male) {
    if (error) throw error;
    dataset = {};
    dataset2 = {};

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

    both.forEach(function(d) {
        d.age10_14 =+ d.age10_14;
        d.age15_19 =+ d.age15_19;
        d.age20_24 =+ d.age20_24;
        d.age25_29 =+ d.age25_29;
        d.age30_34 =+ d.age30_34;
        d.age35_39 =+ d.age35_39;
        d.age40_44 =+ d.age40_44;
        d.age45_49 =+ d.age45_49;
        d.age50_54 =+ d.age50_54;
        d.age55_59 =+ d.age55_59;
        d.age60_64 =+ d.age60_64;
        d.age65_69 =+ d.age65_69;
        d.age70_74 =+ d.age70_74;
        d.age75_79 =+ d.age75_79;
        d.age80plus =+ d.age80plus;
        d.all =+ d.all;
    });

    var ageNames = d3.keys(both[0]).filter(function(key) { return key !== "country"; });
    console.log(ageNames);

    var i = 0;
    var j;
    for (i; i < both.length; i++) {
        j = 0;
        // for (j; j < ageNames.length; j++) {
        //     ageName = ageNames[j];
        both[i].age10_19 = (both[i].age10_14 + both[i].age15_19)/2;
        delete both[i].age10_14;
        delete both[i].age15_19;
        both[i].age20_29 = (both[i].age20_24 + both[i].age25_29)/2;
        delete both[i].age20_24;
        delete both[i].age25_29;
        both[i].age30_39 = (both[i].age30_34 + both[i].age35_39)/2;
        delete both[i].age30_34;
        delete both[i].age35_39;
        both[i].age40_49 = (both[i].age40_44 + both[i].age45_49)/2;
        delete both[i].age40_44;
        delete both[i].age45_49;
        both[i].age50_59 = (both[i].age50_54 + both[i].age55_59)/2;
        delete both[i].age50_54;
        delete both[i].age55_59;
        both[i].age60_69 = (both[i].age60_64 + both[i].age65_69)/2;
        delete both[i].age60_64;
        delete both[i].age65_69;
        both[i].age70plus = (both[i].age70_74 + both[i].age75_79 + both[i].age80plus)/3;
        delete both[i].age70_74;
        delete both[i].age75_79;
        delete both[i].age80plus;
        delete both[i].all;
        // d.age10_14 =+ d.age10_14;
        // d.age15_19 =+ d.age15_19;
        // }
    }
    console.log(both);

    dataBoth = both;
    makeBarchart("Netherlands");
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

// change graph to selected value (depression/suicide)
window.lineSelect = function(d) {
    var button = document.getElementById('btn' + d.value);
    highlightLines(button, d.value);
};

// http://ghdx.healthdata.org/gbd-results-tool?params=querytool-permalink/6a6d68f2958f34482c33ecd1f831e9e5
// http://ghdx.healthdata.org/gbd-results-tool?params=querytool-permalink/8cf6cac732db37277625c44b2da6b12d
// http://ghdx.healthdata.org/gbd-results-tool?params=querytool-permalink/ad846927870303fd5d05624bf298cfc9
// http://ghdx.healthdata.org/gbd-results-tool?params=querytool-permalink/260096cd8076654cce1354b8fddc7e12
