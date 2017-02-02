/**
 * worldmap.js
 *
 * Eline Jacobse
 * Programmeerproject
 * Student: 11136235
 *
 */

var legend;

// set up attributes for legend
var legendWidth = 110,
    legendHeight = 400;

// width and height for rects of legend
var r_width = 20,
    r_height = 20;

function colorMap(dataset) {
    var mapcontainer = document.getElementById("mapcontainer");
    var maptip = d3.select('#mapcontainer').append('div')
        .attr('class', 'hidden tooltip');
    var worldmap = new Datamap({
        element: document.getElementById("mapcontainer"),
        // slightly zoomed in map projection
        setProjection: function(element) {
            var projection = d3.geo.equirectangular()
                .center([19, -3])
                .rotate([4.4, 0])
                .scale(160)
                .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
            var path = d3.geo.path()
                .projection(projection);
            return {
                path: path,
                projection: projection
            };
        },
        fills: {
            defaultFill: '#B3B6B7'
        },
        data: dataset,
        done: function(map) {
            d3.selectAll('.datamaps-subunit')
                .on('mouseover', function(geo) {
                    var mouse = d3.mouse(this);
                    maptip.classed('hidden', false)
                        .attr('style', 'left:' + (mouse[0] + 15) +
                            'px; top:' + (mouse[1] - 55) + 'px')
                        .html(function() {
                            // show tooltip with data if data is available
                            if (dataset[geo.id]) {
                                if (suicide_data[geo.id]) {
                                    return "<strong><span>" + geo.properties.name + "</span></strong>" +
                                            "<br><strong>Depression: </strong><span>" + dataset[geo.id].depression.toFixed(2) + "% </span>" +
                                            "<br><strong>Suicide: </strong><span>" + suicide_data[geo.id].suicide.toFixed(2) + " per 100,000</span>";
                                }
                                else {
                                // show different tooltip if only the suicide data is not available
                                return "<strong><span>" + geo.properties.name + "</span></strong>" +
                                        "<br><strong>Depression: </strong><span>" + dataset[geo.id].depression.toFixed(2) + "% </span>" +
                                        "<br><strong>Suicide: </strong><span><i>No data available</i></span>";
                                }
                            }
                            // show tooltip with country name and 'no data' if no data is available
                            else {
                                return "<strong><span>" + geo.properties.name + "</span></strong>" +
                                "<br></strong> <span> <i>No Data</i> </span>";
                            }
                        });
                    // change fillcolor of country mouseover
                    d3.select(this)
                        .style("fill", function() {
                            if (dataset[geo.id]) {
                                return d3.rgb(dataset[geo.id].fillColor).darker(1);
                            }
                            return d3.rgb('#e2e2e2').darker(1);
                        });
                })
                .on('mouseout', function(geo) {
                    // hide tooltip and change fill back to previous color
                    maptip.classed('hidden', true);
                    d3.select(this)
                        .style("fill", function() {
                            if (dataset[geo.id] === undefined) {
                                return '#e2e2e2';
                            } else {
                                return dataset[geo.id].fillColor;
                            }
                        });
                })
                .on('click', function(geo) {
                    if (dataset[geo.id]) {
                        // highlight line of this country
                        var selector = '.line.' + geo.id;
                        d3.selectAll('.selected')
                            .style("visibility", "hidden");
                        highlightLine(selector);
                        // scroll to line graph
                        $root.animate({
                            scrollTop: $("#linegraph_title").offset().top - 50
                        }, 1000);
                        updateBarchart(geo.properties.name);
                    }
                });
        }
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
        .attr("class", "mapLegend");

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
    svg.append("text")
        .attr("id", "legendTitle")
        .style("text-anchor", "left")
        .attr("x", -380)
        .attr("y", 10)
        .attr('transform', 'rotate(-90)')
        .text("Depression rate (%)");
}

var buttonSuicide = d3.selectAll('#btnSuicide')[0][0];
var buttonDepression = d3.selectAll('#btnDepression')[0][0];

// functions to toggle map updates
function updateMap(dataset) {
    if (dataset == "suicide") {
        buttonSuicide.style.backgroundColor = '#fff';
        buttonDepression.style.backgroundColor = '#eee';
        worldmap.updateChoropleth(data_s);
        updateLegend("suicide");

    } else {
        buttonDepression.style.backgroundColor = '#fff';
        buttonSuicide.style.backgroundColor = '#eee';
        worldmap.updateChoropleth(data_d);
        updateLegend("depression");
    }
}

function updateLegend(dataset) {
    var svg = d3.select("#legendContainer");
    // remove current legend labels and title
    d3.selectAll("g.mapLegend text")
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
        svg.append("text")
            .attr("id", "legendTitle")
            .style("text-anchor", "left")
            .attr("x", -380)
            .attr("y", 10)
            .attr('transform', 'rotate(-90)')
            .text("Suicide rate per 100,000");

    } else if (dataset == "depression") {
        // add new labels to legend
        legend.append("text")
            .attr("x", 45)
            .attr("y", function(d, i) { return legendHeight - (i * r_height) - r_height - 5; })
            .text(function(d, i) { return depressionLabels[i]; });

        // add new legend title
        svg.append("text")
            .attr("id", "legendTitle")
            .style("text-anchor", "left")
            .attr("x", -380)
            .attr("y", 10)
            .attr('transform', 'rotate(-90)')
            .text("Depression rate (%)");
    }
}
