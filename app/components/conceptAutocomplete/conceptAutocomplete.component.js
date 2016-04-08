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
		.component('conceptAutoComplete', {
			  templateUrl: 'components/conceptAutocomplete/conceptAutocomplete.html',
			  controller: conceptAutoComplete,
			  bindings: {
			    limitToDrugs: '<',
			    required: '<',
			    concept: '<',
			    onUpdate: '&' 
			  }});
	
	conceptAutoComplete.$inject = ['openmrsRest']
	
		
	function conceptAutoComplete(openmrsRest){
		var vm = this;
		
		
		vm.searchText = vm.concept.display;
		
			
		vm.concepts =[];
		vm.suggestions = [];
		vm.isCorrect = !vm.required; 
		vm.concept;
		vm.newConcept;
		
		vm.search = search;
		vm.checkInput = checkInput;
		
		function checkInput(){
			var display = vm.searchText;
			if(angular.isDefined(vm.searchText)){
				if(angular.isDefined(vm.searchText.display)){
					display = vm.searchText.display;
				}
			}
			if(angular.isUndefined(display)){
				display = '';
			}
			for(var i=0; i<vm.suggestions.length; i++){
				if(display === vm.suggestions[i].display){
					vm.isCorrect = true;
					vm.newConcept = vm.suggestions[i]
					break;
				}else{
					vm.isCorrect = false;
					break;
				}
			} 
			if(display === '' && !vm.required){
				vm.isCorrect = true;
				vm.newConcept = {
						display: ''
				};
			}
		}
		
		
		function search(){
			var maxResults = 0;
			vm.suggestions = [];
			vm.isCorrect = false;
			var display = vm.searchText;
			if(angular.isDefined(vm.searchText)){
				if(angular.isDefined(vm.searchText.display)){
					display = vm.searchText.display;
				}
			}
			if(angular.isUndefined(display)){
				display = '';
			}
			if(display.length > 1){
				openmrsRest.listFull('concept',{q: display, includeAll: true}).then(function (response){
					vm.concepts = response.results;
					for(var i=0; i<vm.concepts.length; i++){
						if((!vm.limitToDrugs) || (vm.concepts[i].conceptClass.display === 'Drug' && vm.limitToDrugs)){
							vm.suggestions.push(vm.concepts[i]);
							maxResults +=1;
							if(maxResults == 5){
								break;
							}
						}				
					}
					vm.checkInput();
					vm.onUpdate({isCorrect: vm.isCorrect, concept: vm.newConcept});
				});	
				
			}else{
				vm.checkInput();
				vm.onUpdate({isCorrect: vm.isCorrect, concept: vm.newConcept});
			}	
			
		}
		
	}
	
		
	
})();