angular
	.module('conceptDictionaryApp')
	.controller('DataTypesListController', DataTypesListController);
	
	DataTypesListController.$inject = 
		['$scope', 'loadDataTypes', '$routeParams', 'openmrsRest'];
		
	function DataTypesListController($scope, loadDataTypes, $routeParams, openmrsRest){
		var vm = this;
		
		vm.previousPageResults;
		vm.currentPageResults;
		vm.nextPageResults;
		
		vm.isNext;
		vm.isPrev;
		
		vm.dataTypeList;
		
		vm.activate = activate;
		vm.nextPage = nextPage;
		vm.prevPage = prevPage;
		
		activate({limit: 10});
		
		function activate(param){
			openmrsRest.listFull('conceptdatatype', param).then(function(res) {
				vm.currentPageResults = res;
				vm.isNext = res.hasNext();
				vm.isPrev = res.hasPrevious();
				vm.dataTypeList = res.results;
			});
		};
		
		function nextPage(){
			activate(vm.currentPageResults.nextQuery);
		}
		function prevPage(){
			activate(vm.currentPageResults.previousQuery)
		}
		
	}