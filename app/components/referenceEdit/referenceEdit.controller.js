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

    vm.deleteClicked = false;

    vm.cancel = cancel;
    vm.save = save;
    vm.deleteForever = deleteForever;
    vm.retire = retire;
    vm.unretire = unretire;
    vm.updateConceptSource = updateConceptSource;
    vm.isSavePossible = isSavePossible;
    vm.showAlert = showAlert;
    vm.updateDeleteConfirmation = updateDeleteConfirmation;

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
    }

    function updateConceptSource() {
        for (i = 0; i < vm.sources.length; i++) {
            if (vm.sources[i].name === vm.selectedConceptSource) {
                vm.reference.conceptSource = vm.sources[i];
                break;
            }
        }
    }

    function isSavePossible () {
        return angular.isDefined(vm.reference.code) && angular.isDefined(vm.reference.conceptSource.uuid);
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

    function unretire() {
        openmrsRest.unretire('conceptreferenceterm', {uuid: reference.uuid}).then(function() {
            cancel();
        });
    }

    function retire() {
        openmrsRest.retire('conceptreferenceterm', {uuid: reference.uuid}).then(function() {
            cancel();
        });
    }
}