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
    .defer(d3.csv, "project/data/depression_both_2015.csv")
    .defer(d3.csv, "project/data/depression_female_2015.csv")
    .defer(d3.csv, "project/data/depression_male_2015.csv")
    .await(main);

var legend;

// all colors to be used for the data (source: http://colorbrewer2.org/)
var all_colors = ['#ffffb2', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#b10026'];
// var all_colors = ['#f1eef6','#d0d1e6','#a6bddb','#74a9cf','#3690c0','#0570b0','#034e7b'];
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


    both.forEach(function(d) {
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

    female.forEach(function(d) {
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

    male.forEach(function(d) {
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

    var ageNames = d3.keys(both[0]).filter(function(key) {
        return key !== "country";
    });
    console.log(ageNames);

    var i = 0;
    for (i; i < both.length; i++) {
        both[i].age10_19 = (both[i].age10_14 + both[i].age15_19) / 2;
        delete both[i].age10_14;
        delete both[i].age15_19;
        both[i].age20_29 = (both[i].age20_24 + both[i].age25_29) / 2;
        delete both[i].age20_24;
        delete both[i].age25_29;
        both[i].age30_39 = (both[i].age30_34 + both[i].age35_39) / 2;
        delete both[i].age30_34;
        delete both[i].age35_39;
        both[i].age40_49 = (both[i].age40_44 + both[i].age45_49) / 2;
        delete both[i].age40_44;
        delete both[i].age45_49;
        both[i].age50_59 = (both[i].age50_54 + both[i].age55_59) / 2;
        delete both[i].age50_54;
        delete both[i].age55_59;
        both[i].age60_69 = (both[i].age60_64 + both[i].age65_69) / 2;
        delete both[i].age60_64;
        delete both[i].age65_69;
        both[i].age70plus = (both[i].age70_74 + both[i].age75_79 + both[i].age80plus) / 3;
        delete both[i].age70_74;
        delete both[i].age75_79;
        delete both[i].age80plus;
        delete both[i].all;
        // d.age10_14 =+ d.age10_14;
        // d.age15_19 =+ d.age15_19;
        // }
    }

    i = 0;
    for (i; i < female.length; i++) {
        female[i].age10_19 = (female[i].age10_14 + female[i].age15_19) / 2;
        delete female[i].age10_14;
        delete female[i].age15_19;
        female[i].age20_29 = (female[i].age20_24 + female[i].age25_29) / 2;
        delete female[i].age20_24;
        delete female[i].age25_29;
        female[i].age30_39 = (female[i].age30_34 + female[i].age35_39) / 2;
        delete female[i].age30_34;
        delete female[i].age35_39;
        female[i].age40_49 = (female[i].age40_44 + female[i].age45_49) / 2;
        delete female[i].age40_44;
        delete female[i].age45_49;
        female[i].age50_59 = (female[i].age50_54 + female[i].age55_59) / 2;
        delete female[i].age50_54;
        delete female[i].age55_59;
        female[i].age60_69 = (female[i].age60_64 + female[i].age65_69) / 2;
        delete female[i].age60_64;
        delete female[i].age65_69;
        female[i].age70plus = (female[i].age70_74 + female[i].age75_79 + female[i].age80plus) / 3;
        delete female[i].age70_74;
        delete female[i].age75_79;
        delete female[i].age80plus;
        delete female[i].all;
        // d.age10_14 =+ d.age10_14;
        // d.age15_19 =+ d.age15_19;
        // }
    }

    i = 0;
    for (i; i < male.length; i++) {
        // for (j; j < ageNames.length; j++) {
        //     ageName = ageNames[j];
        male[i].age10_19 = (male[i].age10_14 + male[i].age15_19) / 2;
        delete male[i].age10_14;
        delete male[i].age15_19;
        male[i].age20_29 = (male[i].age20_24 + male[i].age25_29) / 2;
        delete male[i].age20_24;
        delete male[i].age25_29;
        male[i].age30_39 = (male[i].age30_34 + male[i].age35_39) / 2;
        delete male[i].age30_34;
        delete male[i].age35_39;
        male[i].age40_49 = (male[i].age40_44 + male[i].age45_49) / 2;
        delete male[i].age40_44;
        delete male[i].age45_49;
        male[i].age50_59 = (male[i].age50_54 + male[i].age55_59) / 2;
        delete male[i].age50_54;
        delete male[i].age55_59;
        male[i].age60_69 = (male[i].age60_64 + male[i].age65_69) / 2;
        delete male[i].age60_64;
        delete male[i].age65_69;
        male[i].age70plus = (male[i].age70_74 + male[i].age75_79 + male[i].age80plus) / 3;
        delete male[i].age70_74;
        delete male[i].age75_79;
        delete male[i].age80plus;
        delete male[i].all;
    }
    // console.log(both);

    dataBoth = both;
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

// http://ghdx.healthdata.org/gbd-results-tool?params=querytool-permalink/6a6d68f2958f34482c33ecd1f831e9e5
// http://ghdx.healthdata.org/gbd-results-tool?params=querytool-permalink/8cf6cac732db37277625c44b2da6b12d
// http://ghdx.healthdata.org/gbd-results-tool?params=querytool-permalink/ad846927870303fd5d05624bf298cfc9
// http://ghdx.healthdata.org/gbd-results-tool?params=querytool-permalink/260096cd8076654cce1354b8fddc7e12
