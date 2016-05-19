/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
ConceptViewController.$inject = ['$scope', 'concept', 'serverLocales', 'conceptsService', '$routeParams'];

export default function ConceptViewController ($scope, concept, serverLocales, conceptsService, $routeParams){

	var vm = this;
	
    vm.links = {};
	vm.links["Concept Dictionary"] = "";
    vm.links["Concepts Management"] = "concept/";
    vm.links[concept.display] = "concept/"+concept.uuid;

	vm.added = $routeParams.added;

	//determines if Numeric content is shown
	vm.isNumeric;
	//determines if coded answer content is shown
	vm.isCoded;
	//holds names and description of concept for currently selected locale
	vm.conceptLocale = {};
	//holds concept
	vm.concept = concept;
	//array of locales of concept
	vm.locales;
	//function invoked when user clicks locale button
	vm.goLocale = goLocale;
	vm.selectedLocale;
	
	activate();
	
	//activation function
	function activate(){
		vm.locales = conceptsService.getLocales(vm.concept.names,
				vm.concept.descriptions,
				serverLocales);
		
		checkType();
		goLocale(vm.concept.name.locale);
	}
	//inserts descriptions and names for specified locale into conceptLocale, parsed from concept tables,
	function goLocale (locale) {
		vm.selectedLocale = locale;
		vm.conceptLocale.description 
			= conceptsService.getLocaleDescr(vm.concept.descriptions, locale);
		vm.conceptLocale.names 
			= conceptsService.getLocaleNames(vm.concept.names, locale);
	}
	//checks datatype of concept to determine
	function checkType (){
		vm.isNumeric = (vm.concept.datatype.uuid === "8d4a4488-c2cc-11de-8d13-0010c6dffd0f");
		vm.isCoded = (vm.concept.datatype.uuid === "8d4a48b6-c2cc-11de-8d13-0010c6dffd0f");
	}
};
