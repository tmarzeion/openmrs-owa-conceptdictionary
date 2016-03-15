angular
	.module('conceptDictionaryApp')
	.controller('DataTypesListController', DataTypesListController);
	
	DataTypesListController.$inject = 
		['$scope', 'loadDataTypes', '$routeParams', 'openmrsRest'];
		
	function DataTypesListController($scope, loadDataTypes, $routeParams, openmrsRest){
		var vm = this;
		
		vm.dataTypes = loadDataTypes;		
	}