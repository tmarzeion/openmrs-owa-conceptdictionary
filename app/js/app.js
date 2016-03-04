var conceptDictionary = angular.module('conceptDictionary', 
		['ngRoute', 'conceptDictControllers', 'conceptDictServices']);

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