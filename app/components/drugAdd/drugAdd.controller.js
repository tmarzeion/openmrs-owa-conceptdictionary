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
		.controller('DrugAddController', DrugAddController)
		
	DrugAddController.$inject = 
		['$location', 'openmrsRest'];
	
	function DrugAddController($location, openmrsRest){
		
		var vm = this;
		
        vm.links = {};
        vm.links["Concept Drug Management"] = "drug/";
        vm.links["Concept Drug Form"] = "drug/add/";

		vm.concept = {
				display: ''
		};
		
		vm.dosageForm = {
				display: ''
		};
		
		vm.route = {
				display: ''
		};
		
		vm.limitToDrugs = true;
		
		
		vm.name;
		vm.combination = false;
		vm.strength;
		vm.minDose;
		vm.maxDose;
		vm.Drug;
		
		vm.responseMessage;
		
		vm.isConceptCorrect = false;
		vm.isDosageCorrect = true;
		vm.isRouteCorrect = true;

		vm.showMessage;
		
		vm.redirectToList = redirectToList;
		vm.checkConcept;
		vm.saveDrug = saveDrug;
		vm.updateConcept = updateConcept;
		vm.updateDosageForm = updateDosageForm;
		vm.updateRoute = updateRoute;
		vm.isCorrect = isCorrect;
		
		function isCorrect(){
			return !(vm.isConceptCorrect && vm.isDosageCorrect && vm.isRouteCorrect);
		}
		
		function updateConcept(isCorrect, concept) {
		    vm.isConceptCorrect = isCorrect;
		    vm.concept = concept;
		 };
		 function updateDosageForm(isCorrect, concept){
			 vm.isDosageCorrect = isCorrect;
			 vm.dosageForm = concept;
		 }
		 function updateRoute(isCorrect, concept){
			 vm.isRouteCorrect = isCorrect;
			 vm.route = concept;
		 }
		
				
		function saveDrug(){
			vm.Drug = {
			  name: vm.name,  
			  concept: vm.concept.uuid,
			  combination: vm.combination.toString(),
			  dosageForm: vm.dosageForm.uuid,
			  strength: vm.strength,
			  minimumDailyDose: vm.minimumDailyDose,
			  maximumDailyDose: vm.maximumDailyDose,
			  route: vm.route.uuid,
			  retired: vm.retired
			}
			
			openmrsRest.create('drug', vm.Drug).then(function(success) {
				vm.responseMessage = success;
                $location.path('/drug');
            }, function(exception) {
            	vm.showMessage = true;
                vm.responseMessage = exception.data.error.message;
            });
		}
		
		function redirectToList(){
			$location.path('/drug');
		}
		
	};
	
})();