(function(){
	'use strict';
	
	angular
		.module('conceptDictionaryApp')
		.controller('DrugEditController', DrugEditController);
		
	DrugEditController.$inject = 
		['$location', 'openmrsRest', 'loadDrug'];
	
	function DrugEditController($location, openmrsRest, loadDrug){
		
		var vm = this;
		
		vm.drug;
		vm.responseMessage;
		vm.isConceptCorrect = true;
		vm.isDosageCorrect = true;
		vm.isRouteCorrect = true;
		vm.showMessage;
		vm.Drug;
		
		//redirects to drug list after success
		vm.redirectToList = redirectToList;
		//saves the drug 
		vm.saveDrug = saveDrug;
		//update the drug concept with information from component
		vm.updateConcept = updateConcept;
		vm.updateDosageForm = updateDosageForm;
		vm.updateRoute = updateRoute;
		//activates the ctrl
		vm.activate = activate;
		//retire the drug
		vm.retire = retire;
		//unretire the drug
		vm.unRetire = unRetire;
		vm.isCorrect = isCorrect;
		
		vm.activate();
		
		vm.limitToDrugs = true;
		
		
		function activate(){
			vm.drug = loadDrug;
			if(vm.drug.route === null){
				vm.drug.route = {
						display: ''
				};
			};
			if(vm.drug.dosageForm === null){
				vm.drug.dosageForm = {
						display: ''
				};
			};
		};
		
		function retire(){
			openmrsRest.remove('drug', {uuid: vm.drug.uuid}).then(function(success){
				vm.responseMessage = success;
				$location.path('/drug');
			});
		}
		
		function unRetire(){
			vm.drug.retired = false;
			saveDrug();
		}
		
		function isCorrect(){	
			return !(vm.isConceptCorrect && vm.isDosageCorrect && vm.isRouteCorrect);
		}
		
		function updateConcept(isCorrect, concept) {
		    vm.isConceptCorrect = isCorrect;
		    vm.drug.concept = concept;
		 };
		 function updateDosageForm(isCorrect, concept){
			 vm.isDosageCorrect = isCorrect;
			 vm.drug.dosageForm = concept;
		 };
		 function updateRoute(isCorrect, concept){
			 vm.isRouteCorrect = isCorrect;
			 vm.drug.route = concept;
		 };
		 
				
		function saveDrug(){
			vm.Drug = {
			  name: vm.drug.name,  
			  concept: vm.drug.concept.uuid,
			  combination: vm.drug.combination.toString(),
			  dosageForm: vm.drug.dosageForm.uuid,
			  strength: vm.drug.strength,
			  minimumDailyDose: vm.drug.minimumDailyDose,
			  maximumDailyDose: vm.drug.maximumDailyDose,
			  route: vm.drug.route.uuid,
			  retired: vm.drug.retired
			}
			openmrsRest.update('drug', {uuid: vm.drug.uuid}, vm.Drug).then(function(success) {
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