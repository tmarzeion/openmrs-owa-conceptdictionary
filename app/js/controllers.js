var conceptDictControllers = angular.module('conceptDictControllers', []);

conceptDictControllers.controller('ClassesListCtrl', ['$scope', 'Classes', function($scope, Classes) {
	  $scope.classObj = Classes.query();	 
	  
	}]);

