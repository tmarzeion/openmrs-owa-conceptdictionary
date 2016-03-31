(function() {
    'use strict';
    
	angular
		.module('conceptDictionaryApp')
		.controller('ConceptAddController', ConceptAddController)
		
	ConceptAddController.$inject = ['serverLocales', 'loadClasses', 'loadDataTypes', 'conceptsService'];
		
	function ConceptAddController(serverLocales, loadClasses, loadDataTypes, conceptsService){
		var vm = this;
		//assign injected objects to this
		vm.serverLocales = serverLocales;
		vm.classes = loadClasses.results;
		vm.datatypes = loadDataTypes.results;
		
		vm.handlers = [ "UNIMPLEMENTED YET"];
		//flags and objects for view
		vm.isNumeric;
		vm.isCoded;
		vm.isComplex;
		vm.selectedLocale;
		//holds array of objects for each locale
		vm.localizedConcepts = {};
		//always points to one of localizedConcepts of selected locale
		vm.selectedLocaleData;
		//functions
		vm.goLocale = goLocale;
		vm.checkType = checkType;
		vm.pushSynonyms = pushSynonyms;
		vm.pushSearchTerms = pushSearchTerms;
		vm.deleteSynonym = deleteSynonym;
		vm.deleteSearchTerm = deleteSearchTerm;
		vm.postConcept = postConcept;
		//on-update functions, receiving arrays of selected concepts
		vm.onSetMemberTableUpdate = onSetMemberTableUpdate;
		vm.onAnswerTableUpdate = onAnswerTableUpdate;
		vm.onFullnameUpdate = onFullnameUpdate;
		//concept data to create post request
		vm.concept = conceptsService.getEmptyConceptObject();
		vm.isFormValid = false;
		vm.result;
		
		activate();
		
		function activate(){
			createLocalized();
			vm.goLocale(serverLocales[0]);
			vm.concept.conceptClass = vm.classes[0].uuid;
			vm.concept.datatype = vm.datatypes[1].uuid;
			//vm.concept.handler = vm.handlers[0]
			checkType();
		}
		
		function goLocale(locale){
			if(vm.selectedLocale !== locale){
				vm.selectedLocaleData = vm.localizedConcepts[locale];
				vm.selectedLocale = locale;	
			}
		};
		function checkType(){
			vm.isNumeric = (vm.concept.datatype === "8d4a4488-c2cc-11de-8d13-0010c6dffd0f");
			vm.isCoded = (vm.concept.datatype === "8d4a48b6-c2cc-11de-8d13-0010c6dffd0f");
			vm.isComplex = (vm.concept.datatype === "8d4a6242-c2cc-11de-8d13-0010c6dffd0f");
		}
		//synonyms and fullname have to be objects, which hold their display string
		//for proper functioning of radio buttons
		function createLocalized(){
			for (var index=0; index < vm.serverLocales.length; index++){
				vm.localizedConcepts[vm.serverLocales[index]] = 
					conceptsService.getEmptyLocaleConceptObject(vm.serverLocales[index]);
			}
		}
		function pushSynonyms(){
			vm.selectedLocaleData.synonyms.push({display : ''});
		}
		function deleteSynonym(synonym){
			var index = vm.selectedLocaleData.synonyms.indexOf(synonym);
			vm.selectedLocaleData.synonyms.splice(index, 1);
		}
		function pushSearchTerms(){
			vm.selectedLocaleData.searchTerms.push({display : ''});
		}
		function deleteSearchTerm(term){
			var index = vm.selectedLocaleData.searchTerms.indexOf(term);
			vm.selectedLocaleData.searchTerms.splice(index, 1);
		}
		
		function onSetMemberTableUpdate(concepts){
			vm.concept.setMembers = [];
			for(var i=0;i<concepts.length;i++){
				vm.concept.setMembers.push(concepts[i].uuid)
			}
		}
		function onAnswerTableUpdate(concepts){
			vm.concept.answers = [];
			for(var i=0;i<concepts.length;i++){
				vm.concept.answers.push(concepts[i].uuid)
			}
		}
		function onFullnameUpdate(isCorrect, name, suggestions){
			vm.selectedLocaleData.fullname.display = name;
			vm.selectedLocaleData.fullname.valid = isCorrect;
			validateForm()
		}
		function postConcept(){
			vm.result = conceptsService.postConcept(vm.concept, vm.localizedConcepts);
		}
		function validateForm(){
			vm.isFormValid = vm.selectedLocaleData.fullname.valid
		}
	};
})();