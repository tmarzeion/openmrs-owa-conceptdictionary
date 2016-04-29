/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

export default function conceptDictionaryAppConfig($routeProvider, openmrsRest ) {
      $routeProvider.
	  when('/class', {
		  template: require('./classList/classList.html'),
		  controller: 'ClassListController',
		  controllerAs: 'vm'
	  }).
	  when('/class/add', {
		  template: require('./classEdit/classEdit.html'),
		  controller: 'ClassEditController',
		  controllerAs: 'vm',
		  resolve: {
			  singleClass : function(){
				  return {name: '', description: ''};
			  }
		  }
	  }).
	  when('/class/:classUUID', {
		  template: require('./classEdit/classEdit.html'),
		  controller: 'ClassEditController',
		  controllerAs: 'vm',
		  resolve: {
			  singleClass : loadClass
		  }
	  }).
	  when('/concept', {
            template: require('./conceptSearch/conceptSearch.html'),
            controller: 'ConceptSearchController',
            controllerAs: 'vm'
      }).
	  when('/reference', {
		    template: require('./referenceSearch/referenceSearch.html'),
		    controller: 'ReferenceSearchController',
		    controllerAs: 'vm'
	  }).
	  when('/source', {
		    template: require('./sourceList/sourceList.html'),
		    controller: 'SourcesListController',
		    controllerAs: 'vm'
	  }).
	  when('/source/add', {
		  template: require('./sourceEdit/sourceEdit.html'),
		  controller: 'SourceEditController',
		  controllerAs: 'vm',
		  resolve: {
			  sources : function(){
				  return {};
			  }
		  }
	  }).
	  when('/source/:sourceUUID', {
		  template: require('./sourceEdit/sourceEdit.html'),
		  controller: 'SourceEditController',
		  controllerAs: 'vm',
		  resolve: {
			  sources : loadSource
		  }
	  }).
      when('/conceptstopword/add', {
      	  template: require('./conceptStopWordAdd/conceptStopWordAdd.html'),
      	  controller: 'ConceptStopWordAddController',
      	  controllerAs: 'vm',
		  resolve: {
			  serverLocales : serverLocales
		  }
      }).
	  when('/conceptstopword', {
		    template: require('./conceptStopWordList/conceptStopWordList.html'),
		    controller: 'ConceptStopWordListController',
		    controllerAs: 'vm'
	  }).
      when('/datatype', {
        	template: require('./datatypeList/datatypeList.html'),
            controller: 'DatatypeListController',
        	controllerAs: 'vm',
            resolve: { 
              	 loadDataTypes : loadDataTypes
            }
      }).
      when('/datatype/:dataTypeUUID', {
        	template: require('./datatypeDetails/datatypeDetails.html'),
        	controller: 'DatatypeDetailsController',
        	controllerAs: 'vm',
        	resolve: {
        		loadDataType : loadDataType
        	}
      }).
      when('/concept/add/', {
        	template: require('./conceptAdd/conceptAdd.html'),
        	controller: 'ConceptAddController',
        	controllerAs: 'vm',
        	resolve: {
        		concept: function(){
  				  	return {};
  			  	},
        		serverLocales: serverLocales,
        		loadClasses : loadClasses,
        		loadDataTypes : loadDataTypes
        	}
      }).
      when('/concept/edit/:conceptUUID', {
      	template: require('./conceptAdd/conceptAdd.html'),
      	controller: 'ConceptAddController',
      	controllerAs: 'vm',
      	resolve: {
      		concept: loadConcept,
      		serverLocales: serverLocales,
      		loadClasses : loadClasses,
      		loadDataTypes : loadDataTypes
      	}
      }).
	  when('/reference/add', {
		  template: require('./referenceEdit/referenceEdit.html'),
		  controller: 'ReferenceEditController',
		  controllerAs: 'vm',
		  resolve: {
			  sources : loadSources,
			  reference : function(){
				  return {};
			  }
		  }
	  }).
	  when('/reference/:referenceUUID/', {
		    template: require('./referenceEdit/referenceEdit.html'),
		    controller: 'ReferenceEditController',
		    controllerAs: 'vm',
		    resolve: {
			    reference : loadReference,
				sources : loadSources
		    }
	  }).
      when('/concept/:conceptUUID/', {
        	template: require('./conceptView/concept.html'),
        	controller: 'ConceptViewController',
        	controllerAs: 'vm',
        	resolve: {
        		concept : loadConcept,
        		serverLocales: serverLocales
        	}
      }).
      when('/drug', {
        	template: require('./drugList/drugList.html'),
        	controller: 'DrugsListController',
        	controllerAs: 'vm'
      }).
      when('/drug/add', {
		  template:  require('./drugEdit/drugEdit.html'),
		  controller: 'DrugEditController',
        	controllerAs: 'vm',
		  resolve: {
			  loadDrug: function(){
				  return {};
			  }
		  }
      }).
      when('/drug/:drugUUID', {
        	template:  require('./drugEdit/drugEdit.html'),
        	controller: 'DrugEditController',
        	controllerAs: 'vm',
        	resolve: {
        		loadDrug: loadDrug
        	}
      }).
      otherwise({
		  redirectTo: '/',
		  template:  require('./indexMenu/indexMenu.html'),
		  controller: 'IndexMenuController',
		  controllerAs: 'vm'
	  });
      
      loadConcept.$inject = ['$route', 'openmrsRest'];
      function loadConcept ($route, openmrsRest){
    	  return openmrsRest.getFull('concept',
    			  {uuid : $route.current.params.conceptUUID});
      };
      
      serverLocales.$inject = ['openmrsRest'];
      function serverLocales(openmrsRest){
    	  return openmrsRest.getFull('systemsetting',{q : 'locale.allowed.list'})
    	  .then(function(response){
    		  return response.results[0].value.split(", "); 
    	  });
      };
      loadClasses.$inject = ['openmrsRest'];
      function loadClasses(openmrsRest){
    	  return openmrsRest.listFull('conceptclass', {includeAll: true});
      };
      loadDataTypes.$inject = ['openmrsRest'];
      function loadDataTypes (openmrsRest){
    	  return openmrsRest.listFull('conceptdatatype');
      };
      loadSources.$inject = ['openmrsRest'];
      function loadSources (openmrsRest){
    	  return openmrsRest.listFull('conceptsource', {includeAll : true});
      };
      loadSource.$inject = ['$route', 'openmrsRest'];
      function loadSource ($route, openmrsRest){
    	  return openmrsRest.getFull('conceptsource',
    			  {uuid: $route.current.params.sourceUUID});
      };
      loadConceptStopWords.$inject = ['openmrsRest'];
      function loadConceptStopWords (openmrsRest){
    	  return openmrsRest.listFull('conceptstopword');
      };
      loadClass.$inject = ['$route', 'openmrsRest'];
      function loadClass ($route, openmrsRest){
    	  return openmrsRest.getFull('conceptclass',
    			  {uuid: $route.current.params.classUUID});
      };
      loadDataType.$inject = ['$route', 'openmrsRest'];
      function loadDataType ($route, openmrsRest){
    	  return openmrsRest.getFull('conceptdatatype', 
    			  {uuid: $route.current.params.dataTypeUUID});
      };
      loadReference.$inject = ['$route', 'openmrsRest'];
      function loadReference ($route, openmrsRest){
    	  return openmrsRest.getFull('conceptreferenceterm',
    			  {uuid: $route.current.params.referenceUUID});
      };
      loadDrugs.$inject = ['openmrsRest'];
      function loadDrugs (openmrsRest){
    	  return openmrsRest.listFull('drug', {includeAll: true});
      };
      loadDrug.$inject = ['$route', 'openmrsRest'];
      function loadDrug($route, openmrsRest){
    	  return openmrsRest.getFull('drug', 
    			  {uuid: $route.current.params.drugUUID});
      }
};

