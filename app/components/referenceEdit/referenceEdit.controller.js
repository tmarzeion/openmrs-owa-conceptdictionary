/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
ReferenceEditController.$inject = ['reference', 'sources', 'openmrsRest', '$location'];

export default function ReferenceEditController (reference, sources, openmrsRest, $location ){

    var vm = this;
    
    vm.links = {};
    vm.links["Concept Dictionary"] = "";
    vm.links["Reference Term Management"] = "reference/";
    vm.links["Reference Term Form"] = "reference/"+reference.uuid;
    
    vm.save = save;
    vm.cancel = cancel;
    vm.retire = retire;
    vm.unretire = unretire;
    vm.updateConceptSource = updateConceptSource;

    activate();

    function activate() {
        vm.reference = reference;
        vm.sources = sources.results;

        if(angular.isDefined(vm.reference.name)){
            vm.selectedConceptSource = vm.reference.conceptSource.name;
        }
        else{
            vm.reference.conceptSource = {};
        }
        if(angular.isDefined(vm.reference.auditInfo)&&
            angular.isUndefined(vm.reference.auditInfo.retireReason)){
            vm.reference.auditInfo.retireReason = "";
        }
    }

    function updateConceptSource() {
        var i = 0;
        do {
            if (vm.sources[i].name === vm.selectedConceptSource) {
                vm.reference.conceptSource = vm.sources[i];
                break;
            }
            i++;
        }
        while(i < vm.sources.length);
    }

    function cancel () {
        $location.path('/reference');
    }

    function save() {
        vm.json = angular.toJson(vm.reference);
        openmrsRest.update('conceptreferenceterm', {uuid: vm.reference.uuid}, vm.json).then(function(success) {
            vm.success = true;
            $location.path('/reference').search({referenceSaved: vm.reference.name});
        });
    }

    function unretire() {
        openmrsRest.unretire('conceptreferenceterm', {uuid: vm.reference.uuid}).then(function() {
            cancel();
        });
    }

    function retire() {
        openmrsRest.retire('conceptreferenceterm', {uuid: vm.reference.uuid}).then(function() {
            cancel();
        });
    }

    /**
     * Logic for delete-alert component
     */

    vm.deleteForever = deleteForever;
    vm.showAlert = showAlert;
    vm.updateDeleteConfirmation = updateDeleteConfirmation;
    
    vm.deleteClicked = false;
    
    function deleteForever() {
        openmrsRest.remove('conceptreferenceterm', {uuid : vm.reference.uuid, purge : true});
        $location.path('/reference').search({referenceDeleted: vm.reference.name});
    }
    function showAlert(item) {
        vm.deleteClicked = true;
    }
    function updateDeleteConfirmation(isConfirmed) {
        if (isConfirmed) {
            deleteForever();
        }
        vm.deleteClicked = false;
    }
}