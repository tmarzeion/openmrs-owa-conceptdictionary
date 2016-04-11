/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
angular
    .module('conceptDictionaryApp')
    .controller('ReferenceEditController', ReferenceEditController);

ReferenceEditController.$inject = ['reference', 'sources', 'openmrsRest', '$location'];

function ReferenceEditController (reference, sources, openmrsRest, $location ){

    var vm = this;
    
    vm.links = {};
    vm.links["Concept Dictionary"] = "";
    vm.links["Reference Term Management"] = "reference/";
    vm.links["Reference Term Form"] = "reference/"+reference.uuid;

    vm.reference = reference;
    vm.sources = sources;
    vm.selectedConceptSource = vm.reference.conceptSource.name;

    vm.cancel = cancel;
    vm.save = save;
    vm.deleteForever = deleteForever;
    vm.retire = retire;
    vm.updateConceptSource = updateConceptSource;
    vm.isSavePossible = isSavePossible;


    function updateConceptSource() {
        for (i = 0; i < vm.sources.length; i++) {
            if (vm.sources[i].name === vm.selectedConceptSource) {
                vm.reference.conceptSource = vm.sources[i];
                break;
            }
        }
    }

    function isSavePossible () {
        return vm.reference.code.length > 0 && angular.isDefined(vm.reference.conceptSource.uuid);
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

    function retire() {
        //wololo
        vm.reference.retired = !(vm.reference.retired);
        save();
    }
}