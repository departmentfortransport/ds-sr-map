// Modules

var tip = require('d3-tip');

// Data Variables

var mapUrl = 'https://raw.githubusercontent.com/departmentfortransport/geojson/master/british-isles.geojson';
var dataUrl = 'https://raw.githubusercontent.com/departmentfortransport/ds-sr-map/master/out/locs_out.json?token=AQcJMOSB1lpNSxfdx54WUhz3WjM7japgks5ZNp6XwA%3D%3D';

// Dimensions variables

var width = $('#map1-container').width();
var height = 1000;

// Tooltip variables

var tooltip = tip()
	.attr('class', 'd3-tooltip')
	.offset([-10, 0])
	.html(function(d) {
		return "<strong>Latitude:</strong> <span style='color:red'>" + d.LatFinal + "</span><br/>" +
			   "<strong>Longitude:</strong> <span style='color:red'>" + d.LongFinal + "</span><br/>" +
			   "<strong>Category:</strong> <span style='color:red'>" + d.DfTCat + "</span><br/>" +
			   "<strong>Outcome:</strong> <span style='color:red'>" + d.TaskingOutcome + "</span><br/>"
		;
	});



// Defining & Rendering the map

var map1 = d3.select("#map1-container").append("svg")
    .attr("width", width)
    .attr("height", height);

map1.call(tooltip);							// Initialise the tooltip

d3.json(mapUrl, function(error, json) {		// Calulating & rendering the json

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
		.attr("class","map1")
		.attr("d", path(json))
		.attr("fill","#d3df9a")
		.attr("stroke", "#41423b")
		.attr("stroke-width", "0.3");

 	// Rendering the location data

	d3.json(dataUrl, function(error, data) {

		map1.selectAll("dot")
			.data(data)
			.enter()
			.append("circle", "dot")
			.attr("r", 3)
			.attr("fill","steelblue")
			.attr('fill-opacity', 0.5)
			.attr("stroke", "#41423b")
			.attr("stroke-width","0.3")
			.attr("transform", function(d) {
				return "translate(" + projection([
					d.LongFinal,
					d.LatFinal
				]) + ")"
			})

			// Mousover Interactivity

			// .on("mouseover", function(d) {
			// 	d3.select(this)
			// 		.transition()
			// 	    .duration(100)
			// 	    .attr("r", 10)
			// 	    .attr('fill-opacity', 1)

			// })


			// Tooltip Interactivity
    	
    		.on("mouseover", function(d) {

				tooltip.show(d);

        		d3.select(this)
		        	.transition()
				    .duration(100)
				    .attr("r", 10)
				    .attr('fill-opacity', 1)
    		})


			// Mouseout Interactivity

			.on("mouseout", function(d) {

				d3.select(this)
					.transition()
				    .duration(100)
				    .attr("r", 3)
				    .attr('fill-opacity', 0.5)

        			tooltip.hide();
			})

	});

});

