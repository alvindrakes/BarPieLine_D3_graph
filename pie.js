//dimension and margin of the graph
let widthPie = 450;
heightPie = 450;
marginPie = 40;

//radius of pieplot = half the widthPie/height
let radius = Math.min(widthPie,heightPie)/2 - marginPie;

//append@add svg object and group for piechart
let svgPie = d3.select("#piechart_data")
  .append("svg")
  .attr("width",widthPie)
  .attr("height",heightPie)
  .append ("g")
  .attr("transform","translate(" + widthPie/2 + "," + heightPie/2 + ")");

let label = d3.arc()
  .outerRadius(radius)
  .innerRadius(0);

let itemsToLoad = 100;
let countryIndex = 0;

let countries = [];
let allCountriesField = ["Adequate Exercise", "Inadequate Exercise"];

function loadData() {
  d3.csv("Cw2FilteredExerciseData.csv", function(data) {

    // list of countries
    let countryIndex = 0;
    let selected = data[countryIndex]["country"];
    let allCountries = d3.map(data, function(d, i) {
      countries[d.country] = i;
      return d.country;
    }).keys();

    let dropdown = d3.select("#dropdown")
      .selectAll('options')
      .data(allCountries)
      .enter()
      .append('option')
      .text(function(d) { return d; })
      .attr("value", function(d) { return d; });
  });

  // d3.select("#dropdown").on("change", function(d) {
  //   // recover the option that has been chosen
  //   let selectedOption = document.getElementById("dropdown").value;
  //   countryIndex = countries[selectedOption];
  //   updatePie(selectedOption);
  // })
}

function updatePie(country) {

  let csvName = "Cw2FilteredExerciseData.csv";

  d3.csv(csvName, function(data){

    //set the color scale
    let color;
    color = d3.scaleOrdinal()
      .domain(allCountriesField)
      .range(d3.schemeDark2);

    //compute the position of each group on the pie:
    let pie = d3.pie()
      .value(function(d) {return d.value;})
      .sort(function(a,b) { return d3.ascending(a.key, b.key); });

    let data_ready;
    itemsToLoad = allCountriesField.length;
    data_ready = pie(d3.entries([100-data[countryIndex]["exercise_lack"], data[countryIndex]["exercise_lack"]]));

    //map to data
    let u = svgPie.selectAll("path")
      .data(data_ready);

    //Build the pie chart : each part of the pie is a path that we build
    u
      .enter()
      .append('path')
      .on("mouseover", function(d, i) {
        onMouseOver(d, i, country);
      })
      .on("mouseout", function(d, i) {
        onMouseOut(d, i);
      })
      .merge(u)
      .transition()
      .duration(1000)
      .attr('d', d3.arc()
        .innerRadius(100)
        .outerRadius(radius)
      )
      .attr('fill', function(d) {return(color(d.data.key))})
      .attr("stroke", "white")
      .style("stroke-width","2px")
      .style("opacity", 1)
      .on("end", function(d, i) {
        onAnimEnd(d, i);
      });

    //remove the group that is not present anymore / not needed
    u
      .exit()
      .remove();

  })

}

function onMouseOver(d, i, country) {
  if (!itemsToLoad) {

    let title = allCountriesField[i];

    let titleText = svgPie
      .append("text")
      .attr("class", "text")
      .attr("x", -75)
      .attr("y", -25)
      .text(title)
      .attr("stroke", "#000");

    let pctText = svgPie
      .append("text")
      .attr("class", "text")
      .attr("x", -25)
      .attr("y", 0)
      .text(function() { return d.data.value + "%"; })
      .attr("stroke", "#000");
  }
}

function onMouseOut(d, i) {
  if (!itemsToLoad) {
    d3.selectAll(".text")
      .remove();
  }
}

function onAnimEnd(d, i) {
  itemsToLoad--;
}

//Initialize the pie chart with the first default dataset
loadData();
updatePie("Cw2FilteredExerciseData.csv");