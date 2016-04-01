/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
module.exports = function(config) {
  var configuration = {

    basePath: './',

    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-resource/angular-resource.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/angular-strap/dist/angular-strap.js',
      'bower_components/angular-translate/angular-translate.js',
      'bower_components/angular-translate-loader-partial/angular-translate-loader-partial.js',
      'app/components/conceptDictionaryApp.module.js',
      'app/components/translateApp.module.js',
      'app/components/**/*.js',
      'test/unit/**/*.js',
	  'app/**/*.spec.js'
    ],

    autoWatch: true,

    frameworks: ['jasmine'],

    browsers: ['Chrome'],

    plugins: [
      'karma-chrome-launcher',
      'karma-jasmine',
      'karma-coverage'
    ],
//TODO: fix minification issue on debuging
//    preprocessors: {
//      'app/**/*.js': ['coverage']
//    },

    reporters: ['progress'],//, 'coverage'],

    coverageReporter: {
      type: 'lcov',
      dir: 'coverage/',
//	  instrumenterOptions : {
//		istanbul : {
//			noCompact : true
//		}
//	  }
    },

    junitReporter: {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    },

    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    }

  }

  if (process.env.TRAVIS) {
    configuration.browsers = ['Chrome_travis_ci'];
  }

  config.set(configuration);
};
