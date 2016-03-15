export default angular
	.module('conceptDictionaryApp')
	.controller('DataTypesDetailsController', DataTypesDetailsController)
	.name;
		
	DataTypesDetailsController.$inject = 
		['$scope', 'loadDataType', '$routeParams', 'openmrsRest']
	
	function DataTypesDetailsController($scope, loadDataType, $routeParams, openmrsRest){
		
		var vm = this;
		
		vm.singleDataType = loadDataType;
	}