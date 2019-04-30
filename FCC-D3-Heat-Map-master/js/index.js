var url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json";
//colors for heat map and months
var colors = ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee090", "#ffffbf", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4", "#313695"];
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

//height, width, and margins
var margin = { top: 40, right: 40, bottom: 130, left: 100 };
var width = 1000;
var height = 300;
//monthFormat(i) {
// return months[i - 1];
//}
var mapHeight = height - margin.top - margin.bottom;
var monthFormat = function monthFormat(i) {
  return months[i - 1];
};
//const numFormat = num => (num > 0 ? `+${num}` : num)


//tooltip popup
var popup = d3.select(".container").append("div").attr("id", "tooltip").style("opacity", 0);
//svg container
var container = d3.select('#chart').append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).attr("class", "graph").append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json(url, function (error, data) {
  var baseTemp = data.baseTemperature;
  var mainData = data.monthlyVariance;
  //create an array of the temp variace for each year, then get the max and mix for each
  var tempVar = mainData.map(function (d) {
    return d.variance;
  });
  var minVar = d3.min(tempVar);
  var maxVar = d3.max(tempVar);
  //create a color scale based on the min and max temp variace
  var colorScale = d3.scaleQuantile().domain([minVar, maxVar]).range(colors.reverse());

  var legend = container.append('g').attr('id', 'legend');

  //scale of the x-axis is the extent of the years, with a range of the width
  //extent returns the maximum value in the given array using natural order.
  var xScale = d3.scaleLinear().domain(d3.extent(mainData, function (d) {
    return d.year;
  })).range([0, width]);
  //scale of the y axis is the extent of the months, reverse because of how svg deal with the y axis
  //range is the height
  //this is all fucked but im sick of playing with it for now
  var yScale = d3.scaleBand()
  //.scaleLinear()
  .domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).range([height, 0]);

  console.log(yScale.domain);
  //x-axis play around with the tickFormat function because i dont know what that's doing it could just be "d" i think
  var xAxis = d3.axisBottom(xScale).tickFormat(function (d) {
    return d;
  }).ticks(25);
  //y-axis
  var yAxis = d3.axisLeft(yScale).tickFormat(monthFormat);

  //x axis
  container.append("g").attr("id", "x-axis").attr("transform", "translate(1," + (height + 25) + ")").call(xAxis);
  //y Axis
  container.append("g").attr("transform", "translate(0,12.5)").attr("id", "y-axis").call(yAxis);

  //set rectangled of the legend
  legend.selectAll("rect").data(colors).enter().append("rect").attr("y", height - 60).attr("x", function (d, i) {
    return i * 30;
  }).attr("transform", "translate(0,120)").attr("height", 30).attr("width", 30).attr("fill", function (d) {
    return d;
  });

  //set the rectagles of the heat map
  container.selectAll("rect").data(mainData).enter().append("rect").attr("class", "cell")
  //set width of cells to be the width of chart divided by the number of years in dataset
  .attr("width", width / (2015 - 1753))
  //height of chart is height of cells divided by number of months in year
  .attr("height", height / 12)
  //value of x is the value of the scaled year
  .attr("x", function (d) {
    return xScale(d.year);
  }).attr("data-year", function (d) {
    return d.year;
  })
  //value of y is the value of the scaled month
  .attr("y", function (d) {
    return yScale(d.month);
  }).attr("data-month", function (d) {
    return d.month - 1;
  }).attr("data-temp", function (d) {
    return d.variance + baseTemp;
  }).attr("fill", function (d) {
    return colorScale(d.variance);
  }).attr("transform", "translate(2,0)").on("mouseover", function (d) {
    popup.transition().duration(100).style("opacity", 0.9);
    popup.attr("data-year", d.year);
    popup.html("<h1>" + d.year + " - " + monthFormat(d.month) + "</h1><h2> Avg Temp: " + (baseTemp + d.variance).toFixed(2) + " &#8451</h2><h3>" + d.variance + " &#8451</h3>");
  }).on("mouseout", function () {
    popup.transition().duration(200).style("opacity", 0);
  });
});