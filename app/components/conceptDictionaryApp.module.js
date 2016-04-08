/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
angular
    .module('conceptDictionaryApp',
		['translateApp', 'ngRoute', 'openmrs', 'mgcrea.ngStrap.typeahead',
		 'openmrs-contrib-uicommons.header', 'openmrs-contrib-uicommons.breadcrumbs'])

	.config(['$routeProvider', conceptDictionaryAppConfig])
	
function conceptDictionaryAppConfig($routeProvider, openmrsRest) {
      $routeProvider.
	  when('/class', {
		  templateUrl: 'components/classList/classList.html',
		  controller: 'ClassListController',
		  controllerAs: 'vm',
		  resolve: {
			  loadClasses : loadClasses
		  }
	  }).
	  when('/class/add', {
		  templateUrl: 'components/classAdd/classAdd.html',
		  controller: 'ClassAddController',
		  controllerAs: 'vm'
	  }).
	  when('/class/:classUUID', {
		  templateUrl: 'components/classEdit/classEdit.html',
		  controller: 'ClassEditController',
		  controllerAs: 'vm',
		  resolve: {
			  singleClass : loadClass
		  }
	  }).
	  when('/concept', {
            templateUrl: 'components/conceptSearch/conceptSearch.html',
            controller: 'ConceptSearchController',
            controllerAs: 'vm'
      }).
	  when('/reference', {
		    templateUrl: 'components/referenceSearch/referenceSearch.html',
		    controller: 'ReferenceSearchController',
		    controllerAs: 'vm'
	  }).
	  when('/source', {
		    templateUrl: 'components/sourceList/sourceList.html',
		    controller: 'SourcesListController',
		    controllerAs: 'vm',
		    resolve: {
			    sources : loadSources
		    }
	  }).
	  when('/source/add', {
		    templateUrl: 'components/sourceAdd/sourceAdd.html',
		    controller: 'SourceAddController',
		    controllerAs: 'vm'
	  }).
      when('/conceptstopword/add', {
      	  templateUrl: 'components/conceptStopWordAdd/conceptStopWordAdd.html',
      	  controller: 'ConceptStopWordAddController',
      	  controllerAs: 'vm',
		  resolve: {
			  serverLocales : serverLocales
		  }
      }).
	  when('/reference/add', {
	  	  templateUrl: 'components/referenceAdd/referenceAdd.html',
	  	  controller: 'ReferenceAddController',
	  	  controllerAs: 'vm',
		  resolve: {
			  sources : loadSources
		  }
	  }).
	  when('/conceptstopword', {
		    templateUrl: 'components/conceptStopWordList/conceptStopWordList.html',
		    controller: 'ConceptStopWordListController',
		    controllerAs: 'vm',
		    resolve: {
			    loadConceptStopWords : loadConceptStopWords
		    }
	  }).
      when('/datatype', {
        	templateUrl: 'components/datatypeList/datatypeList.html',
            controller: 'DatatypeListController',
        	controllerAs: 'vm',
            resolve: { 
              	 loadDataTypes : loadDataTypes
            }
      }).
	  when('/source/:sourceUUID', {
		    templateUrl: 'components/sourceEdit/sourceEdit.html',
		    controller: 'SourceEditController',
		    controllerAs: 'vm', 
		    resolve: {
			    sources : loadSource
		    }
	  }).
      when('/datatype/:dataTypeUUID', {
        	templateUrl: 'components/datatypeDetails/datatypeDetails.html',
        	controller: 'DatatypeDetailsController',
        	controllerAs: 'vm',
        	resolve: {
        		loadDataType : loadDataType
        	}
      }).
      when('/concept/add/', {
        	templateUrl: 'components/conceptAdd/conceptAdd.html',
        	controller: 'ConceptAddController',
        	controllerAs: 'vm',
        	resolve: {
        		serverLocales: serverLocales,
        		loadClasses : loadClasses,
        		loadDataTypes : loadDataTypes
        	}
      }).
	  when('/reference/:referenceUUID/', {
		    templateUrl: 'components/referenceEdit/referenceEdit.html',
		    controller: 'ReferenceEditController',
		    controllerAs: 'vm',
		    resolve: {
			    reference : loadReference,
				sources : loadSources
		    }
	  }).
      when('/concept/:conceptUUID/', {
        	templateUrl: 'components/conceptView/concept.html',
        	controller: 'ConceptViewController',
        	controllerAs: 'vm',
        	resolve: {
        		concept : loadConcept,
        		serverLocales: serverLocales
        	}
      }).
      when('/drug', {
        	templateUrl: 'components/drugList/drugList.html',
        	controller: 'DrugsListController',
        	controllerAs: 'vm',
        	resolve: {
        		loadDrugs : loadDrugs
        	}
      }).
      when('/drug/add', {
        	templateUrl: 'components/drugAdd/drugAdd.html',
        	controller: 'DrugAddController',
        	controllerAs: 'vm'
      }).
      when('/drug/:drugUUID', {
        	templateUrl: 'components/drugEdit/drugEdit.html',
        	controller: 'DrugEditController',
        	controllerAs: 'vm',
        	resolve: {
        		loadDrug: loadDrug
        	}
      }).
      otherwise({
		  redirectTo: '/',
		  templateUrl: 'components/indexMenu/indexMenu.html'
	  });
};


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
function loadClasses(openmrsRest){
	  return openmrsRest.listFull('conceptclass', {includeAll: true});
};
function loadDataTypes (openmrsRest){
	  return openmrsRest.listFull('conceptdatatype');
};
function loadSources (openmrsRest){
	return openmrsRest.listFull('conceptsource', {includeAll : true});
};
function loadSource ($route, openmrsRest){
	return openmrsRest.getFull('conceptsource',
		{uuid: $route.current.params.sourceUUID});
};
function loadConceptStopWords (openmrsRest){
	return openmrsRest.listFull('conceptstopword');
};
function loadClass ($route, openmrsRest){
	return openmrsRest.getFull('conceptclass',
			{uuid: $route.current.params.classUUID});
};
function loadDataType ($route, openmrsRest){
	return openmrsRest.getFull('conceptdatatype', 
			{uuid: $route.current.params.dataTypeUUID});
};
function loadReference ($route, openmrsRest){
	return openmrsRest.getFull('conceptreferenceterm',
		{uuid: $route.current.params.referenceUUID});
};
function loadDrugs (openmrsRest){
	return openmrsRest.listFull('drug', {includeAll: true});
};
function loadDrug($route, openmrsRest){
	return openmrsRest.getFull('drug', 
			{uuid: $route.current.params.drugUUID});
}