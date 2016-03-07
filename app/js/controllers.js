var conceptDictControllers = angular.module('conceptDictControllers', []);

conceptDictControllers.controller('ClassesListCtrl', ['$scope', 'loadClasses', 'ClassesService', '$location', 
                                                      function($scope, loadClasses, ClassesService, $location) {
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
	    //reloads the page ($route.reload doesn't get updated list)
	    location.reload();
	}
}]);

conceptDictControllers.controller('ClassesEditCtrl', ['$scope', 'ClassesService', '$routeParams',  function($scope, ClassesService, $routeParams ) {
      $scope.singleClass = ClassesService.getClass({uuid : $routeParams.classUUID});
  }]);

conceptDictControllers.controller('ClassAddCtrl', ['$scope', function($scope){
	
}]);

