// styles.js

var gulp = require('gulp'); 
var rename = require('gulp-rename');                              
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssvars = require('postcss-simple-vars');
var nested = require('postcss-nested');
var cssimport = require('postcss-import');

gulp.task('styles', function () {
    return gulp.src('./styles/styles.css')                          // Takes your source PostCSS file
        .pipe(postcss([cssimport, autoprefixer, cssvars, nested,])) // Applies the relevent PostCSS packages to convert your file to 'regular' CSS
        .on('error', function (errorInfo) {
            console.log(errorInfo.toString());
            this.emit('end');                                       // Allows error handling and stops Gulp from stopping 
        })
        .pipe(rename('Compiled.css'))
        .pipe(gulp.dest('./temp'))									// Saves it in the Destination file
});