var conceptDictionary = angular.module('conceptDictionary', 
		['ngRoute', 'conceptDictControllers', 'conceptDictServices', 'openmrs.resources']);

conceptDictionary.config(['$routeProvider',
                    function($routeProvider, openmrsRest) {
                      $routeProvider.
                        when('/concept-search', {
                            templateUrl: 'partials/concept-search.html',
                            controller: 'ConceptSearchCtrl'
                        }).
                        when('/class-list', {
                          templateUrl: 'partials/class-list.html',
                          controller: 'ClassesListCtrl',
                          resolve: {
                        	  loadClasses : function(openmrsRest){
                        		  return openmrsRest.listFull('conceptclass', {});
                        	  }
                          }
                        //resolve clause makes sure that $resource is resolved
                        //before getting into scope
                        }).
                        when('/class-list/add-class', {
                        	templateUrl: 'partials/class-add.html',
                            controller: 'ClassAddCtrl' 
                        }).
                        when('/class-list/:classUUID', {
                        	templateUrl: 'partials/class-edit.html',
                        	controller: 'ClassesEditCtrl',
                        }).
                        when('/datatype-list', {
                        	templateUrl: 'partials/datatype-list.html',
                            controller: 'DataTypesListCtrl', 
                            resolve: {
                              	 loadDataTypes : function(openmrsRest){
                              		 return openmrsRest.listFull('conceptdatatype', {});
                              	 }
                            }
                        }).
                        when('/datatype-list/:dataTypeUUID', {
                        	templateUrl: 'partials/datatype-details.html',
                        	controller: 'DataTypesDetailsCtrl',
                        }).
                        when('/concept/:conceptUUID/', {
                        	templateUrl: 'partials/concept.html',
                        	controller: 'ConceptViewCtrl',
                        	resolve: {
                        		loadConcept : function($route, ConceptsService){
                        			return ConceptsService.getConcept({uuid : $route.current.params.conceptUUID});
                        		}
                        	}
                        }).
                        otherwise({
                          redirectTo: '/class-list'
                        });
                    }]);




