/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
conceptUniqueName.$inject = ['openmrsRest']

	
export default function conceptUniqueName(openmrsRest){
	var vm = this;	
		
	vm.concepts =[];
	vm.isDuplicate;
	vm.concept;
	
	vm.search = search;
	vm.checkInput = checkInput;
	
	function checkInput(){
		var display = vm.name;
		if(angular.isDefined(vm.concepts)){
			for(var i=0; i<vm.concepts.length; i++){
				//check for duplicates except concept in edition
				if(display === vm.concepts[i].display && vm.conceptUuid!=vm.concepts[i].uuid){
					vm.isDuplicate = true;
				}
			}
		}
		else {
			vm.isDuplicate = false;
		}
	}
	
	function search(){
		var maxResults = 0;
		vm.isDuplicate = false;
		if(angular.isDefined(vm.name)){
			var display = vm.name;
	
			if(display.length > 1){
				openmrsRest.listFull('concept',{q: display, includeAll: true}).then(function (response){
					vm.concepts = response.results;
					vm.checkInput();
					vm.onUpdate({isCorrect: !vm.isDuplicate, name: vm.name, suggestions: vm.suggestions});
				});	
				
			}else{
				vm.concepts = [];
				vm.checkInput();
				vm.onUpdate({isCorrect: !vm.isDuplicate, name: vm.name, suggestions: vm.suggestions});
			}	
		}
		else{
			vm.concepts = [];
			vm.onUpdate({isCorrect: false, name: vm.name, suggestions: vm.suggestions});
		}
		
	}
	
}
