/* global __dirname */
"use strict";

var gulp = require("gulp"),
  shell = require("gulp-shell"),
  rimraf = require("rimraf"),
  project = require("./project.json");

var karma = require('karma');

var paths = {};
paths.webroot = "./wwwroot/";
paths.testConfig = "/Test/config";

gulp.task('dnx-watch', shell.task(['dnx-watch web']));
gulp.task('dnx', shell.task(['dnx web']));

gulp.task("test", function(done){

  var config = {
      configFile: __dirname + paths.testConfig + '/karma.conf.js',
      singleRun: true
  }

  var server = new karma.Server(
    config, 
    function() {
        done();
    }
  )
  server.start();
  
});
