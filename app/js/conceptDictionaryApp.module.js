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
                        	controllerAs: 'vm',
                        	resolve: {
                        		concept : loadConcept,
                        		serverLocales: serverLocales
                        	}
                        }).
                        otherwise({
                          redirectTo: '/class-list'
                        });
                    }]);

function loadConcept ($route, openmrsRest){
	return openmrsRest.getFull('concept',
			{uuid : $route.current.params.conceptUUID});
};
function serverLocales(openmrsRest){
	return openmrsRest.getFull('systemsetting',{q : 'locale.allowed.list'})
					  .then(function(response){
						  return response.results[0].value.split(", ");
					  });
};




