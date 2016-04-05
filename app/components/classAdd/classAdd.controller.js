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
	    .controller('ClassAddController', ClassAddController)
	    
	    ClassAddController.$inject = ['$location', 'openmrsRest']
	
	function ClassAddController($location, openmrsRest){

        var vm = this;
        
        vm.links = {};
        vm.links["Concept Class Management"] = "class";
        vm.links["Concept Class Form"] = "class/add/";

        //Default values for class and response message
        vm.class = {
            name:'',
            description:''
        };
        vm.responseMessage = '';
        vm.isError = false;

        //Method used to add class with current class params
        vm.addClass = addClass;

        //Method used to cancel class making
        vm.cancel = cancel;
        


        //Method used to add class with current class params
        function addClass() {
            vm.json = angular.toJson(vm.class);
            openmrsRest.create('conceptclass', vm.json).then(function(success) {
                //Fix this
                vm.success = true;
                $location.path('/class').search({classAdded: vm.class.name});
            }, function(exception) {
            	vm.isError = true;
                vm.responseMessage = exception.data.error.fieldErrors.name[0].message;
            });
        }

        //Method used to cancel class making
        function cancel () {
            vm.class.name = ' ';
            $location.path('/class').search({classAdded: ''});
        }

    }
})();
