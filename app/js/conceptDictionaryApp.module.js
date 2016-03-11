angular
    .module('conceptDictionaryApp',
		['ngRoute', 'conceptDictServices', 'openmrs'])

.config(['$routeProvider',
                    function($routeProvider, openmrsRest) {
                      $routeProvider.
                        when('/concept-search', {
                            templateUrl: 'partials/concept-search.html',
                            controller: 'ConceptSearch'
                        }).
                        when('/class-list', {
                          templateUrl: 'partials/class-list.html',
                          controller: 'ClassesList',
                          resolve: {
                        	  loadClasses : function(openmrsRest){
                        		  return openmrsRest.listFull('conceptclass');
                        	  }
                          }
                        //resolve clause makes sure that $resource is resolved
                        //before getting into scope
                        }).
                        when('/class-list/add-class', {
                        	templateUrl: 'partials/class-add.html',
                            controller: 'ClassAdd'
                        }).
                        when('/class-list/:classUUID', {
                        	templateUrl: 'partials/class-edit.html',
                        	controller: 'ClassesEdit',
                        }).
                        when('/datatype-list', {
                        	templateUrl: 'partials/datatype-list.html',
                            controller: 'DataTypesList',
                            resolve: {
                              	 loadDataTypes : function(openmrsRest){
                              		 return openmrsRest.listFull('conceptdatatype');
                              	 }
                            }
                        }).
                        when('/datatype-list/:dataTypeUUID', {
                        	templateUrl: 'partials/datatype-details.html',
                        	controller: 'DataTypesDetails',
                        }).
                        when('/concept/:conceptUUID/', {
                        	templateUrl: 'partials/concept.html',
                        	controller: 'ConceptView',
                        	resolve: {
                        		loadConcept : function($route, ConceptsService){
                        			return ConceptsService.getConcept({uuid : $route.current.params.conceptUUID});
                        		},
                        		loadLocales: function(LocalesService){
                        			return LocalesService.getLocales();
                        		}
                        	}
                        }).
                        otherwise({
                          redirectTo: '/class-list'
                        });
                    }]);




