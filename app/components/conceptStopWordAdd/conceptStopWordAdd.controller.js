/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
(function(){
	'use strict';
	
	angular
    	.module('conceptDictionaryApp')
    	.controller('ConceptStopWordAddController', ConceptStopWordAddController)
    	
    	ConceptStopWordAddController.$inject = ['$location', 'openmrsRest', 'serverLocales']
	
	function ConceptStopWordAddController($location, openmrsRest, serverLocales){

        var vm = this;
        
        vm.links = {};
        vm.links["Concept Dictionary"] = "";
        vm.links["Concept Stop Word Management"] = "conceptstopword/";
        vm.links["Concept Stop Word"] = "conceptstopword/add/";

        vm.serverLocales = serverLocales;

        //Default values for concept stop word and response message
        vm.conceptStopWord = {
            value: '',
            locale: ''
        };
        vm.responseMessage = '';

        vm.selectedLocale = '';

        //Method used to add concept stop word with current concept stop word params
        vm.addConceptStopWord = addConceptStopWord;

        //Method used to cancel concept stop word making
        vm.cancel = cancel;

        //Method used to add concept stop word with current class params
        function addConceptStopWord() {
            vm.json = angular.toJson(vm.conceptStopWord);
            openmrsRest.create('conceptstopword', vm.json).then(function (success) {
                //Fix this
                vm.success = true;
                $location.path('/conceptstopword').search({conceptStopWordAdded: vm.conceptStopWord.value});
            }, function (error) {
                vm.responseMessage = error.message;
            });
        }

        //Method used to cancel class making
        function cancel() {
            $location.path('/conceptstopword').search({conceptStopWordAdded: ''});
        }
	}
	
})();