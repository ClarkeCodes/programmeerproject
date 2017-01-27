function colorMap(dataset){
    var mapcontainer = document.getElementById("mapcontainer");
    var tooltip = d3.select('body').append('div')
        .attr('class', 'hidden tooltip');
    var worldmap = new Datamap({
        element: document.getElementById("mapcontainer"),
    fills: {
      // fill for countries without data
      defaultFill: '#e2e2e2'
    },
    data: dataset,
    done: function(map) {
        d3.selectAll('.datamaps-subunit')
            .on('mouseover', function(geo) {
                // var mouse = d3.mouse(element.node()).map(function(d) {
                //     return parseInt(d.country);
                // });
                // tooltip.classed('hidden', false)
                //     .attr('style', 'left:' + (mouse[0] + 15) +
                //             'px; top:' + (mouse[1] - 35) + 'px')
                //     .html(geo.properties.name);

                console.log(codes);
                // console.log(codes_reverse);
                // change fillcolor on mouseover
                d3.select(this)
                    .style("fill", "black");

                // highlight value of country in scatterplot and table
                var country_code = codes[geo.properties.name];
                // highlightCircle(country_code);
                // highlightTable(country_code);
                highlightLine(country_code);
            })
            .on('mouseout', function(geo) {
                // change fill back to previous color
                // tooltip.classed('hidden', true);
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
                // revertCircle(country_code);
            })
            .on('click', function(geo) {
                $('html, body').animate({
                    scrollTop: $("#linegraph_title").offset().top - 50
                }, 1000);
                updateBarchart(geo.properties.name);
                // console.log("Test");
                // window.scrollTo(0, 1000);
                // var country_code = codes[geo.properties.name];
                // highlightLine(country_code);
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
    }
    else {
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
            .attr("y", function(d, i) { return legendHeight - (i * r_height) - r_height - 5; })
            .text(function(d, i) { return suicideLabels[i]; });

        // add new legend title
        legend.append("text")
            .attr("id", "legendTitle")
            .attr("x", 10)
            .attr("y", 290)
            .text("Suicide");
    }
    else if (dataset == "depression") {
        // add new labels to legend
        legend.append("text")
            .attr("x", 45)
            .attr("y", function(d, i) { return legendHeight - (i * r_height) - r_height - 5; })
            .text(function(d, i) { return depressionLabels[i]; });

        // add new legend title
        legend.append("text")
            .attr("id", "legendTitle")
            .attr("x", 10)
            .attr("y", 290)
            .text("Depression");
    }
}

var updateBarchart;

function makeBarchart(countryName) {

    // set up margins, width and height for the barchart
    var margin = {top: 30, right: 20, bottom: 110, left: 100},
        width = 650 - margin.left - margin.right,
        height = 650 - margin.top - margin.bottom;

    // create svg with the specified size
    var svg = d3.select("#barcontainer").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("class", "barchart")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // // set up scale for x and y-axis
    // var x0 = d3.scale.ordinal()
    //     .rangeRoundBands([0, width], .1);
    // //
    // var x1 = d3.scale.ordinal();

    // function to color the bar of the grouped bar chart
    var color = function (gender) {
        if (gender == female) {
            return "#ff8c00";
        }
        else {
            return "#6b486b";
        }
    };
    // // set up scale for x and y-axis
    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .09);

    var y = d3.scale.linear()
        .range([height, 0]);

    // set up axes
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    // set up tooltip for numbers
    var tip = d3.tip()
        .attr("class", "d3-tip")
        .html(function(d) {
              return d3.format(",")(d.depression.toFixed(1));
          });


    var index = findIndexOf(dataFemale, countryName);
    var ageNames = d3.keys(dataFemale[index]).filter(function(key) { return key !== "country"; });
    // console.log(dataFemale[index]);
    var dataset = [];

    var i = 0;
    var ageName;
    for (i; i < ageNames.length; i++) {
        ageName = ageNames[i].replace(/^"(.*)"$/, '$1');
        dataset.push({
            age: ageNames[i],
            depression: dataBoth[index][ageName]
            // gender: {
            //     female: dataFemale[index][ageName],
            //     male: dataMale[index][ageName]
            // }
            // female: dataFemale[index][ageName],
            // male: dataMale[index][ageName]
        });
    }
    console.log(dataset);

    // domains for regular bar chart
    x.domain(dataset.map(function(d) { return d.age; }));
    y.domain([0, d3.max(dataset, function(d) { return d.depression + 500; })]);


    // domains for grouped bar chart
    // x0.domain(dataset.map(function(d) { return d.age; }));
    // x1.domain(2)
    //     .rangeRoundBands([0, x0.rangeBand()]);

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

   var ages = svg.selectAll(".age")
        .data(dataset)
        .enter().append("g")
        .attr("class", "g")
        .attr("transform", function(d) { return "translate(" + x(d.age) + ",0)"; });

  //   country.selectAll("rect")
  //   .data(function(d) { return d.ages; })
  // .enter().append("rect")
  //   //  .attr("width", x1.rangeBand())
  //    .attr("x", function(d) { return x1(d.name); })
  //    .attr("y", function(d) { return y(d.value); })
  //    .attr("height", function(d) { return height - y(d.value); })
  //    .style("fill", "steelblue");
  // set up the domain for x and y-axis

  // call tooltip
  svg.call(tip);

  // draw bars of chart
  svg.selectAll("bar")
      .data(dataset)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.age); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.depression); })
      .attr("height", function(d) { return height - y(d.depression);})
      //show and hide the tooltip during mouse events
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide);
    //   .style("fill", "steelblue");

    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .attr("class", "barTitle")
        .style("font-size", "16px")
        .text("Demographics of Depression in " + countryName);

    updateBarchart = function (countryName) {
          var index = findIndexOf(dataBoth, countryName);
          var ageNames = d3.keys(dataBoth[index]).filter(function(key) { return key !== "country"; });
          console.log(dataBoth[index]);
          var dataset = [];

          var i = 0;
          var ageName;
          for (i; i < ageNames.length; i++) {
              ageName = ageNames[i].replace(/^"(.*)"$/, '$1');
              dataset.push({
                  age: ageNames[i],
                  depression: dataBoth[index][ageName]
              });
          }
          console.log(dataset);
          y.domain([0, d3.max(dataset, function(d) { return d.depression + 500; })]);

          var bar = svg.selectAll(".bar")
              .data(dataset, function(d) { return d.age; });

              // new data:
          bar.enter().append("rect")
             .attr("class", "bar")
             .attr("x", function(d) { return x(d.age); })
             .attr("y", function(d) { return y(d.depression); })
             .attr("height", function(d) { return height - y(d.depression); })
             .attr("width", x.rangeBand());
          // removed data:
          bar.exit().remove();
          // updated data:
          bar
            .transition().duration(750)
             .attr("y", function(d) { return y(d.depression); })
             .attr("height", function(d) { return height - y(d.depression); });

        svg.select(".y.axis").remove();
        // Existing code to draw y-axis:
        svg.append("g")
           .attr("class", "y axis")
           .call(yAxis)
        .append("text")
         .attr("transform", "rotate(-90)")
         .attr("y", 6)
         .attr("dy", ".71em")
         .style("text-anchor", "end")
         .text("Depression");

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

var highlightLines;
var highlightLine;
var revertLine;

function makeLinegraph() {

    // set up margins, width and height for svg
    var margin = {top: 40, right: 100, bottom: 80, left: 50},
        width = 600 - margin.left - margin.right,
        height = 650 - margin.top - margin.bottom;

    // Parse the date / time
    var parseDate = d3.time.format("%Y").parse;

    // set the ranges
    var x = d3.time.scale()
        .range([0, width]);
    var y = d3.scale.linear()
        .range([height, 0]);

    // define the axes
    var xAxis = d3.svg.axis().scale(x)
        .orient("bottom").ticks(6);
    var yAxis = d3.svg.axis().scale(y)
        .orient("left").ticks(10);

    // create svg with the specified size
    var svg = d3.select("#linecontainer")
        .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .attr("class", "linegraph")
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Define the line
    var valueline = d3.svg.line()
        .x(function(d) { return x(d.year); })
        .y(function(d) { return y(d.depression); });

    // get data from csv file
    d3.csv("project/data/prevalence_depression_1995-2015.csv", function(error, data) {
        if (error) throw error;

        data.forEach(function(d) {
            d.depression = +d.depression;
            // d.year = +d.year;
            d.year = parseDate(d.year);
            // console.log(d.year);
        });

        // console.log(data);

        var focus = svg.append("g")
            .attr('class', 'focus')
            .style("visibility", "hidden");

        // add text placeholders for date and temperatures
        focus.append("text")
            .attr("class", "countryName")
            .attr("dx", 8)
            .attr("dy", "-.3em");

        var selected = svg.append("g")
            .attr('class', 'focus')
            .style("visibility", "hidden");

        selected.append("text")
            .attr("class", "selected")
            .attr("dx", 8)
            .attr("dy", "-.3em");

        // scale the range of the data
        x.domain(d3.extent(data, function(d) { return d.year; }));
        // x.domain(data.map(function(d) { return d.year; }));
        var minimum = d3.min(data, function(d) { return d.depression; });
        y.domain([minimum, d3.max(data, function(d) { return d.depression; }) ]);

        // Nest the entries by symbol
        var dataNest = d3.nest()
            // .key(function(d) {return d.year;})
            .key(function(d) {return d.country;})
            .entries(data);

        var countries = svg.selectAll(".country")
            .data(dataNest, function(d) { return d.key; })
           .enter().append("g")
            .attr("class", "country");

        countries.append("path")
            .attr("id", function(d) {return d.values["0"].continent; })
            .attr("class", function (d) {
                var lineClass = "line " + codes[d.key];
                return lineClass;
            })
            .attr("d", function(d) { return valueline(d.values); });

        var lineColor;

        svg.selectAll(".line")
            .on("mouseover", function(d) {
                var country = d3.select(this)[0][0].classList[1];
                console.log(country);
                var selector = '.datamaps-subunit.' + country;
                console.log(selector);
                d3.selectAll(selector)
                    .style("fill", "black");

                var thisHeight = y(d.values[4].depression);
                // var countryName = d3.select(this.parentNode).attr('id');
                // add text to be displayed when moving cursor over graph
                focus.select("text.countryName")
                    .attr("transform", "translate(" + (width - 5) + "," + (thisHeight + 5) + ")")
                    .text(d.key);

                d3.selectAll('.focus')
                    .style("visibility", "visible");

                var element = d3.select(this)
                    .attr("z-index", "100")
                    .style("stroke", function() {
                        lineColor = getStyle(d3.select(this)[0][0], 'stroke');
                        return "#000";
                    })
                    .style("stroke-width", "2px");

                })
            .on("mouseout", function () {
                var country = d3.select(this)[0][0].classList[1];
                console.log(country);
                var selector = '.datamaps-subunit.' + country;
                console.log(selector);
                d3.selectAll(selector)
                    .style("fill", function() {
                        // map return to grey if there is no data
                        if (dataset[country] === undefined) {
                            return '#e2e2e2';
                        } else {
                            return dataset[country].fillColor;
                        }
                    });

                d3.selectAll('.focus')
                    .style("visibility", "hidden");

                d3.select(this)
                    .style("stroke", function() {
                        if (lineColor != "#000") {
                            return lineColor;
                        }
                        else {
                            return '#eee';
                        }
                    })
                    .style("stroke-width", "1px");
                })
            .on("click", function (d) {
                var country = d3.select(this)[0][0].classList[1];
                country = codes_reverse[country];
                updateBarchart(country);

                d3.selectAll('.selected')
                    .style("visibility", "hidden");

                var thisHeight = y(d.values[4].depression);
                // add text to be displayed next to graph
                selected.select("text.selected")
                    .attr("transform", "translate(" + (width - 5) + "," + (thisHeight + 5) + ")")
                    .text(d.key);
                d3.selectAll('.selected')
                    .style("visibility", "visible");

                // change color of line
                var element = d3.select(this)
                    .attr("z-index", "200")
                    .style("stroke", function() {
                        lineColor = getStyle(d3.select(this)[0][0], 'stroke');
                        return "#000";
                    })
                    .style("stroke-width", "2px");

            });

        // Add the X Axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        // Add the Y Axis
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        var continentColors = {
            Europe:'#ED7C31',
            EastAsia: '#00BBD6',
            SouthAsia:'#6E9E75',
            NorthAfrica:'#E25f82',
            SubSaharan:'#895881',
            LatinAmerica:'#82A5C0',
            NorthAmerica:'#BE1932'
        };

        highlightLines = function(button, continent) {
            var continent_path = "path#" + continent + ".line";
            var newColor = continentColors[continent];

            // change button color when clicked
            if (button.style.color === "" ||
                button.style.color == 'rgb(51, 51, 51)') {
                button.style.color = '#FFF';
                button.style.backgroundColor = newColor;
                svg.selectAll(continent_path)
                    .style("stroke", newColor);
            }
            // change button back to original color
            else {
                button.style.color = '#333';
                button.style.backgroundColor = '#FFF';
                svg.selectAll(continent_path)
                    .style("stroke", '#eee');

            }

        };
        highlightLine = function (countryCode) {
            var selector = 'path.line.' + countryCode;
            svg.selectAll(selector)
                .style("stroke-width", "2px")
                .style("stroke", '#333');

        };
        revertLine = function () {
            svg.selectAll('.line')
                .style("stroke-width", "1px")
                .style("stroke", '#eee');
        };
    });
}

function getStyle(element, property) {
    return window.getComputedStyle(element, null).getPropertyValue(property);
}

// source: http://haacked.com/archive/2009/12/29/convert-rgb-to-hex.aspx/
function colorToHex(color) {
    if (color.substr(0, 1) === '#') {
        return color;
    }
    var digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);

    var red = parseInt(digits[2]);
    var green = parseInt(digits[3]);
    var blue = parseInt(digits[4]);

    var rgb = blue | (green << 8) | (red << 16);
    return digits[1] + '#' + rgb.toString(16);
}

function findIndexOf(data, value) {
    var index;
    var i = 0;
    for (i; i < data.length; i++) {
        if (data[i].country == value) {
            index = i;
            return index;
        }
    }
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
