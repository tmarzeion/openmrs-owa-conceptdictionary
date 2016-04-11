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
		['loadDrugs', '$location', 'openmrsRest'];
		
	function DrugsListController(loadDrugs, $location, openmrsRest){
		
		var vm = this;
		
        vm.links = {};
		vm.links["Concept Dictionary"] = "";
        vm.links["Concept Drug Management"] = "drug/";

		vm.drugsList;
		vm.retiredOn = false;
		
		vm.gotToAddDrugPage = gotToAddDrugPage;
		vm.activate = activate;
		vm.retire = retire;
		vm.unretire = unretire;
		vm.purge = purge;

		function retire(item) {
			openmrsRest.retire('drug', {uuid: item.uuid}).then(function(data) {
				openmrsRest.listFull('drug', {includeAll: true}).then(function(data) {
					vm.drugsList = data.results;
				});
			});
		}

		function unretire(item) {
			openmrsRest.unretire('drug', {uuid: item.uuid}).then(function(data) {
				openmrsRest.listFull('drug', {includeAll: true}).then(function(data) {
					vm.drugsList = data.results;
				});
			});
		}

		function purge(item) {
			openmrsRest.purge('drug', {uuid: item.uuid}).then(function(data) {
				openmrsRest.listFull('drug', {includeAll: true}).then(function(data) {
					vm.drugsList = data.results;
				});
			});


		}
		
		activate();
		
		function activate() {
			vm.drugsList = loadDrugs.results;
		}
			
		
		function gotToAddDrugPage(hash){
			$location.path(hash);
		}
		
	};
	
})();