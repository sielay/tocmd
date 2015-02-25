'use strict';

var gulp = require('gulp'),
    mocha = require('gulp-mocha')


gulp.task('dist', function() {
    gulp.src('./index.js')
        .pipe(mocha());
});