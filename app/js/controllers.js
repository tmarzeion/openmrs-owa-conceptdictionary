var conceptDictControllers = angular.module('conceptDictControllers', []);

conceptDictControllers.controller('ClassesListCtrl', ['$scope', 'loadClasses', '$location', function($scope, loadClasses, $location) {
	$scope.classes = loadClasses;
		
	$scope.go = function ( hash ) {
		$location.path( hash );
	};
		

}]);

conceptDictControllers.controller('ClassesEditCtrl', ['$scope', 'ClassesService', '$routeParams',  function($scope, ClassesService, $routeParams ) {
      $scope.singleClass = ClassesService.getClass({uuid : $routeParams.classUUID});
  }]);

conceptDictControllers.controller('ClassAddCtrl', ['$scope', function($scope){
	
}]);

