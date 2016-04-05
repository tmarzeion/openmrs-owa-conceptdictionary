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
	.controller('ClassListController', ClassListController);

ClassListController.$inject =
	    ['loadClasses', '$location', '$route', '$routeParams', 'openmrsRest'];
	
	function ClassListController (loadClasses, $location, $route, $routeParams, openmrsRest) {
		
		
	
		var vm = this;
		
        vm.links = {};
        vm.links["Concept Class Management"] = "class";
		
		//array of concept classes
        vm.classes = loadClasses.results;
        //map of selected classes
        vm.selected = {};
        //checks if any is selected
        vm.isSelected = false;
        //determines whether class has been added in previous view
        vm.classAdded = $routeParams.classAdded;

        vm.goTo = goTo;
        vm.deleteSelected = deleteSelected;
        vm.refreshButtonState = refreshButtonState;

        function refreshButtonState () {

            var foundSolution = false;
            //for iterator?
            var counter = 0;

            angular.forEach(vm.selected, function(key) {
                if (key) {
                    vm.isSelected = true;
                    foundSolution = true;
                    //break?
                }
                counter++;
            });
            if (!foundSolution && counter == Object.keys(vm.selected).length) {
                vm.isSelected = false;
            }
        }

        function deleteSelected (){
        	//deletes selected classes
            angular.forEach(vm.selected, function(key,value){
                if(key){
                    openmrsRest.remove('conceptclass', {uuid : value});
                }
            });
            //then updates classes list in scope after deletion
            openmrsRest.listFull('conceptclass').then(function(data) {
                vm.classes = data;
                $location.path("/class/").search({});
            });

        }
        //redirects to another location
		function goTo (hash){
			$location.path(hash);
		}


    }