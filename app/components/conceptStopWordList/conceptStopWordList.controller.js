/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

ConceptStopWordListController.$inject =
    ['$routeParams', 'openmrsNotification'];

export default function ConceptStopWordListController ($routeParams, openmrsNotification) {

    var vm = this;
    openmrsNotification.routeNotification();
    //Properties for list component
    vm.resource = "conceptstopword";
    vm.limit = 20; //Default
    vm.columns= [
        {
            "property": "display",
            "label": "Word"
        },
        {
            "property": "locale",
            "label":"Locale"
        }];
    vm.actions = [{
            "action":"purge",
            "label":"Delete",
            "link":"#/stopword/{uuid}"
    }];
    
    //Breadcrumbs properties
    vm.links = {};
    vm.links["Concept.label"] = "";
    vm.links["ConceptStopWord.manage"] = "conceptstopword/";
    

    //determines whether concept stop word has been added in previous view
    vm.conceptStopWordAdded = $routeParams.conceptStopWordAdded;
    
}