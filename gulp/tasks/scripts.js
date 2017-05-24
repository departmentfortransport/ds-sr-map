var gulp = require('gulp');
var webpack = require('webpack');

gulp.task('scripts', function (callback) {
	webpack(require('../../webpack.config.js'), function () {
		console.log('logged');
		callback();
	});
})