//variables for data
var edUrl = 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json';
var countyUrl = 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json';

function choropleth(edu, county) {
  console.log(edu);
  console.log(county);

  //variables for sizing
  var width = 1200;
  var height = 800;
  var margin = { top: 40, bottom: 60, right: 20, left: 80 };

  //setup tooltip popup
  var tooltip = d3.select("main").append("div").attr("id", "tooltip").style("opacity", 0);
  //create svg add to chart div
  var svg = d3.select("#chart").append('svg').attr('width', width).attr('height', height);

  // set up legend colour ranges
  var colorVals = [{ low: 0, high: 20, hex: '#9EB5FF' }, { low: 20, high: 40, hex: '#7689F2' }, { low: 40, high: 60, hex: '#4F5EE5' }, { low: 60, high: 80, hex: '#2732D8' }, { low: 80, high: 100, hex: '#0007CC' }];

  // get color based on val
  function colorPicker(n) {
    var color = void 0;
    colorVals.forEach(function (d) {
      if (n >= d.low && n < d.high) {
        color = d.hex;
      }
    });
    return color;
  };

  var legend = svg.selectAll('rect').data(colorVals).enter().append('g').attr('id', 'legend').append('rect').attr('x', function (d, i) {
    return 20 * i + 550;
  }).attr('y', height - margin.bottom - margin.top).attr('width', 50).attr('height', 20).style('fill', function (d) {
    return colorPicker(d.low);
  }).attr('stroke', 'black').attr('stroke-width', 0.3);

  //create map
  svg.append('g').selectAll('path').data(topojson.feature(county, county.objects.counties).features) //topojson to geojson for map
  .enter().append('path').attr('class', 'county').attr('stroke', 'black').attr('stroke-width', '0.1px').attr('data-fips', function (d) {
    return d.id;
  }).attr('data-education', function (d) {
    var res = edu.filter(function (ob) {
      return ob.fips == d.id;
    });
    if (res[0]) {
      return res[0].bachelorsOrHigher;
    }
    console.log('could find data for: ', d.id);
    return 0;
  }).style('fill', function (d) {
    var percent = d3.select(this).attr('data-education');
    return colorPicker(percent);
  }).attr('d', d3.geoPath()).on('mouseover', function (d) {
    var mouse = d3.mouse(this);
    tooltip.style('left', mouse[0] + 165 + 'px').style('top', mouse[1] - 70 + 'px').style('opacity', 0.9);
    tooltip.html(function () {
      var res = edu.filter(function (ob) {
        return ob.fips == d.id;
      });
      if (res[0]) {
        return res[0]['area_name'] + ',' + res[0]['state'] + ': ' + res[0].bachelorsOrHigher + '%';
      }
      console.log('could find data for: ', d.id);
      return 0;
    }).attr('data-education', function () {
      var res = edu.filter(function (ob) {
        return ob.fips == d.id;
      });
      if (res[0]) {
        return res[0].bachelorsOrHigher;
      }
      return 0;
    });
  }).on("mouseout", function (d) {
    tooltip.style("opacity", 0);
  });
};
//nested getJSON functions to feed data into choroplethMath function
$.getJSON(edUrl, function (edData) {
  $.getJSON(countyUrl, function (countyData) {
    return choropleth(edData, countyData);
  });
});