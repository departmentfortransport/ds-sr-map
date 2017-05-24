var webpack = require('webpack');
var path = require('path');

module.exports = {

	plugins: [

	new webpack.ProvidePlugin({
		  $: 'jquery',
		  jQuery: 'jquery',
		})
	],

	entry: "./js/app.js",					// Where webpack starts looking
	output: {
		path: path.resolve(__dirname, 'temp'),
		filename: "final.js"
	}
}