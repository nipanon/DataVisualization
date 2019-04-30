var yPad = 90,
    width = 1200,
    height = 400,
    barWidth = width / 275;

//create the container for bar chart in the chart div
var container = d3.select('.chart').append('svg').attr('width', width + 100).attr('height', height + 60);
var url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
//create div for popups
var popup = d3.select(".container").append("div").attr("id", "tooltip");

//feed json data to D3
d3.json(url, function (data) {

  //filter the json 'data' d[0] is the timestamp and d[1] is the GDP 
  //returns an array of the Year and Quarter
  var yearmap = data.data.map(function (d) {
    var slice = d[0].substring(5, 7);
    var quarter = void 0;
    if (slice === '01') {
      quarter = 'Q1';
    } else if (slice === '04') {
      quarter = 'Q2';
    } else if (slice === '07') {
      quarter = 'Q3';
    } else if (slice === '10') {
      quarter = 'Q4';
    }
    console.log(d[0].substring(0, 4) + ' ' + quarter);
    return d[0].substring(0, 4) + ' ' + quarter;
  });

  //take yearmap and grab just the year  
  var years = yearmap.map(function (d) {
    return d.substring(0, 4);
  });

  //returns GDP from json data
  var GDP = data.data.map(function (d) {
    return d[1];
  });

  //lowest and highest GDP
  var gdpMin = d3.min(GDP);
  var gdpMax = d3.max(GDP);
  //container for scaled GDP data
  var scaledGDP = [];

  //create scale to keep data within container
  var linearScale = d3.scaleLinear().domain([gdpMin, gdpMax]).range([gdpMin / gdpMax * height, height]);
  //apply scale to GPD data and sctore in array
  scaledGDP = GDP.map(function (item) {
    return linearScale(item);
  });

  //domain for lowest year to highest year
  //range  to the width of the chart
  var xScale = d3.scaleLinear().domain([d3.min(years), d3.max(years)]).range([0, width]);

  //scale for yAxis
  var yScale = d3.scaleLinear().domain([gdpMin, gdpMax])
  //figure out the logic behind this range, it has to do with flipping the axis because of how SVG handles coordinates im pretty sure
  .range([height, gdpMin / gdpMax * height]);

  // a y-axis based on the domain and range set in yScale
  var yAxis = d3.axisRight(yScale);

  // an x-axis based on the domain and range set in xScale
  var xAxis = d3.axisBottom().scale(xScale)
  //yeah in exponential form. use "d" for normal years
  .tickFormat(d3.format('d'));

  //svg element with xAxis attributes applied
  var xSVG = container.append('g').call(xAxis).attr('id', 'x-axis').attr('transform', 'translate(60, 400)');

  //svg element with yAxis attributes applied
  var ySVG = container.append('g').call(yAxis).attr('id', 'y-axis').attr('transform', 'translate(60, 0)');

  //create bars from scaled GDP array
  var bars = d3.select('svg').selectAll('rect').data(scaledGDP).enter().append('rect');
  //data data-date and data-gdp attributed to attach to each bar
  bars.attr('data-date', function (d, i) {
    return data.data[i][0];
  }).attr('data-gdp', function (d, i) {
    return data.data[i][1];
  });
  //set bar width
  bars.attr('class', 'bar').attr('x', function (d, i) {
    return i * barWidth;
  });
  //set bar height
  bars.attr('y', function (d, i) {
    return height - d;
  }).attr('width', barWidth).attr('height', function (d) {
    return d;
  });

  //figure out how to alternate the colors?
  // .style('fill', '#33adff')
  //shift bars over to align with y-axis
  bars.attr('transform', 'translate(60, 0)');

  bars.on("mouseover", function (d, i) {
    popup.transition()
    //  .duration(200)
    .style('opacity', .9);
    popup.attr('data-date', data.data[i][0]).html("Year: " + years[i] + " GDP: $" + GDP[i] + " billion");
  });
  bars.on("mouseout", function (d) {
    popup.transition()
    //.duration(200)
    .style('opacity', 0);
  });
});