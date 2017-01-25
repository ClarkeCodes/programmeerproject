console.log(both[0]);
data = both[0];
data_female = female[0];
data_male = male[0];

var ageNames = d3.keys(data).filter(function(key) { return key !== "country"; });
var ageNames1 = d3.keys(data_female).filter(function(key) { return key !== "country"; });
var ageNames2 = d3.keys(data_male).filter(function(key) { return key !== "country"; });
console.log(ageNames);

data.forEach(function(d) {
    d.ages = ageNames.map(function(name) { return {name: name, value: +d[name]}; });
});

data_female.forEach(function(d) {
    d.ages = ageNames1.map(function(name) { return {name: name, value: +d[name]}; });
});

data_male.forEach(function(d) {
    d.ages = ageNames2.map(function(name) { return {name: name, value: +d[name]}; });
});


x0.domain(ageNames.map(function(d) { return d.name; }));
x1.domain(ageNames)
    .rangeRoundBands([0, x0.rangeBand()]);

y.domain([0, d3.max(data, function(d) { return d3.max(d.ages, function(d) { return d.value; }); })]);

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
   .append("text")
   .attr("transform", "rotate(-90)")
   .attr("y", 6)
   .attr("dy", ".71em")
   .style("text-anchor", "end")
   .text("Depression");

var ages = svg.selectAll(".ages")
    .data(data)
    .enter().append("g")
    .attr("class", "g")
    .attr("transform", function(d) { return "translate(" + x0(d.ages) + ",0)"; });

country.selectAll("rect")
.data(function(d) { return d.ages; })
.enter().append("rect")
 .attr("width", x1.rangeBand())
 .attr("x", function(d) { return x1(d.name); })
 .attr("y", function(d) { return y(d.value); })
 .attr("height", function(d) { return height - y(d.value); })
 .style("fill", "steelblue");
