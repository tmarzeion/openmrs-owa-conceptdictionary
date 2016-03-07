var conceptDictControllers = angular.module('conceptDictControllers', []);

conceptDictControllers.controller('ClassesListCtrl', ['$scope', 'loadClasses', '$location', '$routeParams', function($scope, loadClasses, $location, $routeParams) {
	$scope.classes = loadClasses;
	//loadClasses is resolve function, it returns array of concept class objects using ClassesService service
		
	$scope.go = function ( hash ) {
		$location.path( hash );
	};

	$scope.classAdded = $routeParams.classAdded;
}]);

conceptDictControllers.controller('ClassesEditCtrl', ['$scope', 'ClassesService', '$routeParams',  function($scope, ClassesService, $routeParams ) {
      $scope.singleClass = ClassesService.getClass({uuid : $routeParams.classUUID});
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

