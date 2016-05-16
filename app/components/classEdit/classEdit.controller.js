/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

ClassEditController.$inject =
	['singleClass', '$routeParams', '$location', 'openmrsRest'];

export default function ClassEditController( singleClass, $routeParams, $location, openmrsRest ){
	
	var vm = this;
	//holds class information
	vm.singleClass = singleClass;
	
    vm.links = {};
    vm.links["Concept Dictionary"] = "";
    vm.links["Concept Class Management"] = "class";
    vm.links["Concept Class Form"] = "class/"+vm.singleClass.uuid;
	
	vm.responseMessage = '';
	vm.isError = false;
	
	vm.redirectToList = redirectToList;
	
	vm.editClass = editClass;
	
	vm.cancel = cancel;

	vm.retire = retire;	
	vm.unretire = unretire;
	
	activate();
	
	function activate(){
    	if(angular.isDefined(vm.singleClass.auditInfo)&&
    	   angular.isUndefined(vm.singleClass.auditInfo.retireReason)){
    			vm.singleClass.auditInfo.retireReason = ""; 
    	}
    }
	

    function redirectToList() {
        $location.path('/class').search({classAdded: vm.singleClass.name});
    }

    function editClass() {

        openmrsRest.update('conceptclass', {uuid: vm.singleClass.uuid}, vm.singleClass).then(function(success) {
        	vm.responseMessage = success;
            vm.redirectToList();
        }, function(exception) {
        	vm.isError = true;
            vm.responseMessage = exception.data.error.fieldErrors.name[0].message;
        });
    }

    function cancel() {
        $location.path('/class').search({classAdded: ''});
        
    }
    
    function retire() {
        openmrsRest.retire('conceptclass', {uuid: singleClass.uuid}).then(function(data) {
        	vm.redirectToList();
        });
    }
    
    function unretire() {
        openmrsRest.unretire('conceptclass', {uuid: singleClass.uuid}).then(function(data) {
        	vm.redirectToList();
        });
    }
}
