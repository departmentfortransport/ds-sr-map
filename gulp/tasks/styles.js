var gulp = require('gulp');											
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssvars = require('postcss-simple-vars');
var nested = require('postcss-nested');
var cssimport = require('postcss-import');
var mixins = require('postcss-mixins');
var rename = require('gulp-rename');

gulp.task('styles', function () {
    return gulp.src('./css/styles.css')									        
		.pipe(postcss([cssimport, mixins, autoprefixer, cssvars, nested]))	    
		.on('error', function (errorInfo) {
			console.log(errorInfo.toString());
			this.emit('end'); 												    
		})
		.pipe(rename('final.css'))
		.pipe(gulp.dest('temp'));								
});