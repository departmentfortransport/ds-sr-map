var webpack = require('webpack');
var path = require('path');

module.exports = {

	plugins: [

	new webpack.ProvidePlugin({
		  d3: 'd3',
		  $: 'jquery',
		  jQuery: 'jquery',
		})
	],


	entry: "./scripts/App.js",
	output: {
		path: path.resolve(__dirname, 'temp'),
		filename: "Compiled.js"
	}
}