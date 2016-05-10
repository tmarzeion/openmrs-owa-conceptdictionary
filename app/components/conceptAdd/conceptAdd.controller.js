/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

ConceptAddController.$inject = 
	['concept','serverLocales', 'loadClasses', 'loadDataTypes', 'conceptsService', '$location', '$routeParams'];
	
export default function ConceptAddController
		(concept, serverLocales, loadClasses, loadDataTypes, conceptsService, $location, $routeParams){
	
	var vm = this;
	
    vm.links = {};
	vm.links["Concept Dictionary"] = "";
    vm.links["Concept Dictionary Management"] = "concept/";
    
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
	vm.postConceptAndContinue = postConceptAndContinue;
	//on-update functions, receiving arrays of selected concepts
	vm.onSetMemberTableUpdate = onSetMemberTableUpdate;
	vm.onAnswerTableUpdate = onAnswerTableUpdate;
	vm.onFullnameUpdate = onFullnameUpdate;
	//concept data to create post request
	vm.concept;
	vm.isFormValid = false;
	vm.result;
	vm.added = $routeParams.added;

	
	activate();
	
	function activate(){
		//edit mode
		if(angular.isDefined($routeParams.conceptUUID)){
			vm.concept = concept;
		    vm.isFormValid = true;
		    vm.links["Concept Form"] = "concept/edit/"+$routeParams.conceptUUID;
		} 
		//add mode
		else {
			vm.concept = conceptsService.getEmptyConceptObject();
			vm.concept.conceptClass = vm.classes[0];
			vm.concept.datatype = vm.datatypes[1];
			vm.concept.setMembers = [];
			vm.concept.answers = [];
		    vm.links["Concept Form"] = "concept/add/";
		}
		createLocalized();
		vm.goLocale(serverLocales[0]);
		checkType();
	}
	
	function goLocale(locale){
		if(vm.selectedLocale !== locale){
			vm.selectedLocaleData = vm.localizedConcepts[locale];
			vm.selectedLocale = locale;	
		}
	};
	function checkType(){
		vm.isNumeric = (vm.concept.datatype.uuid === "8d4a4488-c2cc-11de-8d13-0010c6dffd0f");
		vm.isCoded = (vm.concept.datatype.uuid === "8d4a48b6-c2cc-11de-8d13-0010c6dffd0f");
		vm.isComplex = (vm.concept.datatype.uuid === "8d4a6242-c2cc-11de-8d13-0010c6dffd0f");
	}
	function createLocalized(){
		if(angular.isDefined($routeParams.conceptUUID)){
			vm.localizedConcepts = conceptsService.getLocalizedConcepts(vm.concept.names,
																		vm.concept.descriptions,
																		vm.serverLocales)
		}
		else{
			vm.localizedConcepts = conceptsService.getEmptyLocalizedConcepts(vm.serverLocales)
		}
	}
	function pushSynonyms(){
		vm.selectedLocaleData.synonyms.push({name : ''});
	}
	function deleteSynonym(synonym){
		var index = vm.selectedLocaleData.synonyms.indexOf(synonym);
		vm.selectedLocaleData.synonyms.splice(index, 1);
	}
	function pushSearchTerms(){
		vm.selectedLocaleData.searchTerms.push({name : ''});
	}
	function deleteSearchTerm(term){
		var index = vm.selectedLocaleData.searchTerms.indexOf(term);
		vm.selectedLocaleData.searchTerms.splice(index, 1);
	}
	
	function onSetMemberTableUpdate(concepts){
		vm.concept.setMembers = [];
		for(var i=0;i<concepts.length;i++){
			vm.concept.setMembers.push(concepts[i])
		}
	}
	function onAnswerTableUpdate(concepts){
		vm.concept.answers = [];
		for(var i=0;i<concepts.length;i++){
			vm.concept.answers.push(concepts[i])
		}
	}
	function onFullnameUpdate(isCorrect, name, suggestions){
		vm.selectedLocaleData.fullname.name = name;
		vm.selectedLocaleData.fullname.valid = isCorrect;
		validateForm()
	}
	function postConcept(){
		conceptsService.postConcept(vm.concept, vm.localizedConcepts).then(function(result){
			if(angular.isDefined(result)&&result.success){
				$location.path('/concept/' + vm.concept.uuid).search({added : result.message});
			}
			else vm.result = result;
		})
	}
	function postConceptAndContinue(){
		conceptsService.postConcept(vm.concept, vm.localizedConcepts).then(function(result){
			if(angular.isDefined(result)&&result.success){
				$location.path($location.path()).search({added : result.message});
			}
			else vm.result = result;
		})
	}
	function validateForm(){
		vm.isFormValid = false;
		for(var i=0;i<serverLocales.length; i++){
			if(vm.localizedConcepts[serverLocales[i]].fullname.valid){
				vm.isFormValid = true;
			} 
		}
	}
};
