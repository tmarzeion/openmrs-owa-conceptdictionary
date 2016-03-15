(function(){
	'use strict';
	
	angular
		.module('conceptDictionaryApp')
		.controller('DrugAddController', DrugAddController)
		
	DrugAddController.$inject = 
		['$location', 'openmrsRest']
	
	function DrugAddController($location, openmrsRest){
		
		var vm = this;
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
                $location.path('/drugs-list');
            }, function(exception) {
            	vm.showMessage = true;
                vm.responseMessage = exception.data.error.message;
            });
		}
		
		function redirectToList(){
			$location.path('/drugs-list');
		}
		
	};
	
})();