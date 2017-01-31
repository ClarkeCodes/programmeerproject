/**
 * barchart.js
 *
 * Eline Jacobse
 * Programmeerproject
 * Student: 11136235
 *
 */

var updateBarchart;
// function to color the bar of the grouped bar chart
var color = function(gender) {
    if (gender == "Female") {
        return "#fd8d3c";
    } else {
        return '#9ecae1';
    }
};

function makeBarchart(countryName) {

    // set up margins, width and height for the barchart
    var margin = {
            top: 50,
            right: 20,
            bottom: 110,
            left: 100
        },
        width = 700 - margin.left - margin.right,
        height = 550 - margin.top - margin.bottom;

    // set up scale for x and y-axis
    var x0 = d3.scale.ordinal()
        .rangeRoundBands([0, width], 0.1);

    var x1 = d3.scale.ordinal();

    var y = d3.scale.linear()
        .range([height, 0]);

    // set up axes
    var xAxis = d3.svg.axis()
        .scale(x0)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    // create svg with the specified size
    var svg = d3.select("#barcontainer").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("class", "barchart")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // set up tooltip for numbers
    var tip = d3.tip()
        .attr("class", "d3-tip")
        .html(function(d) {
            return d3.format(",")(d.depression[0].toFixed(1));
        });

    // reduces the dataset to only items that match the 'test':
    // var angolaObj = dataset.filter(function (d) { return d.key == "Angola" });
    // finds the index of country
    var index = findIndexOf(dataFemale, countryName);
    var ageNames = d3.keys(dataFemale[index]).filter(function(key) {
        return key !== "country";
    });
    var dataset = [];

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
    console.log(dataset);

    var genders = dataset[0].depression.map(function(d) {
        return d.gender;
    });
    console.log(genders);

    var all_ages = ["10 - 19", "20 - 29", "30 - 39", "40 - 49",
        "50 - 59", "60 - 69", "70+"];

    // domains for grouped bar chart
    x0.domain(ageNames);
    x1.domain(genders)
        .rangeRoundBands([0, x0.rangeBand()]);
    y.domain([0, d3.max(dataset, function(age) {
        return d3.max(age.depression, function(d) {
            return d.rate + 500;
        });
    })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-45)");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Depression per 100,000");

    // call tooltip
    svg.call(tip);

    var bar = svg.selectAll(".bar")
        .data(dataset)
        .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) {
            return "translate(" + x0(d.age) + ",0)";
        });

    var div = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

    bar.selectAll("rect")
        .data(function(d) { return d.depression; })
        .enter().append("rect")
        .attr("width", x1.rangeBand())
        .attr("x", function(d) { return x1(d.gender); })
        .style("fill", function(d) { return color(d.gender);})
        .attr("y", function(d) { return y(0); })
        .attr("height", function(d) { return height - y(0); })
        .on("mouseover", function(d) {
            console.log(d.rate);
            div.transition()
                .duration(200)
                .style('opacity', 0.9);
            div.html('<h3>' + d.rate.toFixed(0) + '</h3>')
                .style('left', (d3.event.pageX) + 'px')
                .style('top', function(d) { return height - y(0); });
            d3.select(this).style("fill", d3.rgb(color(d.gender)).darker(2));
        })
        .on("mouseout", function(d) {
            // tip.hide;
            div.style('opacity', 0);
            d3.select(this).style("fill", color(d.gender));
        });

    bar.selectAll("rect")
        .transition()
        .delay(function(d) { return Math.random() * 1000; })
        .duration(1000)
        .attr("y", function(d) { return y(d.rate); })
        .attr("height", function(d) { return height - y(d.rate); });


    var legend = svg.selectAll(".legend")
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

    // add title to barchart
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .attr("class", "barTitle")
        .style("font-size", "16px")
        .text("Demographics of Depression in " + countryName);

    updateBarchart = function(countryName) {
        var index = findIndexOf(dataBoth, countryName);
        var ageNames = d3.keys(dataBoth[index]).filter(function(key) {
            return key !== "country";
        });
        console.log(dataBoth[index]);
        var dataset = [];

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
        var genders = dataset[0].depression.map(function(d) {
            return d.gender;
        });
        y.domain([0, d3.max(dataset, function(age) {return d3.max(age.depression, function(d) { return d.rate + 500; }); })]);

        var bar = svg.selectAll(".bar")
            .data(dataset);

        bar.enter().append("rect")
            .attr("class", "bar")
            .attr("width", x1.rangeBand())
            .attr("x", function(d) { return x1(d.gender); })
            .style("fill", function(d) { return color(d.gender); })
            .attr("y", function(d) { return y(0); })
            .attr("height", function(d) { return height - y(0); })
            .on("mouseover", function(d) {
                d3.select(this)
                .style("fill", d3.rgb(color(d.gender)).darker(2));
            })
            .on("mouseout", function(d) {
                d3.select(this).style("fill", color(d.gender));
            });

        bar.exit().remove();

        bar.selectAll("rect")
            .transition()
            .delay(function(d) { return Math.random() * 1000; })
            .duration(1000)
            .attr("y", function(d) { return y(d.rate); })
            .attr("height", function(d) { return height - y(d.rate); });

        svg.select(".y.axis")
            .transition()
            .duration(750)
            .call(yAxis);
        // Existing code to draw y-axis:
        // svg.append("g")
        //     .attr("class", "y axis")
        //     .call(yAxis)
        //     .append("text")
        //     .attr("transform", "rotate(-90)")
        //     .attr("y", 6)
        //     .attr("dy", ".71em")
        //     .style("text-anchor", "end")
        //     .text("Depression per 100,000");

        svg.select(".barTitle").remove();

        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .attr("class", "barTitle")
            .style("font-size", "16px")
            .text("Demographics of Depression in " + countryName);

    };
}
