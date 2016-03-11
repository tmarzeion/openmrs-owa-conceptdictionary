var conceptDictControllers = angular.module('conceptDictControllers', ['openmrs']);

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
