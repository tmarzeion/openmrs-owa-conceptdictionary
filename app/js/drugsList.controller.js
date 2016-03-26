(function(){
	'use strict';
	
	angular
		.module('conceptDictionaryApp')
		.controller('DrugsListController', DrugsListController)
		
	DrugsListController.$inject = 
		['loadDrugs', 'loadRetiredDrugs', '$location', 'openmrsRest', '$routeParams']
		
	function DrugsListController(loadDrugs, loadRetiredDrugs, $location, openmrsRest, $routeParams){
		
		var vm = this;
		
		vm.drugList;
		vm.retiredOn = false;
		
		vm.gotToAddDrugPage = gotToAddDrugPage;
		vm.toggleRetire = toggleRetire;
		
		activate();
		
		function activate(){
			vm.drugsList = loadDrugs.results;
		}
		
		function toggleRetire(){
			if(!vm.retiredOn){
				vm.drugsList = [];
				vm.drugsList = loadRetiredDrugs.results;
				vm.retiredOn = true;
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