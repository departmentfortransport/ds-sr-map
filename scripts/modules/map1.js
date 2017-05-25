// var margin = {top: 20, right: 20, bottom: 30, left: 50};
// var width = $('#map1-container').width() - margin.left - margin.right;
// var height = 600;
// var url = 'https://bost.ocks.org/mike/map/uk.json';

//var topojson = require('topojson');

import mapData from '../modules/data/mapData.txt';
var url = 'http://enjalot.github.io/wwsd/data/world/world-110m.geojson';
// var url = 'https://bost.ocks.org/mike/map/uk.json';
//var url = 'https://raw.githubusercontent.com/departmentfortransport/geojson/master/british-isles.json';

console.log(url)

var width = $('#map1-container').width();
var height = 1160;

var projection = d3.geoMercator()
    .scale(width / 2 / Math.PI)
    //.scale()
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

d3.json(url, function(error, input) {
	if (error) return console.warn(error);
	svg.append("path")
	.attr("d", path(input))
});

