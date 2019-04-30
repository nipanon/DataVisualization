var url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
//set margins in an object
var margin = {
  top: 40,
  right: 20,
  bottom: 60,
  left: 60
};

//width and height for canvas minus the margins
var width = 920 - margin.left - margin.right;
var height = 630 - margin.top - margin.bottom;
//set up a dsicrete Ordinal color scale with schemeCategory10
//var color = d3.scaleOrdinal(d3.schemeCategory10);

//set up x and y scales
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleTime().range([0, height]);
//d3 timeParse to convert a string to minutes and seconds
var timeParse = d3.timeParse("%M:%S");
//d3 timeFormat to convert a time to human readable string
var timeFormat = d3.timeFormat("%M:%S");
//create xAxis based on x range with a tick format of years
var xAxis = d3.axisBottom(x).tickFormat(d3.format("d"));
//create a y axis based on the range of y with a tick format of minutes and seconds
var yAxis = d3.axisLeft(y).tickFormat(timeFormat);
//create div for popups
var popup = d3.select(".container").append("div").attr("id", "tooltip").style("opacity", 0);
//create svg for scatter plot in chart div
var container = d3.select('#chart').append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).attr("class", "graph").append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json(url, function (data) {
  console.log(data);
  //convert every time to a parsed time and overwrite in data
  data.forEach(function (d) {
    d.Time = timeParse(d.Time);
  });
  console.log(data);
  //create an array of all the years
  var years = data.map(function (d) {
    return d.Year;
  });
  //set the min and max to variables
  var yearMin = d3.min(years),
      yearMax = d3.max(years);
  //set x domain from min to max years with buffer year on either side for looks
  x.domain([yearMin - 1, yearMax + 1]);
  //set y domain of Time using d3.extent, which Returns the minimum and maximum value in the given array using natural order.
  y.domain(d3.extent(data, function (d) {
    return d.Time;
  }));

  //x axis
  var xSVG = container.append("g").attr("class", "x axis").attr("id", "x-axis").attr("transform", "translate(0," + height + ")").call(xAxis);
  //y Axis
  var ySVG = container.append("g").attr("class", "y axis").attr("id", "y-axis").call(yAxis);
  //y axis label
  container.append('text').attr('transform', 'rotate(-90)').attr('x', -160).attr('y', -44).style('font-size', 18).text('Time in Minutes');

  container.append('text').attr('x', width / 2).attr('y', height + 35).attr('dy', '0.3em').style('text-anchor', 'middle').text('Race Year');

  container.selectAll(".dot").data(data).enter().append("circle").attr("class", "dot").attr("r", 6).attr("cx", function (d) {
    //return scaled x
    return x(d.Year);
  }).attr("cy", function (d) {
    //return scaled y
    return y(d.Time);
  }).attr("data-xvalue", function (d) {
    return d.Year;
  }).attr("data-yvalue", function (d) {
    return d.Time;
  }).style("fill", function (d) {
    //i have no idea how this works
    return d.Doping != "" ? "red" : "green";
  }).on("mouseover", function (d) {
    popup.style("opacity", .9);
    popup.attr("data-year", d.Year);
    popup.html(d.Name + ": " + d.Nationality + "<br/>" + "Year: " + d.Year + ", Time: " + timeFormat(d.Time) + (d.Doping ? "<br/><br/>" + d.Doping : "")).style("right", d3.event.pageX + "px").style("bottom", d3.event.pageY - 28 + "px");
  }).on("mouseout", function (d) {
    popup.style("opacity", 0);
  });

  //create legend element in the chart container
  var legend = container.selectAll(".legend")
  //pull the colors from the color variable that i dont understand yet
  .data(["red", "green"]).enter().append("g").attr("class", "legend").attr("id", "legend")
  //function to place the legend in the correct spot
  .attr("transform", function (d, i) {
    return "translate(0," + (height / 6 - i * 25) + ")";
  });
  //add the tex next to the color boxes
  legend.append("text").attr("x", width - 24).attr("y", 9).attr("dy", ".35em").style("text-anchor", "end").text(function (d) {
    if (d === 'red') return "Doping Allegations";else {
      return "No Doping Allegations";
    };
  }).style("fill", function (d) {
    return d;
  });
});