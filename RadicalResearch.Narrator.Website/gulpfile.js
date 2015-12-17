'use strict';

var gulp = require('gulp');
var requireDir = require('require-dir');

requireDir('./gulp', { recurse: false });

gulp.task('default', [
  'watch'
]);