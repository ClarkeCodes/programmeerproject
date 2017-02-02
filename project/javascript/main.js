/**
 * main.js
 *
 * Eline Jacobse
 * Programmeerproject
 * Student: 11136235
 *
 */

// set up queue to load data
queue()
    .defer(d3.csv, "project/data/suicide_by_country.csv")
    .defer(d3.csv, "project/data/depression_2015.csv")
    .defer(d3.csv, "project/data/depression_female_2015.csv")
    .defer(d3.csv, "project/data/depression_male_2015.csv")
    .await(main);

// all colors to be used for the data (source: http://colorbrewer2.org/)
var all_colors = ['#c6dbef','#9ecae1','#6baed6','#4292c6','#2171b5','#08519c','#08306b'];
var color_values = [3, 5, 7, 10, 15, 20, 20.1];
var color_values2 = [3.5, 4, 4.5, 5, 5.5, 6, 6.5];

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

function main(error, data, data2, female, male) {
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
        data_s[iso] = {
            fillColor: colorScale(d.suicide)
        };
    });

    depression_data.forEach(function(d) {
        var iso = codes[d.country];
        data_d[iso] = {
            fillColor: colorScale2(d.depression)
        };
    });

    // create map, legend and table
    worldmap = colorMap(dataset2);
    makeLegend();

    barData(female);
    barData(male);

    dataFemale = female;
    dataMale = male;

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

// function that enables smooth scrolling when clicking on links
// source: http://stackoverflow.com/questions/7717527/smooth-scrolling-when-clicking-an-anchor-link
var $root = $('html, body');
$('a').click(function() {
    console.log(this);
    console.log($.attr(this, 'href'));
    if ($.attr(this, 'href') == "#section2") {
        $root.animate({
            scrollTop: $("#linegraph_title").offset().top - 50
        }, 1000);
    }
    else {
        $root.animate({
            scrollTop: $( $.attr(this, 'href') ).offset().top - 140
        }, 800);
    }
    return false;
});

function barData (dataset) {
    dataset.forEach(function(d) {
        d.age10_14 = +d.age10_14;
        d.age15_19 = +d.age15_19;
        d.age20_24 = +d.age20_24;
        d.age25_29 = +d.age25_29;
        d.age30_34 = +d.age30_34;
        d.age35_39 = +d.age35_39;
        d.age40_44 = +d.age40_44;
        d.age45_49 = +d.age45_49;
        d.age50_54 = +d.age50_54;
        d.age55_59 = +d.age55_59;
        d.age60_64 = +d.age60_64;
        d.age65_69 = +d.age65_69;
        d.age70_74 = +d.age70_74;
        d.age75_79 = +d.age75_79;
        d.age80plus = +d.age80plus;
        d.all = +d.all;
    });
    formatBarData(dataset);
}

function formatBarData(dataset) {
    var i = 0;
    for (i; i < dataset.length; i++) {
        dataset[i].age10_19 = (dataset[i].age10_14 + dataset[i].age15_19) / 2;
        delete dataset[i].age10_14;
        delete dataset[i].age15_19;
        dataset[i].age20_29 = (dataset[i].age20_24 + dataset[i].age25_29) / 2;
        delete dataset[i].age20_24;
        delete dataset[i].age25_29;
        dataset[i].age30_39 = (dataset[i].age30_34 + dataset[i].age35_39) / 2;
        delete dataset[i].age30_34;
        delete dataset[i].age35_39;
        dataset[i].age40_49 = (dataset[i].age40_44 + dataset[i].age45_49) / 2;
        delete dataset[i].age40_44;
        delete dataset[i].age45_49;
        dataset[i].age50_59 = (dataset[i].age50_54 + dataset[i].age55_59) / 2;
        delete dataset[i].age50_54;
        delete dataset[i].age55_59;
        dataset[i].age60_69 = (dataset[i].age60_64 + dataset[i].age65_69) / 2;
        delete dataset[i].age60_64;
        delete dataset[i].age65_69;
        dataset[i].age70plus = (dataset[i].age70_74 + dataset[i].age75_79 + dataset[i].age80plus) / 3;
        delete dataset[i].age70_74;
        delete dataset[i].age75_79;
        delete dataset[i].age80plus;
        delete dataset[i].all;
    }
    return dataset;
}

// http://ghdx.healthdata.org/gbd-results-tool?params=querytool-permalink/260096cd8076654cce1354b8fddc7e12
