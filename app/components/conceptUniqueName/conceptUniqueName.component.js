
angular
	.module('conceptDictionaryApp')
	.component('conceptUniqueName', {
		  templateUrl: 'components/conceptUniquename/conceptUniquename.html',
		  controller: conceptUniqueName,
		  controllerAs : 'vm',
		  bindings: {
		    required: '<',
		    concept: '<',
		    onUpdate: '&' 
		  }});

conceptUniqueName.$inject = ['openmrsRest']

	
function conceptUniqueName(openmrsRest){
	var vm = this;
	
	
	vm.searchText = vm.concept.display;
	
		
	vm.concepts =[];
	vm.isDuplicate;
	vm.concept;
	
	vm.search = search;
	vm.checkInput = checkInput;
	
	vm.$onChanges = function(changesObj){
		vm.searchText = changesObj.concept.currentValue.display;
		vm.isCorrect = false;
	}
	
	function checkInput(){
		var display = vm.searchText;

		for(var i=0; i<vm.concepts.length; i++){
			if(display === vm.concepts[i].display){
				vm.isDuplicate = true;
			}else{
				break;
			}
		}
	}
	
	function search(){
		var maxResults = 0;
		vm.isDuplicate = false;
		if(angular.isDefined(vm.searchText)){
			var display = vm.searchText;
	
			if(display.length > 1){
				openmrsRest.listFull('concept',{q: display, includeAll: true}).then(function (response){
					vm.concepts = response.results;
					vm.checkInput();
					vm.onUpdate({isCorrect: !vm.isDuplicate, name: vm.searchText, suggestions: vm.suggestions});
				});	
				
			}else{
				vm.concepts = [];
				vm.checkInput();
				vm.onUpdate({isCorrect: !vm.isDuplicate, name: vm.searchText, suggestions: vm.suggestions});
			}	
		}
		else{
			vm.concepts = [];
			vm.onUpdate({isCorrect: false, name: vm.searchText, suggestions: vm.suggestions});
		}
		
	}
	
}
