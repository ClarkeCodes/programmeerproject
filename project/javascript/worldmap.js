function colorMap(dataset) {
    var mapcontainer = document.getElementById("mapcontainer");
    var tooltip = d3.select('#mapcontainer').append('div')
        .attr('class', 'hidden tooltip');
    var worldmap = new Datamap({
        element: document.getElementById("mapcontainer"),
        // slightly zoomed in map projection
        setProjection: function(element) {
            var projection = d3.geo.equirectangular()
                .center([19, -3])
                .rotate([4.4, 0])
                .scale(120)
                .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
            var path = d3.geo.path()
                .projection(projection);
            return {
                path: path,
                projection: projection
            };
        },
        fills: {
            defaultFill: '#e2e2e2'
        },
        data: dataset,
        done: function(map) {
            d3.selectAll('.datamaps-subunit')
                .on('mouseover', function(geo) {
                    var mouse = d3.mouse(this);
                    tooltip.classed('hidden', false)
                        .attr('style', 'left:' + (mouse[0] + 15) +
                            'px; top:' + (mouse[1] - 55) + 'px')
                        .html(function() {

                            //   if (data[d.id]) {
                            return "<strong>Country:</strong> <span>" + geo.properties.name + "</span> <br/> <strong>";
                            //   + ":</strong> <span>" + data[d.id].number + "</span>";
                            //   }
                            //   return "<strong>Country:</strong> <span>" + geo.properties.name + "</span> <br/> <strong>";
                            // + ":</strong> <span> <i>No Data</i> </span>";
                        });

                    console.log(codes);
                    // console.log(codes_reverse);
                    // change fillcolor on mouseover
                    d3.select(this)
                        .style("fill", "black");

                    // highlight value of country in scatterplot and table
                    var country_code = codes[geo.properties.name];
                    highlightLine(country_code);
                })
                .on('mouseout', function(geo) {
                    // change fill back to previous color
                    tooltip.classed('hidden', true);
                    var country_code = codes[geo.properties.name];
                    d3.select(this)
                        .style("fill", function() {
                            // map return to grey if there is no data
                            if (dataset[country_code] === undefined) {
                                return '#e2e2e2';
                            } else {
                                return dataset[country_code].fillColor;
                            }
                        });
                    revertLine();
                })
                .on('click', function(geo) {
                    $('html, body').animate({
                        scrollTop: $("#linegraph_title").offset().top - 50
                    }, 1000);
                    updateBarchart(geo.properties.name);
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
        .attr("class", "legend");

    color_values.reverse();
    // add containers for legend
    legend.append("rect")
        .attr("x", 20)
        .attr("y", function(d, i) {
            return legendHeight - (i * r_height) - 2 * r_height;
        })
        .attr("width", r_width)
        .attr("height", r_height)
        .style("fill", function(d, i) {
            return colorScale(color_values[i]);
        })
        .style("opacity", 0.8);

    // add labels to legend
    legend.append("text")
        .attr("x", 45)
        .attr("y", function(d, i) {
            return legendHeight - (i * r_height) - r_height - 5;
        })
        .text(function(d, i) {
            return depressionLabels[i];
        });

    // inital legend title
    legend.append("text")
        .attr("id", "legendTitle")
        .attr("x", 20)
        .attr("y", 290)
        .attr("transform", "rotate(-90)")
        .text("Depression in % of population");
}

// functions to toggle map updates
function updateMap(dataset) {
    if (dataset == "suicide") {
        worldmap.updateChoropleth(data_s);
        updateLegend("suicide");
    } else {
        worldmap.updateChoropleth(data_d);
        updateLegend("depression");
    }
}

function updateLegend(dataset) {
    // remove current legend labels and title
    d3.selectAll("g.legend text")
        .remove();
    d3.selectAll("#legendTitle")
        .remove();

    if (dataset == "suicide") {
        // add new labels to legend
        legend.append("text")
            .attr("x", 45)
            .attr("y", function(d, i) {
                return legendHeight - (i * r_height) - r_height - 5;
            })
            .text(function(d, i) {
                return suicideLabels[i];
            });

        // add new legend title
        legend.append("text")
            .attr("id", "legendTitle")
            .attr("x", 10)
            .attr("y", 290)
            .text("Suicide");
    } else if (dataset == "depression") {
        // add new labels to legend
        legend.append("text")
            .attr("x", 45)
            .attr("y", function(d, i) {
                return legendHeight - (i * r_height) - r_height - 5;
            })
            .text(function(d, i) {
                return depressionLabels[i];
            });

        // add new legend title
        legend.append("text")
            .attr("id", "legendTitle")
            .attr("x", 10)
            .attr("y", 290)
            .text("Depression");
    }
}
