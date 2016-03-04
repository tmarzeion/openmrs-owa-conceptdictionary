var conceptDictionary = angular.module('conceptDictionary', 
		['ngRoute', 'conceptDirControllers', 'conceptDirServices']);

conceptDictionary.config(['$routeProvider',
                    function($routeProvider) {
                      $routeProvider.
                        when('/class-list', {
                          templateUrl: 'partials/class-list.html',
                          controller: 'ClassesListCtrl'
                        }).
                        otherwise({
                          redirectTo: '/class-list'
                        });
                    }]);