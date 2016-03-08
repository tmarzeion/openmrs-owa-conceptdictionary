/**
 * The contents of this file are subject to the OpenMRS Public License
 * Version 1.0 (the "License"); you may not use this file except in
 * compliance with the License. You may obtain a copy of the License at
 * http://license.openmrs.org
 * Software distributed under the License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the
 * License for the specific language governing rights and limitations
 * under the License.
 * Copyright (C) OpenMRS, LLC.  All Rights Reserved.
 */
// generated on 2016-03-02 using generator-openmrs-owa 0.1.0
'use strict';

var fs = require('fs');
var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var del = require('del');
var mainBowerFiles = require('main-bower-files');
var wiredep = require('wiredep').stream;
var browserSync = require('browser-sync').create();

var plugins = gulpLoadPlugins();

var THIS_APP_ID = 'conceptdictionary';

var htmlGlob = ['app/**/*.html'];
var resourcesGlob = ['app/**/*.{png,svg,jpg,gif}', 'app/**/*.{css,less}',
  'app/**/*.js', 'app/manifest.webapp', /* list extra resources here */ ];

var Server = require('karma').Server;

/**
 * Run test once and exit
 */
gulp.task('test', function (done) {
  new Server({
    configFile: __dirname + '/test/karma.conf.js',
    singleRun: true
  }, done).start();
});
gulp.task('test-debug', function (done) {
	  new Server({
	    configFile: __dirname + '/test/karma.conf.js',
	    singleRun: false
	  }, done).start();
	});

gulp.task('copy-bower-packages', function() {
  try {
    fs.statSync('bower_components');

    return gulp.src(mainBowerFiles(), {
      base: 'bower_components'
    }).pipe(gulp.dest('dist/lib'));
  } catch (err) {
    // Don't panic
  }
});

gulp.task('html', ['copy-bower-packages'], function() {
  try {
    fs.statSync('bower_components');

    // User wiredep to automagically link bower packages
    return gulp.src(htmlGlob).pipe(wiredep({
      ignorePath: '../bower_components/',
      fileTypes: {
        html: {
          replace: {
            js: '<script src="lib/{{filePath}}"></script>',
            css: '<link rel="stylesheet" href="lib/{{filePath}}" />'
          }
        }
      }
    })).pipe(gulp.dest('dist'));
  } catch (err) {
    return gulp.src(htmlGlob)
      .pipe(gulp.dest('dist'));
  }
});

gulp.task('resources', function() {
  return gulp.src(resourcesGlob)
    .pipe(gulp.dest('dist'));
});

gulp.task('browser-sync-reload', ['deploy-local'], function() {
  browserSync.reload();
});

gulp.task('watch', function() {
  // forget about all the error checking for now
  var config = require('./config.json');

  browserSync.init({
    proxy: {
      target: config.APP_ENTRY_POINT
    }
  });

  gulp.watch('app/**/*.*', ['browser-sync-reload']);
});

gulp.task('deploy-local', ['build'], function() {
    var config;
    var localOwaFolder;

	try {
	  //Will throw exception when there is no config.json file
  	  config = require('./config.json');
      //Will throw exception when data in config.json is corrupted
	  localOwaFolder = config.LOCAL_OWA_FOLDER;
	} catch (err) {
	  //Create or override config.json file
	  var LOCAL_OWA_FOLDER_DEFAULT = "C:\\\\Users\\\\user\\\\openmrs\\\\conceptdictionary\\\\owa\\\\";
	  var JSON_CONFIG_PATTERN_DEFAULT =
	       "{\n" +
	       "\"LOCAL_OWA_FOLDER\": " + "\"" + LOCAL_OWA_FOLDER_DEFAULT + "\"" +
  	       "\n}";
      var stream = fs.createWriteStream("config.json");
      stream.once('open', function() {
      stream.write(JSON_CONFIG_PATTERN_DEFAULT);
      stream.end();

      //Variables fixed
      config = require('./config.json');
      localOwaFolder = config.LOCAL_OWA_FOLDER;
      })
    } finally {
      // Result
      return gulp.src(['dist/**/*', '!*.zip'])
            .pipe(gulp.dest(localOwaFolder + THIS_APP_ID));
    }
});

gulp.task('build', ['resources', 'html'], function() {
  return gulp.src('dist/**/*')
    .pipe(plugins.zip(THIS_APP_ID + '.zip'))
    .pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['dist']));

gulp.task('default', ['clean'], function() {
  gulp.start('build');
});
