var conceptDictControllers = angular.module('conceptDictControllers', []);

conceptDictControllers.controller('ClassesListCtrl', 
		['$scope', 'loadClasses', 'ClassesService', '$location', '$route', '$routeParams',
        function($scope, loadClasses, ClassesService, $location, $route, $routeParams) {


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
	        	ClassesService.deleteClass({uuid : value});
	        }
	            
	    });
	    //updates classes list in scope after deletion
	    ClassesService.getAll().then(function(data) {
	    	$scope.classes = data;
	    	$route.reload();});
	}

	$scope.classAdded = $routeParams.classAdded;
}]);

conceptDictControllers.controller('ClassesEditCtrl', ['$scope', 'ClassesService', '$routeParams', '$location',  
                                                      function($scope, ClassesService, $routeParams, $location ) {
      $scope.singleClass = ClassesService.getClass({uuid : $routeParams.classUUID});
      
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

  		 ClassesService.editClass($scope.singleClass.uuid, $scope.json).then(function(success) {
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

conceptDictControllers.controller('ClassAddCtrl', ['$scope', 'ClassesService', '$location', function($scope, ClassesService, $location){

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

		ClassesService.addClass($scope.json).then(function(success) {
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

conceptDictControllers.controller('DataTypesListCtrl', ['$scope', 'loadDataTypes', 'DataTypesService', '$routeParams',
                                                        function($scope, loadDataTypes, DataTypesService, $routeParams){
	$scope.dataTypes = loadDataTypes;		
	
}]);

conceptDictControllers.controller('DataTypesDetailsCtrl', ['$scope', 'DataTypesService', '$routeParams',
                                                        function($scope, DataTypesService, $routeParams){
	
	$scope.singleDataType = DataTypesService.getDataType({uuid : $routeParams.dataTypeUUID});
	
	
}]);
