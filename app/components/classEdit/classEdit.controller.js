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
	['singleClass', '$routeParams', '$location', 'openmrsRest', 'openmrsNotification'];

export default function ClassEditController( singleClass, $routeParams, $location, openmrsRest, openmrsNotification){
	
	var vm = this;
	//holds class information
	vm.singleClass = singleClass;
	
    vm.links = {};
    vm.links["Concept Dictionary"] = "";
    vm.links["Concept Class Management"] = "class";
    vm.links["Concept Class Form"] = "class/"+vm.singleClass.uuid;
    
	vm.isError = false;
	
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
    	openmrsNotification.routeNotification();
    }

    function editClass() {
        openmrsRest.update('conceptclass', {uuid: vm.singleClass.uuid}, vm.singleClass).then(handleSuccess, handleException);
    }

    function cancel() {
        $location.path('/class');
    }
    
    function retire() {
        openmrsRest.retire('conceptclass', {uuid: singleClass.uuid}).then(handleSuccess, handleException);
    }
    
    function unretire() {
        openmrsRest.unretire('conceptclass', {uuid: singleClass.uuid}).then(handleSuccess, handleException);
    }
    
    function handleSuccess(success){
    	$location.path('/class').search({successToast: vm.singleClass.name+" has been saved"});
    }
    function handleException(exception){
        openmrsNotification.error(exception.data.error.fieldErrors.name[0].message);
    }
}
