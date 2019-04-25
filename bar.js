//default yAxisVariable value to initialize
updateYAxis('fats')

var marginBar = {
        top: 30,
        right: 30,
        bottom: 70,
        left: 60
    },
    widthBar = 1000 - marginBar.left - marginBar.right,
    heightBar = 400 - marginBar.top - marginBar.bottom;

//append the svg object (canvas of bar chart) to the body of the page
var svgBar = d3.select("#bar_chart")
    .append("svg")
    .attr("width", widthBar + marginBar.left + marginBar.right + 35)
    .attr("height", heightBar + marginBar.top + marginBar.bottom)
    .append("g")
    .attr("transform",
        "translate(" + marginBar.left + "," + marginBar.top + ")");


//text for Legend of x-Axis
svgBar.append("text")
    .attr("transform", "translate(100,0)")
    .attr("x", 385)
    .attr("y", 345)
    .attr("text-anchor", "end")
    .text("Country")

var xScale = d3.scaleBand().range([0, widthBar + 35]).padding(0.4);
var xAxis = svgBar.append("g").attr("transform", "translate(0," + heightBar + ")")
var yScale = d3.scaleLinear().range([heightBar, 0]);
var yAxis = svgBar.append("g");

function updateYAxis(yAxisVariables) {

    d3.csv("final_list.csv", function (data) {


        xScale.domain(data.map(function (d) {
            return d.country;
        }));
        xAxis.transition().duration(1000).call(d3.axisBottom(xScale))

        //if else statement to check whether min data < 0
        //if min data <0 then set negative values on y-Axis
        //else set the min value of the Y axis as 0
        if (d3.min(data, function (d) {
                return +d[yAxisVariables]
            }) < 0) {
            //-1000 to fit in 1970 data as too low cant click
            yScale.domain([d3.min(data, function (d) {
                return +d[yAxisVariables] - 1000
            }), d3.max(data, function (d) {
                return +d[yAxisVariables]
            })]);
        } else {
            yScale.domain([0, d3.max(data, function (d) {
                return +d[yAxisVariables]
            })]);
        }
        yAxis.transition().duration(1000).call(d3.axisLeft(yScale));

        d3.selectAll('.legend')
            .remove()

        //text for Legend of y-Axis
        svgBar.append("text")
            .attr("class", "legend")
            .attr("transform", "translate(100,0)")
            .attr("x", -90)
            .attr("y", -30)
            .attr("dy", "1em")
            .attr("text-anchor", "end")
            .text(callYLegend(yAxisVariables))

        var bars = svgBar.selectAll(".bar")
            .data(data)

        bars
            .enter()
            .append("rect")
            .attr("class", "bar")
            .merge(bars)
            .on("mouseover", onMouseOver)
            .on("mouseout", onMouseOut)
            .transition()
            .duration(1000)
            .attr("x", function (d) {
                return xScale(d.country);
            })
            .attr("y", function (d) {
                return yScale(d[yAxisVariables]);
            })
            .attr("width", xScale.bandwidth())
            .attr("height", function (d) {
                return heightBar - yScale(d[yAxisVariables]);
            })
    })

    //mouseover event handler function
    function onMouseOver(d, i) {

        d3.select(this).attr('class', 'highlight');
        svgBar.append("text")
            .attr('class', 'val')
            .attr('x', function () {
                return xScale(d.country);
            })
            .attr('y', function () {
                return yScale(d[yAxisVariables]) - 5; //minus higher value = push higher 
            })
            .text(function () {
                return [d[yAxisVariables]]; //value of the text
            })

        svgBar.append("line")
            .attr('class', 'dot_line')
            .attr("x1", 0)
            .attr("y1", function () {
                return yScale(d[yAxisVariables]);
            })
            .attr("x2", function () {
                return widthBar + 35;
            })
            .attr("y2", function () {
                return yScale(d[yAxisVariables]);
            })
            .attr("stroke", "green")
            .attr("stroke-width", 2);
    }
    //end of function onMouseOver

    //mouseOut event handler function
    function onMouseOut(d, i) {
        //use the text label class to remove label on mouseout
        d3.select(this).attr('class', 'bar');
        d3.select(this)
            .transition()
            .duration(400)
            .attr('width', xScale.bandwidth())
            .attr("y", function (d) {
                return yScale(d[yAxisVariables]);
            })
            .attr("height", function (d) {
                return heightBar - yScale(d[yAxisVariables]);
            });

        d3.selectAll('.val')
            .remove()

        d3.selectAll('.dot_line')
            .remove()
    }
} //end of function updateYAxis


function callYLegend(yValue) {
    if (yValue == "fats") {
        return ["Fats"];
    } else if (yValue == "calories") {
        return ["Calories"];
    }
}