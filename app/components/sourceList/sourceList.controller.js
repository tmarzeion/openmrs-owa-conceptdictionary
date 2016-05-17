/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
SourcesListController.$inject = ['$routeParams', 'openmrsNotification'];

export default function SourcesListController ($routeParams, openmrsNotification) {

    var vm = this;
    openmrsNotification.routeNotification();
    //Properties for list component
    vm.limit = 10;
    vm.resource = "conceptsource";
    vm.columns= [
        {
            "property": "name",
            "label": "Name"
        },
        {
            "property": "hl7Code",
            "label":"HL7 Code"
        },
        {
            "property": "description",
            "label":"Description"
        }];
    vm.actions = [
        {
            "action":"edit",
            "label":"Edit",
            "link":"#/source/{uuid}"
        },
        {
            "action":"retire",
            "label":"Retire"
        },
        {
            "action":"unretire",
            "label":"unretire"
        },
        {
            "action":"purge",
            "label":"Delete"
        }
    ];

    //Breadcrumbs properties
    vm.links = {};
    vm.links["Concept Dictionary"] = "";
    vm.links["Concept Source Management"] = "source/";

}