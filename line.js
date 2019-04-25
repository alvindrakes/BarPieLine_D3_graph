var margin = {top: 50, right: 30, bottom: 30, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

let csvData, selected, bar, allGroup, x, y, line, myColor, focus, yline, xline, circ, rect;

//Read the data
d3.csv("cw2.csv", function(data) {

  csvData = data;

  // List of groups (here I have one group per column)
  selected = "Algeria";
  bar = svg.selectAll("rect").data(data);
  allGroup = d3.map(data, function(d){return(d.Country)}).keys();
  // add the options to the button
  d3.select("#selectButton")
    .selectAll('myOptions')
    .data(allGroup)
    .enter()
    .append('option')
    .text(function (d) { return d; }) // text showed in the menu
    .attr("value", function (d) { return d; }) // corresponding value returned by the button

  // A color scale: one color for each group
  myColor = d3.scaleOrdinal()
    .domain(allGroup)
    .range(d3.schemeSet2);

  // Add X axis --> it is a date format
  x = d3.scaleLinear()
    .domain([2000,2016])
    .range([ 0, width ])
    .nice();

  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickFormat(d3.format("d")));
  // Add Y axis
  y = d3.scaleLinear()
    .domain([18,32])
    .range([ height, 0 ])

  svg.append("g")
    .call(d3.axisLeft(y));

  // Initialize line with first group of the list
  line = svg
    .append('g')
    .append("path")
      .datum(data.filter(function(d){return d.Country==allGroup[0]}))
      .attr("d", d3.line()
        .x(function(d) { return x(d.Year) })
        .y(function(d) { return y(+d.bmi) })
      )
      .attr("stroke", function(d){ return myColor("valueA") })
      .style("stroke-width", 4)
      .style("fill", "none")

  bisectDate = d3.bisector(function(d) { return d.Year; }).left;


  svg.append("text")
          .attr("x", (width / 2))
          .attr("y", 0 - (margin.top / 2))
          .attr("text-anchor", "middle")
          .style("font-size", "13px")
          .style("font-weight", "bold")
          .text("Mean BMI values by Country, BMI>25 is overweight & BMI>30 is obese");


  focus = svg.append("g")
          .attr("class", "focus")
          .style("display", "none");

  yline=   focus.append("line")
        .attr("class", "x-hover-line hover-line")
        .attr("y1", 0)
        .attr("stroke", function(d){ return myColor(selected) })
        .attr("y2", height);
  xline=  focus.append("line")
        .attr("class", "y-hover-line hover-line")
        .attr("x1", width)
        .attr("stroke", function(d){ return myColor(selected) })
        .attr("x2", width);
  circ=  focus.append("circle")
        .attr("r", 7.5)
        .style("stroke",function(d){ return myColor(selected) });
    focus.append("text")
        .attr("x", 15)
        .attr("dy", ".31em");
  rect=  svg.append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .on("mouseover", function() { focus.style("display", null); })
        .on("mouseout", function() { focus.style("display", "none"); })
        .on("mousemove", mousemove);

  // When the button is changed, run the updateChart function
  // d3.select("#selectButton").on("change", function(d) {
  //     // recover the option that has been chosen
  //     var selectedOption = d3.select(this).property("value")
  //     // run the updateChart function with this selected option
  //     update(selectedOption)
  // });

})

function mousemove() {
  var data2 = csvData.filter(function(d){return d.Country === selected});
  var x0 = x.invert(d3.mouse(this)[0]),
      i = bisectDate(data2, x0, 1),
      d0 = data2[i - 1],
      d1 = data2[i],
      d = x0 - d0.Year > d1.Year - x0 ? d1 : d0;

  focus.attr("transform", "translate(" + x(d.Year) + "," + y(d.bmi) + ")");
  focus.select("text").text(function() { return d.bmi; });
  focus.select(".x-hover-line").attr("y2", height - y(d.bmi));
  focus.select(".y-hover-line").attr("x2", width + width);
}

// A function that update the chart
function update(selectedGroup) {

  // Create new data with the selection?
  var dataFilter = csvData.filter(function(d){return d.Country==selectedGroup})
  selected = selectedGroup;
  // Give these new data to update line
  line
      .datum(dataFilter)
      .transition()
      .duration(1000)
      .attr("d", d3.line()
        .x(function(d) { return x(d.Year) })
        .y(function(d) { return y(d.bmi)})
      )
      .attr("stroke", function(d){ return myColor(selectedGroup) })

      circ.style("stroke",function(d){ return myColor(selectedGroup) });
      yline.attr("stroke", function(d){ return myColor(selectedGroup) });
      xline.attr("stroke", function(d){ return myColor(selectedGroup) });
}