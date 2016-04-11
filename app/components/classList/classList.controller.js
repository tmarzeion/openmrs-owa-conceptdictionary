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
        vm.links["Concept Dictionary"] = "";
        vm.links["Concept Class Management"] = "class";

        vm.deleteClicked = false;
        vm.deleteItem;

		//array of concept classes
        vm.classes = loadClasses.results;

        //determines whether class has been added in previous view
        vm.classAdded = $routeParams.classAdded;

        vm.goTo = goTo;
        vm.retire = retire;
        vm.unretire = unretire;
        vm.purge = purge;
        vm.showAlert = showAlert;
        vm.updateDeleteConfirmation = updateDeleteConfirmation;

        function retire(item) {
            openmrsRest.retire('conceptclass', {uuid: item.uuid}).then(function(data) {
                openmrsRest.listFull('conceptclass', {includeAll: true}).then(function(data) {
                    vm.classes = data.results;
                });
            });
        }

        function unretire(item) {
            openmrsRest.unretire('conceptclass', {uuid: item.uuid}).then(function(data) {
                openmrsRest.listFull('conceptclass', {includeAll: true}).then(function(data) {
                    vm.classes = data.results;
                });
            });
        }

        function purge(item) {
            openmrsRest.purge('conceptclass', {uuid: item.uuid}).then(function(data) {
                openmrsRest.listFull('conceptclass', {includeAll: true}).then(function(data) {
                    vm.classes = data.results;
                });
            });
        }

        function showAlert(item) {
            vm.deleteClicked = true;
            vm.deleteItem = item;
        }

        function updateDeleteConfirmation(isConfirmed) {
            if (isConfirmed) {
                purge(vm.deleteItem);
            }
            vm.deleteClicked = false;
        }

        //redirects to another location
		function goTo (hash){
			$location.path(hash);
		}
    }