// Import data

var locData = require('./locData');

console.log(locData.data);

// Render Map

var url = 'https://raw.githubusercontent.com/departmentfortransport/geojson/master/british-isles.geojson';
var width = $('#map1-container').width();
var height = 1000;

var map1 = d3.select("#map1-container").append("svg")
    .attr("width", width)
    .attr("height", height);

d3.json(url, function(error, json) {		// Calulating & rendering the json

	if (error) return console.warn(error);

	// Initial path calculation

	var center = d3.geoCentroid(json)
	var offset = [width/2, height/2];
	var scale  = 150;

	projection = d3.geoMercator()
					.scale(scale)
					.center(center)
					.translate(offset);

	var path = d3.geoPath()
	    .projection(projection);		// Creating the path


	// Enhanced path calculation

	var bounds  = path.bounds(json);
	var hscale  = scale * width  / (bounds[1][0] - bounds[0][0]);
	var vscale  = scale * height / (bounds[1][1] - bounds[0][1]);
	var scale   = (hscale < vscale) ? hscale : vscale;
	var offset  = [width - (bounds[0][0] + bounds[1][0])/2,height - (bounds[0][1] + bounds[1][1])/2];

	projection = d3.geoMercator()
					.scale(scale)
					.center(center)
					.translate(offset);

	path = path.projection(projection);	// Appending the enhanced values to the path

	// Rendering the map

	map1.append("path")
		.attr("d", path(json))

	// Appending a boundary box

	// map1.append("rect")
	// 	.attr('width', width)
	// 	.attr('height', height)
 	// 	.style('stroke', 'black').style('fill', 'none');

 	// Rendering the location data

 	

	d3.json(locData.data, function(error, data) {

	});

});

