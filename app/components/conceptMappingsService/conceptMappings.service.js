/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
conceptMappingsService.$inject = ['openmrsRest'];

export default function conceptMappingsService() {

    var termNameRegEx = /\(\w+\)/
    var service = {
        parseMappingSource : parseMappingSource,
        parseMappingCode: parseMappingCode,
        parseMappingName: parseMappingName
    }
    return service;

    function parseMappingSource(display){
        return display.substring(0, display.lastIndexOf(":"));
    }
    function parseMappingCode(display){
        //'+2' to cut off ': '
        var nameIndex = display.search(termNameRegEx);
        if(nameIndex === -1) nameIndex = display.length;
        return display.substring(display.lastIndexOf(": ")+2, nameIndex)
    }
    function parseMappingName(display){
        var nameIndex = display.search(termNameRegEx);
        if(nameIndex === -1) return "";
        else return display.substring(nameIndex+1, display.length-1);
    }
    function getMapTypes(){
        return openmrsRest.list('conceptmaptype');
    }
}