module.exports = function(config) {
  var configuration = {

    basePath: './',

    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-resource/angular-resource.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/angular-strap/dist/angular-strap.js',
      'app/components/conceptDictionaryApp.module.js',
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
