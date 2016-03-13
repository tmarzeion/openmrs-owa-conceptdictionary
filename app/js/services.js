var conceptDictServices = angular.module('conceptDictServices', ['ngResource']);

conceptDictServices
.factory('Util', [function(){
	return {
		/**
		 * @returns string server url
		 */
		getOpenmrsContextPath: function(){
			var pathname = window.location.pathname;
			return pathname.substring(0, pathname.indexOf("/owa/"));
		}
	}
}])
.factory('Classes',['$resource', 'Util', function($resource, Util){
	return $resource(
			Util.getOpenmrsContextPath() + '/ws/rest/v1/conceptclass/:uuid?:mode', {},
			//Returns all classes as results object
				{getAll: {method:'GET', params:{mode : 'v=full'}, isArray:false},
			//Returns single class
				 getClass: {method: 'GET', params:{mode: 'v=full'}, isArray:false },
			//deletes class with specified uuid
				 deleteClass: {method: 'DELETE'},
			//Adds new class
				 addClass: {method: 'POST', isArray:false},
			//Edit existing class
				 editClass: {method: 'POST', isArray:false}});
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
	   },
	   //wraps Classes.getClass function
	   deleteClass: function(uuid){
		   return Classes.deleteClass(uuid);
	   },
	   addClass: function(newClass){
		   return Classes.addClass(newClass).$promise;
	   },
	   editClass: function(uuid, editedClass){
		   return Classes.editClass({uuid: uuid}, editedClass).$promise;
	   }
   }
}])
.factory('DataTypes', ['$resource', 'Util', function($resource, Util){
	return $resource(
			Util.getOpenmrsContextPath() + '/ws/rest/v1/conceptdatatype/:uuid?:mode', {},
			//Returns all datatypes as results object
				{getAll: {method:'GET', params:{mode : 'v=full'}, isArray:false},
			//Returns single datatype
				 getDataType: {method: 'GET', params:{mode: 'v=full'}, isArray:false }});
}])
.factory('DataTypesService', ['DataTypes', function(DataTypes){
	   return{
		   /**
		    * unwraps results object
		    * @returns array of datatypes class objects
		    */
		   getAll: function(){
			   return DataTypes.getAll().$promise.then(function(response){
				   return response.results;
			   });
		   },
		   /**
		    * fetches single datatype
		    * @param uuid the uuid of datatype which will be fetched
		    * @returns datatype object
		    */
		   getDataType: function(uuid){
			   return DataTypes.getDataType(uuid);
		   }
	   }
}])
.factory('Concepts',['$resource', 'Util', function($resource, Util){
   	return $resource(
   			Util.getOpenmrsContextPath()+'/ws/rest/v1/concept/:uuid?:mode', {}, 
   			//Returns single concept
   				 {getConcept: {method: 'GET', params:{mode : 'v=full'}, isArray:false }});
   			//deletes class with specified uuid
}])
.factory('ConceptsService',['Concepts', function(Concepts){
   	return{
   			//Returns single concept
   		getConcept: function(uuid){
   			return Concepts.getConcept(uuid);
   		}}
}])
.factory('Concepts',['$resource', 'Util', function($resource, Util){
	return $resource(
		Util.getOpenmrsContextPath()+'/ws/rest/v1/concept/:uuid?:mode:showRetired:query:limit', {},
		//Returns single concept
		{getConcept: {method: 'GET', params:{mode : 'v=full'}, isArray:false },
		//Returns concepts filtered by query
		getQueryConcepts: {method: 'GET', params:{mode : 'v=full', showRetired : '&includeAll=true'}, isArray:false},
		//Returns first page concepts filtered by query
		getFirstPageQueryConcepts: {method: 'GET', params:{mode : 'v=full', showRetired : '&includeAll=true'}, isArray:false},
		});

}])
.factory('ConceptsService',['Concepts', function(Concepts){
	return{
		//Returns single concept
		getConcept: function(uuid){
			return Concepts.getConcept(uuid);
		},
		//Returns concepts filtered by query
		getQueryConcepts: function(searchTerm){
			searchTerm = '&q=' + searchTerm;
			return Concepts.getQueryConcepts({query: searchTerm}).$promise;
		},
		getFirstPageQueryConcepts: function(searchTerm, entitiesPerPage) {
			searchTerm = '&q=' + searchTerm;
			entitiesPerPage = '&limit=' + entitiesPerPage;
			return Concepts.getFirstPageQueryConcepts({query: searchTerm, limit : entitiesPerPage}).$promise;
		}
	}
}]);
