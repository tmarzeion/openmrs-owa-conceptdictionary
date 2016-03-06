var conceptDictControllers = angular.module('conceptDictControllers', []);

conceptDictControllers.controller('ClassesListCtrl', ['$scope', 'loadClasses', '$location', function($scope, loadClasses, $location) {
	$scope.classes = loadClasses;
	//loadClasses is resolve function, it returns array of concept class objects using ClassesService service
		
	$scope.go = function ( hash ) {
		$location.path( hash );
	};
		

}]);

conceptDictControllers.controller('ClassesEditCtrl', ['$scope', 'ClassesService', '$routeParams',  function($scope, ClassesService, $routeParams ) {
      $scope.singleClass = ClassesService.getClass({uuid : $routeParams.classUUID});
  }]);

conceptDictControllers.controller('ClassAddCtrl', ['$scope', function($scope){
	
}]);

