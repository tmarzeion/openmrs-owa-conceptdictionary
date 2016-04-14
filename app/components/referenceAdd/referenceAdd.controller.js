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
    .controller('ReferenceAddController', ReferenceAddController);

ReferenceAddController.$inject = ['sources', 'openmrsRest', '$location'];

function ReferenceAddController (sources, openmrsRest, $location ){

    var vm = this;
    
    vm.links = {};
    vm.links["Concept Dictionary"] = "";
    vm.links["Reference Term Management"] = "reference/";
    vm.links["Reference Term Form"] = "reference/add/";


    vm.reference = {
        code:'',
        name:'',
        conceptSource: {},
        description:'',
        version:''
    };


    vm.sources = sources.results;
    vm.responseMessage = '';

    vm.cancel = cancel;
    vm.save = save;
    vm.isSavePossible = isSavePossible;

    function cancel () {
        $location.path('/reference');
    }

    function isSavePossible () {
        return vm.reference.code.length > 0 && angular.isDefined(vm.reference.conceptSource.uuid);
    }

    //Method used to add class with current class params
    function save() {
        vm.json = angular.toJson(vm.reference);
        openmrsRest.create('conceptreferenceterm', vm.json).then(function(success) {
            vm.success = true;
            $location.path('/reference').search({referenceSaved: vm.reference.name});
        }, function(exception) {
            vm.responseMessage = exception.data.error.fieldErrors.code[0].message;
        });
    }
}