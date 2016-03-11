var conceptDictControllers = angular.module('conceptDictControllers', ['openmrs.resources']);

conceptDictControllers.controller('ClassesListCtrl', 
		['$scope', 'loadClasses', 'ClassesService', '$location', '$route', '$routeParams', 'openmrsRest',
        function($scope, loadClasses, ClassesService, $location, $route, $routeParams, openmrsRest) {


	$scope.classes = loadClasses;
	//loadClasses is resolve function, it returns array of concept class objects using ClassesService service
		
	$scope.go = function ( hash ) {
		$location.path( hash );
	};
	
	//holds objects of selected checkboxes
	$scope.selected = {};
	
	//deletes selected classes
	$scope.deleteSelected = function(){
	    angular.forEach($scope.selected, function(key,value){
	        if(key){
	        	openmrsRest.remove('conceptclass', {uuid : value});
	        }
	            
	    });
	    //updates classes list in scope after deletion
	    ClassesService.getAll().then(function(data) {
	    	$scope.classes = data;
	    	$route.reload();});
	}

	$scope.classAdded = $routeParams.classAdded;
}]);

conceptDictControllers.controller('ClassesEditCtrl', ['$scope', 'ClassesService', '$routeParams', '$location', 'openmrsRest', 
                                                      function($scope, ClassesService, $routeParams, $location, openmrsRest ) {
		openmrsRest.getFull('conceptclass', {uuid: $routeParams.classUUID}).then(function(respond){
			$scope.singleClass = respond;
		});
      
      $scope.class = {
  		name : '',
  		description : ''
  		};
      
      $scope.responseMessage = '';
      
      $scope.redirectToList = function() {
  		$location.path('/class-list').search({classAdded: $scope.class.name});
  	  };
  	  
  	  $scope.editClass = function() {
  		 $scope.class.name = $scope.singleClass.name;
  		 $scope.class.description = $scope.singleClass.description;
  		 $scope.json = angular.toJson($scope.class);

  		 openmrsRest.update('conceptclass', {uuid: $scope.singleClass.uuid}, $scope.json).then(function(success) {
  			 $scope.redirectToList();
  		 }, function(exception) {
  			 $scope.responseMessage = exception.data.error.fieldErrors.name[0].message;
  		 });
  	  };
	
  	  $scope.cancel = function () {
		$scope.class.name = '';
		$location.path('/class-list').search({classAdded: ''});
  	  }
      
  }]);

conceptDictControllers.controller('ClassAddCtrl', ['$scope', 'ClassesService', '$location', 'openmrsRest', 
                                                   function($scope, ClassesService, $location, openmrsRest){

	$scope.class = {
		name:'',
		description:''
	};

	$scope.responseMessage = '';

	$scope.redirectToList = function() {
		$location.path('/class-list').search({classAdded: $scope.class.name});
	};

	$scope.addClass = function() {
		$scope.json = angular.toJson($scope.class);

		openmrsRest.create('conceptclass', $scope.json).then(function(success) {
			$scope.redirectToList();
		}, function(exception) {
			$scope.responseMessage = exception.data.error.fieldErrors.name[0].message;
		});
	};

	$scope.cancel = function () {
		$scope.class.name = ' ';
		$location.path('/class-list').search({classAdded: ''});
	}
}]);

conceptDictControllers.controller('DataTypesListCtrl', ['$scope', 'loadDataTypes', 'DataTypesService', '$routeParams', 'openmrsRest',
                                                        function($scope, loadDataTypes, DataTypesService, $routeParams, openmrsRest){
	$scope.dataTypes = loadDataTypes;		
	
}]);

conceptDictControllers.controller('DataTypesDetailsCtrl', ['$scope', 'DataTypesService', '$routeParams', 'openmrsRest',
                                                        function($scope, DataTypesService, $routeParams, openmrsRest){
	
	openmrsRest.getFull('conceptdatatype', {uuid: $routeParams.dataTypeUUID}).then(function(respond){
		$scope.singleDataType = respond; 
	});
	
	
}]);
conceptDictControllers.controller('ConceptViewCtrl', ['$scope', 'loadConcept', '$q', '$location', 'ConceptLocaleService',
                                               function($scope, loadConcept, $q, $location, ConceptLocaleService){ 
	//resolves promise of fetching concept from server
	$q.all(loadConcept).then(function(response){
		$scope.concept = loadConcept;
		$scope.locales = ConceptLocaleService.getLocales($scope.concept.names, $scope.concept.descriptions)
		$scope.checkType();
		$scope.goLocale($scope.concept.name.locale);
	});
	
	//conceptLocale holds names and description of Concept within selected locale
	$scope.conceptLocale = {};
	//inserts descriptions and names for specified locale into conceptLocale, parsed from concept tables,
	$scope.goLocale = function (locale) {
		$scope.conceptLocale.description = ConceptLocaleService.getLocaleDescr($scope.concept.descriptions, locale);
		$scope.conceptLocale.names = ConceptLocaleService.getLocaleNames($scope.concept.names, locale);
	}
	//checks datatype of concept to determine 
	$scope.checkType = function(){
		$scope.isNumeric = ($scope.concept.datatype.display == "Numeric");
		$scope.isCoded = ($scope.concept.datatype.display == "Coded");
	}
	//
	$scope.goToConcept = function(hash){
		$location.path("/concept/"+hash);
	}
}]);
conceptDictControllers.controller('ConceptSearchCtrl', ['$scope', 'ConceptsService', function($scope, ConceptsService) {
	$scope.query='';
	$scope.enableDescription = false;
	$scope.concepts='';
	$scope.isUserTyping = false;
	$scope.searchNotification = 'Searching...';
	$scope.noSearchInputNotification = 'Type query to search panel to find concepts';

	//Default values
	$scope.entriesPerPage = 5;
	$scope.pageNumber = 1;
	$scope.resultNotification = '';

	$scope.loadingMorePages = false;

	//Page changing
	$scope.nextPage = function () {
		$scope.pageNumber++;
	};
	$scope.prevPage = function () {
		$scope.pageNumber--;
	};
	$scope.firstPage = function () {
		$scope.pageNumber = 1;
	};
	$scope.lastPage = function () {
		$scope.pageNumber = Math.floor($scope.concepts.length/$scope.entriesPerPage)+1;
	};


	$scope.updateResultNotification = function () {
		if ($scope.isUserTyping) {
			$scope.resultNotification = '';
		}
		else {
			$scope.resultNotification = 'There is no concept named ' + $scope.query;
		}
	};

	// Method used to prevent app from querying server with every letter input into search query panel
	var timeout = null;
	$scope.timeoutRefresh = function() {
		clearTimeout(timeout);
		$scope.isUserTyping = true;
		timeout = setTimeout(function () {
			$scope.refreshResponse();
		}, 250);
	};

	$scope.refreshResponse = function() {
		$scope.firstPage();
		$scope.isUserTyping = false;

		if ($scope.query.length>0) {
			ConceptsService.getFirstPageQueryConcepts($scope.query, $scope.entriesPerPage).then(function (firstResponse) {
				$scope.loadingMorePages = true;
				$scope.concepts = firstResponse.results;
				$scope.updateResultNotification();

				ConceptsService.getQueryConcepts($scope.query).then(function (response) {
					$scope.concepts = response.results;
					$scope.updateResultNotification();
					$scope.loadingMorePages = false;
				});
			});
		}
		else {
			$scope.$apply(function () {
				$scope.concepts='';
			});
		}
	};
}]);