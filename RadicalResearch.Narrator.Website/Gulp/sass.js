'use strict';
var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function () {
  gulp.src('./Style/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./wwwroot/css'));
});