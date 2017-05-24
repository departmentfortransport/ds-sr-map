// watch.js

var gulp = require('gulp');                         
var watch = require ('gulp-watch');
var webpack = require('webpack');               
var browserSync = require('browser-sync').create();

// Gulp Watch Task

gulp.task('watch', function () {                                    // Gulp-watch detects changes to your file and then performs an action (eg reloading the html page)
    
    // watch .html files
    watch('../**/*.html', function () {                             // 2 Arguments: The file or filder to watch, and what to do when a file changes.
        browserSync.reload();                                       // Input the task to perform (defined above)
    });

    // watch .css files
    watch('./styles/**/*.css', function () {                        // ** will look in all sub directories. *.css will find all css files
        gulp.start('cssInject');                                    // Input the task to perform (defined above)                    
    }); 


    // watch .js files
    watch('./scripts/**/*.js', function () {                        // ** will look in all sub directories. *.css will find all js files
        gulp.start('scriptsRefresh');                                      // Input the task to perform (defined above) 
    });

    // browsersync webserver
    browserSync.init({                                              // BrowserSync creates a web server to watch for changes to our files
        server: {
            notify: false,                                          // Turns off notifications
            baseDir: ""                                             // Directory where index.html sits
        }        
    }); 
});

// CSS Task

gulp.task('cssInject', ['styles'], function () {                    // 2nd arg is a dependency that will run beforehand 

    return gulp.src('./temp/Compiled.css')
        .pipe(browserSync.stream());                                // .stream injects css into the browser

});

// JS Task

gulp.task('scriptsRefresh', ['scripts'], function () {               // 2nd arg is a dependency that will run beforehand
    browserSync.reload();
});

