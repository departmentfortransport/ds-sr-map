// Modules

var tip = require('d3-tip');
var d3legend = require('d3-svg-legend');

// Data Variables

var mapUrl = 'https://raw.githubusercontent.com/departmentfortransport/geojson/master/british-isles.geojson';
var dataUrl = 'https://raw.githubusercontent.com/departmentfortransport/ds-sr-map/master/out/locs_out.json';
var baseUrl = 'https://raw.githubusercontent.com/departmentfortransport/ds-sr-map/master/out/bases.json';

// Dimensions variables

var width = $('#map1-container').width();
var height = 800;
var active = d3.select(null);
var rSize = 4;
var sqSize = 10;

// Tooltip variables


var locsTooltip = tip()
	.attr('class', 'd3-tooltip')
	.offset([-10, 0])
	.html(function(d) {
		return "Base: <span style='color:#bbd1e3'>" + d.base + "</span><br/>" +
			   "Latitude: <span style='color:#bbd1e3'>" + d.lat + "</span><br/>" +
			   "Longitude: <span style='color:#bbd1e3'>" + d.long + "</span><br/>" +
			   "Category: <span style='color:#bbd1e3'>" + d.category + "</span><br/>" +
			   "Duration: <span style='color:#bbd1e3'>" + d.duration + " mins</span><br/>" +		   
			   "Outcome: <span style='color:#bbd1e3'>" + d.outcome + "</span><br/>"
		;
	});

var basesTooltip = tip()
	.attr('class', 'd3-tooltip')
	.offset([-10, 0])
	.html(function(d) {
		return "Base: <span style='color:#bbd1e3'>" + d.base + "</span><br/>" +
			   "Total Taskings: <span style='color:#bbd1e3'>" + d.taskings + "</span><br/>" +
			   "Land Taskings: <span style='color:#bbd1e3'>" + d.landTaskings + "</span><br/>" +
			   "Coast Taskings: <span style='color:#bbd1e3'>" + d.coastTaskings + "</span><br/>" +
			   "Maritime Taskings: <span style='color:#bbd1e3'>" + d.maritimeTaskings + "</span><br/>"
		;
	});


// Functions

function clicked (d) {

  if (active.node() === this) return reset();
  active.classed("active", false);
  active = d3.select(this).classed("active", true);

  var bounds = path.bounds(d),
      dx = bounds[1][0] - bounds[0][0],
      dy = bounds[1][1] - bounds[0][1],
      x = (bounds[0][0] + bounds[1][0]) / 2,
      y = (bounds[0][1] + bounds[1][1]) / 2,
      scale = Math.max(10, Math.min(8, 0.9 / Math.max(dx / width, dy / height))),
      offset = [width / 2 - scale * x, height / 2 - scale * y];

  map1.transition()
      .duration(750)
      .call( zoom.transform, d3.zoomIdentity.translate(offset[0],offset[1]).scale(scale) ); // updated for d3 v4
}

function zoomed () {

	zoomVar = d3.event.transform.k;

	g.style("stroke-width", 1.5 / zoomVar + "px");
	g.attr("transform", d3.event.transform)

	g2.style("stroke-width", 1.5 / zoomVar + "px");
	g2.attr("transform", d3.event.transform);

	// Re-rendering the chart line

	g.select("path")
		.attr("stroke-width", 0.3 / zoomVar)

	// Re-rendering the Chart Objects

	g.selectAll("circle")
		.attr("r", rSize / zoomVar)
		.attr("stroke-width", 0.3 / zoomVar)

		.on("mouseover", function(d) {

			locsTooltip.show(d);

    		d3.select(this)
	        	.transition()
			    .duration(100)
			    .attr("r", rSize / zoomVar * 2)
    		})

			// Mouseout Interactivity

			.on("mouseout", function(d) {

				locsTooltip.hide(); 

				d3.select(this)
					.transition()
				    .duration(100)
				    .attr("r", rSize / zoomVar)
			})

		g2.selectAll("circle")
			.attr("r", rSize / zoomVar * 1.5)

}

function reset() {

  active.classed("active", false);
  active = d3.select(null);

  map1.transition()
      .duration(750)
      .call( zoom.transform, d3.zoomIdentity ); 
}

function stopped() {
	if (d3.event.defaultPrevented) d3.event.stopPropagation();
}

// Defining & Rendering the map

var map1 = d3.select("#map1-container")
	.append("svg")
    .attr("width", width)
    .attr("height", height)
    .on("click", stopped, true);

map1.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .on("click", reset);

var g = map1.append("g");
var g2 = map1.append("g");

var zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on("zoom", zoomed);

map1.call(zoom); 							// Initialise the zoom
map1.call(locsTooltip);						// Initialise the tooltip
map1.call(basesTooltip);					// Initialise the tooltip

