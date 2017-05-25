var webpack = require('webpack');
var path = require('path');

module.exports = {

	module: {
		rules: [
			{
				test: /\.txt$/,
				use: 'raw-loader'
			}
		]
	},

	plugins: [

	new webpack.ProvidePlugin({
		  d3: 'd3',
		  topojson: 'topojson',
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