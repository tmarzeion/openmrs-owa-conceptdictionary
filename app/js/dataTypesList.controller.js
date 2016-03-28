angular
	.module('conceptDictionaryApp')
	.controller('DataTypesListController', DataTypesListController);
	
	DataTypesListController.$inject = 
		['$scope', '$routeParams', 'openmrsRest'];
		
	function DataTypesListController($scope, $routeParams, openmrsRest){

		var vm = this;
		
		vm.currentPageResults;
		
		vm.isNext;
		vm.isPrev;
		
		vm.dataTypeList = [];
		
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