d3.json(mapUrl, function(error, json) {		// Calulating & rendering the json

	if (error) return console.warn(error);

	// Initial path calculation

	var center = d3.geoCentroid(json)
	var offset = [width/2, height/2];
	var scale  = 2000;

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

	g.attr("fill","#ff0000")

	g.append("path")
		.attr("class","map1")
		.attr("d", path(json))
		.attr("fill","#d3df9a")
		.attr("stroke", "#41423b")
		.attr("stroke-width", "0.3");

 	// Rendering the location data

	d3.json(dataUrl, function(error, data) {

		// Search & rescue locations

		g.selectAll("dot")
			.data(data)
			.enter()
			.append("circle", "dot")
			.attr("r", rSize)
			.attr("fill", function (d) {
				return d.color
			})
			//.attr('fill-opacity', 0.5)
			.attr("stroke", "#41423b")
			.attr("stroke-width","0.3")
			.attr("transform", function(d) {
				return "translate(" + projection([
					d.long,
					d.lat
				]) + ")"
			})

			// Tooltip Interactivity
    	
    		.on("mouseover", function(d) {

				locsTooltip.show(d);

        		d3.select(this)
		        	.transition()
				    .duration(100)
				    .attr("r", rSize * 2)
				    //.attr('fill-opacity', 1)
    		})


			// Mouseout Interactivity

			.on("mouseout", function(d) {

				d3.select(this)
					.transition()
				    .duration(100)
				    .attr("r", rSize)

 	       		locsTooltip.hide(); 
			})
	});


	// Rendering the bases data

	// d3.json(baseUrl, function(error, data) {		// Calulating & rendering the json

	// 	if (error) return console.warn(error);

	// 		g2.selectAll("square")
	// 			.data(data)
	// 			.enter()
	// 			.append("circle", "square")
	// 			.attr("r", function () {
	// 				return rSize * 1.5
	// 			})
	// 			.attr("height",sqSize)
	// 			.attr("fill", "#000")
	// 			//.attr('fill-opacity', 0.5)
	// 			.attr("stroke", "#41423b")
	// 			.attr("stroke-width","0.3")
	// 			.attr("transform", function(d) {
	// 				return "translate(" + projection([
	// 					d.long,
	// 					d.lat
	// 				]) + ")"
	// 			})

	// 			// Tooltip Interactivity
    	
 //    			.on("mouseover", function(d) {

	// 				basesTooltip.show(d);

	//         		d3.select(this)
	// 		        	.transition()
	// 				    .duration(100)
	// 				    .attr("fill", "#ff0000")

	//     		})

	// 		// Mouseout Interactivity

	// 		.on("mouseout", function(d) {

	// 			d3.select(this)
	// 				.transition()
	// 			    .duration(100)
	// 				.attr("fill", "#000")

 //        			basesTooltip.hide(); 
	// 		})
	// });

});

// Append an opaque SVG on which to place the legend

map1.append("g")
	.attr("class", "legendLocs")
	.attr("transform", "translate(20,28)")
	.attr("fill", "#000");

// // Placing the legend

d3.select(".legendLocs")
	.append("rect")
	.attr("transform", "translate(-10,-18)")
	.attr("fill","#fff")
	.attr("fill-opacity","1")
	.attr("stroke","#000")
	.attr("width","120")
	.attr("height","235");

map1.append("g")
	.attr("class", "legendBases")
	.attr("transform", "translate(27,251)")


// Legend

var ordinalLocs = d3.scaleOrdinal()
  .domain(['Caernarfon', 'Humberside', 'Sumburgh', 'Inverness', 'Lee On Solent', 'Lydd', 'Newquay', 'Portland', 'Prestwick', 
  	'St Athan', 'Stornoway'])
  .range(['rgb(0,153,169)', 'rgb(98,167,15)', 'rgb(0,130,202)', 'rgb(210,95,21)', 'rgb(0,149,59)', 'rgb(201,146,18)', 'rgb(102,194,203)', 'rgb(84,86,91)',
			 'rgb(130,130,130)', 'rgb(228,159,115)', 'rgb(233,190,113)']);


var legendLocs = d3legend.legendColor()
						    .shape("path", d3.symbol().type(d3.symbolCircle).size(150)())	
						    .shapePadding(5)
							.title("SARH Bases")
  							.scale(ordinalLocs);


map1.select(".legendLocs")
   .call(legendLocs);


// var ordinalBases = d3.scaleOrdinal()
//    .domain (['Base'])
//    .range(['rgb(0,0,0)']);

// var legendBases = d3legend.legendColor()
// 						    .shape("path", d3.symbol().type(d3.symbolSquare).size(125)())
// 						    .shapePadding(30)
// 						    .cellFilter(function(d){ return d.label !== "e" })
//   							.scale(ordinalBases);

// map1.select(".legendBases")
//    .call(legendBases);

