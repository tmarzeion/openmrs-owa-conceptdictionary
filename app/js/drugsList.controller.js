(function(){
	'use strict';
	
	angular
		.module('conceptDictionaryApp')
		.controller('DrugsListController', DrugsListController)
		
	DrugsListController.$inject = 
		['loadDrugs', '$location', 'openmrsRest', '$routeParams']
		
	function DrugsListController(loadDrugs, $location, openmrsRest, $routeParams){
		
		var vm = this;
		
		vm.drugList;
		vm.retiredOn = false;
		
		vm.gotToAddDrugPage = gotToAddDrugPage;
		vm.toggleRetire = toggleRetire;
		
		activate();
		
		function activate(){
			vm.drugsList = loadDrugs;
		}
		
		function toggleRetire(){
			if(!vm.retiredOn){
				vm.drugsList = [];
				openmrsRest.listFull('drug', {includeAll: true}).then(function(response){
					vm.drugsList = response;
					vm.retiredOn = true;
				});
			}else{
				vm.drugsList = [];
				activate();
				vm.retiredOn = false;
			}
			
		}
			
		
		function gotToAddDrugPage(hash){
			$location.path(hash);
		}
		
	};
	
})();