// My example

// var width = 960,
//     height = 1160;

// var projection = d3.geoMercator()
//     .scale(500)
//     .translate([width / 2, height / 2]);

// var path = d3.geoPath()
//     .projection(projection);

// var svg = d3.select("body").append("svg")
//     .attr("width", width)
//     .attr("height", height);

// var json = d3.json("data/bi.json", function(error, bi) {
//   svg.append("path")
//       //.datum(topojson.feature(bi, bi.objects.arcs))
//       .attr("d", path);
// });

// console.log(json);
 




// UK Example



var width = $('#map1-container').width();
var height = 1100;

var projection = d3.geoMercator()
    .scale(width / 2 / Math.PI)
    .translate([width / 2, height / 2]);

var result = width / 2 / Math.PI;

console.log(result);

var path = d3.geoPath()
    .projection(projection);

var svg = d3.select("#map1-container").append("svg")
    .attr("width", width)
    .attr("height", height);

      // d3.json("nld.json", function(json) {
      // // create a first guess for the projection
      // var center = d3.geo.centroid(json)
      // var scale  = 150;
      // var offset = [width/2, height/2];
      // var projection = d3.geo.mercator().scale(scale).center(center)
      //     .translate(offset);

d3.json("data/uk.json", function(error, uk) {
  svg.append("path")
      .datum(topojson.feature(uk, uk.objects.subunits))
      .attr("d", path);
      //.center(d3.geo.centroid(json));
});








// US Example 

// var width = 960,
//     height = 500;

// var projection = d3.geoAlbersUsa();
// var path = d3.geoPath()
//     .projection(projection);

// var svg = d3.select("body").append("svg")
//     .attr("width", width)
//     .attr("height", height);

// d3.json("data/us.json", function(error, us) {

//   svg.append("path")
//       .attr("class", "states")
//       .datum(topojson.feature(us, us.objects.states))
//       .attr("d", path);

  
// });