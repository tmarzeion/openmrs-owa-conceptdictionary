/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
(function(){
	'use strict';
	
	angular
		.module('conceptDictionaryApp')
		.controller('DrugsListController', DrugsListController);
		
	DrugsListController.$inject = 
		['loadDrugs', 'loadRetiredDrugs', '$location', 'openmrsRest', '$routeParams'];
		
	function DrugsListController(loadDrugs, loadRetiredDrugs, $location, openmrsRest, $routeParams){
		
		var vm = this;
		
        vm.links = {};
        vm.links["Concept Drug Management"] = "drug/";

		vm.drugsList;
		vm.retiredOn = false;
		
		vm.gotToAddDrugPage = gotToAddDrugPage;
		vm.toggleRetire = toggleRetire;
		vm.activate = activate;
		
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