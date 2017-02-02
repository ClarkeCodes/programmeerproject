/**
 * barchart.js
 *
 * Eline Jacobse
 * Programmeerproject
 * Student: 11136235
 *
 */

 var index;
 var ageNames;
 var dataset;
 var updateBarchart;

// function to color the bar of the grouped bar chart
var color = function(gender) {
    if (gender == "Female") {
        return "#e1b59e";
    } else {
        return '#9ecae1';
    }
};

// create ticks for the x-axis
var all_ages = ["10 - 19", "20 - 29", "30 - 39", "40 - 49",
    "50 - 59", "60 - 69", "70+"];
var formatTick = function(d, i) {
    return all_ages[i];
};

// set up margins, width and height for the barchart
var margin = {
        top: 50,
        right: 20,
        bottom: 110,
        left: 100
    },
    width = 700 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;

// create svg with the specified size
var barSvg = d3.select("#barcontainer").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "barchart")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// set up scale for x and y-axis
var x0 = d3.scale.ordinal()
    .rangeRoundBands([0, width], 0.1);

var x1 = d3.scale.ordinal();
var y = d3.scale.linear()
    .range([height, 0]);

// set up axes
var xAxis = d3.svg.axis()
    .scale(x0)
    .orient("bottom")
    .tickFormat(formatTick);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

// set up tooltip for numbers
var tip = d3.tip()
    .attr("class", "d3-tip")
    .html(function(d) {
        return d3.format(",")(d.rate.toFixed(1));
    });

function makeBarchart(countryName) {
    dataset = formatData(countryName);
    var genders = dataset[0].depression.map(function(d) { return d.gender; });

    // domains for grouped bar chart
    x0.domain(ageNames);
    x1.domain(genders)
        .rangeRoundBands([0, x0.rangeBand()]);
    y.domain([0, d3.max(dataset, function(age) {
        return d3.max(age.depression, function(d) { return d.rate + 500; });
    })]);

    // create x-axis
    barSvg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-45)");

    // create y-axis
    barSvg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Depression per 100,000");

    // call tooltip
    barSvg.call(tip);

    // select each bar group
    var bar = barSvg.selectAll(".bar")
        .data(dataset)
        .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) { return "translate(" + x0(d.age) + ",0)"; });

    // create the bars of the bar chars
    bar.selectAll("rect")
        .data(function(d) { return d.depression; })
        .enter().append("rect")
        .attr("width", x1.rangeBand())
        .attr("x", function(d) { return x1(d.gender); })
        .style("fill", function(d) { return color(d.gender);})
        .attr("y", function(d) { return y(0); })
        .attr("height", function(d) { return height - y(0); })
        .on("mouseover", function(d) {
            var thisHeight = y(d.rate);
            tip.show(d, y(0));
            d3.select(this).style("fill", d3.rgb(color(d.gender)).darker(2));
        })
        .on("mouseout", function(d) {
            tip.hide(d, y(0));
            d3.select(this).style("fill", color(d.gender));
        });

    // add animation to bars being drawn
    bar.selectAll("rect")
        .transition()
        .delay(function(d) { return Math.random() * 1000; })
        .duration(1000)
        .attr("y", function(d) { return y(d.rate); })
        .attr("height", function(d) { return height - y(d.rate); });

    // add title to barchart
    barSvg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .attr("class", "barTitle")
        .style("font-size", "16px")
        .text("Demographics of Depression in " + countryName);

    makeBarLegend();

    // function to update barchart with a given country name
    updateBarchart = function(countryName) {
        dataset = formatData(countryName);
        y.domain([0, d3.max(dataset, function(age) {return d3.max(age.depression, function(d) {
            return (d.rate) + 500; }); })]);

        // add new data to bars
        var bar = barSvg.selectAll(".bar")
            .data(dataset);

        // update the rects
        bar.selectAll("rect")
            .data(function(d) { return d.depression; })
            .transition()
            .delay(function(d) { return Math.random() * 1000; })
            .duration(1000)
            .attr("y", function(d) { return y(d.rate); })
            .attr("height", function(d) { return height - y(d.rate); });

        barSvg.select(".y.axis")
            .transition()
            .duration(750)
            .call(yAxis);

        barSvg.select(".barTitle").remove();

        barSvg.append("text")
            .attr("x", (width / 2))
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .attr("class", "barTitle")
            .style("font-size", "16px")
            .text(function(d) { return "Demographics of Depression in " + countryName; });
    };
}

function makeBarLegend() {
    var legend = barSvg.selectAll(".legend")
        .data(dataset[0].depression.map(function(d) { return d.gender; }))
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
        .style("opacity", "100");

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d) { return color(d); });

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });
}

// function formats the data for the grouped bar chart
function formatData (countryName) {
    var dataset = [];

    // gets the index of the dataset
    index = findIndexOf(dataFemale, countryName);
    ageNames = d3.keys(dataFemale[index]).filter(function(key) {
        return key !== "country";
    });

    var i = 0;
    var ageName;
    for (i; i < ageNames.length; i++) {
        ageName = ageNames[i].replace(/^"(.*)"$/, '$1');
        dataset.push({
            age: ageNames[i],
            depression: [{
                    rate: dataMale[index][ageName],
                    gender: "Male"
                },
                {
                    rate: dataFemale[index][ageName],
                    gender: "Female"
                }
            ]
        });
    }
    return dataset;
}
