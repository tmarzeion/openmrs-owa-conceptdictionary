var conceptDictServices = angular.module('conceptDictServices', ['ngResource']);

var OPENMRS_CONTEXT_PATH = "openmrs"


conceptDictServices.factory('Classes',['$resource', function($resource){
     					return $resource(
     							'/'+OPENMRS_CONTEXT_PATH+'/ws/rest/v1/conceptclass/:uuid?:mode', {}, 
     							//Returns all classes as results object
     								{getAll: {method:'GET', params:{mode :'v=full'}, isArray:false},
     							//Returns single class
     								 getClass: {method: 'GET', isArray:false }});
				}])
				   .factory('ClassesService', ['Classes', function(Classes){
					   return{
						   /**
						    * unwraps results object
						    * @returns array of concept class objects
						    */
						   getAll: function(){
							   return Classes.getAll().$promise.then(function(response){
								   return response.results;
							   });
						   },
						   /**
						    * fetches single concept class
						    * @param uuid the uuid of concept class which will be fetched
						    * @returns concept class object
						    */
						   getClass: function(uuid){
							   return Classes.getClass(uuid);
						   }
						   //wraps Classes.getClass function
					   }
				   }]);