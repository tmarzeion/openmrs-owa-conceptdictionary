angular
	.module('conceptDictionaryApp')
	.controller('DatatypeDetailsController', DatatypeDetailsController);
		
	DatatypeDetailsController.$inject = 
		['$scope', 'loadDataType', '$routeParams', 'openmrsRest']
	
	function DatatypeDetailsController($scope, loadDataType, $routeParams, openmrsRest){
		
		var vm = this;
		
		vm.singleDataType = loadDataType;
	}