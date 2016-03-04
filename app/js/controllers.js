var conceptDirControllers = angular.module('conceptDirControllers', []);

conceptDirControllers.controller('ClassesListCtrl', ['$scope', 'Classes', function($scope, Classes) {
	  $scope.classObj = Classes.query();
	}]);