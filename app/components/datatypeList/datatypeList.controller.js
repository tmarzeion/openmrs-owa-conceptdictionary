/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
export default function DatatypeListController(){

	var vm = this;

	//Properties for list component
	vm.resource = "conceptdatatype";
	vm.redirectionParam = "datatype";
	vm.limit = 15; //Default value
	vm.columns= [
		{
			"property": "name",
			"label": "Name"
		},
		{
			"property": "description",
			"label":"Description"
		}];
	vm.actions = [
		{
			"action":"view",
			"label":"View",
			"icon":"icon-eye-open view-action"
		}];

	//Breadcrumbs properties
    vm.links = {};
	vm.links["Concept Dictionary"] = "";
    vm.links["Concept Datatype Management"] = "datatype/";

}