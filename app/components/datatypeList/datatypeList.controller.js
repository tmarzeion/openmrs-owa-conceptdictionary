/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
DatatypeListController.$inject = 
	['$scope', '$routeParams', 'openmrsRest'];
	
export default function DatatypeListController($scope, $routeParams, openmrsRest){

	var vm = this;
	
    vm.links = {};
	vm.links["Concept Dictionary"] = "";
    vm.links["Concept Datatype Management"] = "datatype/";

	vm.currentPageResults;
	
	vm.isNext;
	vm.isPrev;
	
	vm.dataTypeList = [];
	
	vm.activate = activate;
	vm.nextPage = nextPage;
	vm.prevPage = prevPage;
	
	activate({limit: 10});
	
	function activate(param){
		openmrsRest.listFull('conceptdatatype', param).then(function(res) {
			vm.currentPageResults = res;
			vm.isNext = res.hasNext();
			vm.isPrev = res.hasPrevious();
			vm.dataTypeList = res.results;
		});
	};
	
	function nextPage(){
		activate(vm.currentPageResults.nextQuery);
	}
	function prevPage(){
		activate(vm.currentPageResults.previousQuery)
	}
}