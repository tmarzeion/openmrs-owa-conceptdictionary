/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
// generated on 2016-03-02 using generator-openmrs-owa 0.1.0
'use strict';

var fs = require('fs');
var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var del = require('del');
var mainBowerFiles = require('main-bower-files');
var wiredep = require('wiredep').stream;
var gutil = require('gulp-util');
var browserSync = require('browser-sync').create();
var eslint = require('gulp-eslint');

var plugins = gulpLoadPlugins();

var THIS_APP_ID = 'conceptdictionary';

var htmlGlob = ['app/**/*.html'];
var resourcesGlob = ['app/**/*.{png,svg,jpg,gif}', 'app/**/*.{css,less}',
  'app/**/*.js', '!app/**/*.spec.js', 'app/manifest.webapp', /* list extra resources here */
];

var Server = require('karma').Server;

var getConfig = function() {
  var config;

  try {
    // look for config file
    config = require('./config.json');
  } catch (err) {
    // create file with defaults if not found
    config = {
      'LOCAL_OWA_FOLDER': 'C:\\\\Users\\\\user\\\\openmrs\\\\conceptdictionary\\\\owa\\\\'
    };

    fs.writeFile('config.json', JSON.stringify(config), function(err) {
      if (err) {
        return gutil.log(err);
      }
      gutil.log("Default config file created");
    });

  } finally {
    return config;
  }
}

/**
 * Run test once and exit
 */
gulp.task('test', ['lint'], function(done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});
gulp.task('test-debug', function(done) {
  new Server({
    configFile: __dirname + '/karma.debug.conf.js',
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

gulp.task('deploy-local', ['build-local'], function() {
  var config = getConfig();

  return gulp.src(['dist/**/*', '!*.zip'])
    .pipe(gulp.dest(config.LOCAL_OWA_FOLDER + THIS_APP_ID));
});

gulp.task('build-local', ['resources', 'html'], function() {
  return gulp.src('dist/**/*')
    .pipe(gulp.dest('dist'));
});


gulp.task('build', ['resources', 'html'], function() {
  return gulp.src('dist/**/*')
    .pipe(plugins.zip(THIS_APP_ID + '.zip'))
    .pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['dist']));

gulp.task('lint', function() {
  return gulp.src('app/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}); 

gulp.task('default', ['clean', 'test'], function() {
  gulp.start('build');
});
