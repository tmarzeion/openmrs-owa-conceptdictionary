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
    .controller('ConceptStopWordListController', ConceptStopWordListController);

ConceptStopWordListController.$inject =
    ['loadConceptStopWords','$location', '$routeParams', 'openmrsRest'];

function ConceptStopWordListController (loadConceptStopWords, $location, $routeParams, openmrsRest) {

    var vm = this;
    
    vm.links = {};
    vm.links["Concept Dictionary"] = "";
    vm.links["Concept Stop Word Management"] = "conceptstopword/";

    //array of concept stop words0
    vm.conceptStopWords = loadConceptStopWords.results;
    //determines whether concept stop word has been added in previous view
    vm.conceptStopWordAdded = $routeParams.conceptStopWordAdded;

    vm.goTo = goTo;
    vm.purge = purge;

    function purge(word) {
        openmrsRest.purge('conceptstopword', {uuid : word.uuid}).then(function(data) {
            openmrsRest.listFull('conceptstopword').then(function(data) {
                vm.conceptStopWords = data.results;
            });
        });
    }

    //redirects to another location
    function goTo (hash){
        $location.path(hash);
    }
}