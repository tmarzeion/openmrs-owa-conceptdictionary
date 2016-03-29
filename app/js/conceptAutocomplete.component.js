(function(){
	'use strict';
	
	angular
		.module('conceptDictionaryApp')
		.component('conceptAutoComplete', {
			  templateUrl: 'partials/concept-autocomplete.html',
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
		vm.isCorrect;
		vm.concept;
		vm.newConcept;
		
		vm.search = search;
		vm.checkInput = checkInput;
		
		function checkInput(){
			var display = vm.searchText;
			if(typeof vm.searchText.display !== "undefined"){
				display = vm.searchText.display;
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
			if(typeof vm.searchText.display !== "undefined"){
				display = vm.searchText.display;
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