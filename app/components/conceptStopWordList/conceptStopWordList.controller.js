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
    //array of concept stop words0
    vm.conceptStopWords = loadConceptStopWords.results;
    //map of selected concept stop words
    vm.selected = {};
    //checks if any is selected
    vm.isSelected = false;
    //determines whether concept stop word has been added in previous view
    vm.conceptStopWordAdded = $routeParams.conceptStopWordAdded;

    vm.goTo = goTo;
    vm.deleteSelected = deleteSelected;
    vm.refreshButtonState = refreshButtonState;

    function refreshButtonState () {

        var foundSolution = false;
        var counter = 0;
        angular.forEach(vm.selected, function(key) {
            if (key) {
                vm.isSelected = true;
                foundSolution = true;
                //TODO: Add break; here
            }
            counter++;
        });
        if (!foundSolution && counter == Object.keys(vm.selected).length) {
            vm.isSelected = false;
        }
    }

    function deleteSelected (){
        //deletes selected concept stop words
        angular.forEach(vm.selected, function(key,value){
            if(key){
                openmrsRest.remove('conceptstopword', {uuid : value, purge: true});
            }
        });
        //then updates concept stop words list in scope after deletion

        openmrsRest.listFull('conceptstopword').then(function(data) {
            vm.conceptStopWords = data;
            $location.path("/conceptstopword/").search({});
        });
    }
    //redirects to another location
    function goTo (hash){
        $location.path(hash);
    }
}