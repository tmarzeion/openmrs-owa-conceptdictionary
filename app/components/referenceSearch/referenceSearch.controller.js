/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */


ReferenceSearchController.$inject = ['$scope', '$routeParams', 'openmrsNotification']

export default function ReferenceSearchController($scope, $routeParams, openmrsNotification){

    var vm = this;
    
    vm.links = {};
    vm.links["Concept.label"] = "";
    vm.links["ConceptReferenceTerm.title"] = "reference/";

    openmrsNotification.routeNotification();

    vm.type = "table";
    vm.resource = "conceptreferenceterm";
    vm.limit = 5; //Default value
    vm.columns= [
        {
            "property": "code",
            "label": "Code"
        },
        {
            "property": "name",
            "label": "Name"
        },
        {
            "property": "conceptSource.display",
            "label": "Source"
        }];
    vm.actions = [
        {
            "action":"edit",
            "label":"Edit",
        	"link" : "#/reference/{uuid}"

        },
        {
            "action":"retire",
            "label":"Retire"
        },
        {
            "action":"unretire",
            "label":"Unretire"
        }];
}