/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
mappingsTable.$inject = ['openmrsRest', 'openmrsNotification'];

export default function mappingsTable(openmrsRest, openmrsNotification){
    var vm = this;
    //basic component functions
    vm.update = update;
    vm.remove = remove;
    //overall edit helpers
    vm.search = search;
    vm.termQuery;
    vm.suggestions = [];
    vm.newMapping;
    //add logic
    vm.addView = false;
    vm.newMapping;
    //add controllers
    vm.startAdd = startAdd;
    vm.confirmAdd = confirmAdd;
    vm.cancelAdd = cancelAdd;
    vm.executeAdd = executeAdd;
    //edit controllers
    vm.cancelEdit = cancelEdit;
    vm.startEdit = startEdit;
    vm.confirmEdit = confirmEdit;
    vm.executeEdit = executeEdit;
    //counters
    vm.newTermInformationIndex = -1;
    vm.editCount = 0;
    vm.incrementEditCount = incrementEditCount;
    vm.decrementEditCount = decrementEditCount;
    
    vm.divideMappings = divideMappings;
    vm.validMapping = validMapping;
    vm.search = search;

    activate();
    function activate(){
        //initialize list of mappings
        if(angular.isDefined(vm.conceptUuid)){
            openmrsRest.list('concept/'+vm.conceptUuid+"/mapping", {v: "full"}).then(function(response){
                vm.mappings = response.results;
                //copy by value
                vm.mappingsCache = response.results.slice();
                divideMappings();
            })
        } else {
            vm.mappings = []
        }
        //get available mapTypes and conceptSources
        openmrsRest.list('conceptmaptype').then(function(response){
            vm.mapTypes = response.results;
        })
        openmrsRest.list('conceptsource').then(function(response){
            var sources = [];
            sources.push({display: "search all sources ..."})
            vm.sources = sources.concat(response.results);
            vm.newMapping = createNewMapping();
        })
    }

    function incrementEditCount(){
        vm.editCount++;
        vm.editCountUpdate({count : vm.editCount});
    }
    function decrementEditCount(){
        vm.editCount--;
        vm.editCountUpdate({count : vm.editCount});
    }

    function divideMappings(){
        var existingTermsMappings = [];
        var newTermsMappings = [];
        for(var i=0; i < vm.mappings.length;i++){
            if(angular.isDefined(vm.mappings[i].conceptReferenceTerm.uuid)){
                existingTermsMappings.push(vm.mappings[i]);
            } else {
                newTermsMappings.push(vm.mappings[i]);
            }
        }
        if(newTermsMappings.length === 0 ){
            vm.newTermInformationIndex = -1;
        } else {
            vm.newTermInformationIndex = existingTermsMappings.length;
        }
        vm.mappings = existingTermsMappings.concat(newTermsMappings);

    }

    function update(){
        divideMappings();
        vm.mappingsCache = vm.mappings.slice();
        vm.onUpdate({mappings : vm.mappings});
    }
    function remove(mapping){
        var index = vm.mappings.indexOf(mapping);
        vm.mappings.splice(index, 1);
        update();
    }
    /*Edit logic*/
    function startEdit(mapping, index){
        mapping.edit = true;
        vm.mappingsCache[index].termQuery = mapping.conceptReferenceTerm.code;
        vm.mappingsCache[index].suggestions = [];
        vm.incrementEditCount();
    }
    function confirmEdit(mapping, index){
        if(validMapping(vm.mappingsCache[index])){
            if(angular.isDefined(vm.mappingsCache[index].conceptReferenceTerm.uuid)){
                executeEdit(mapping, index);
            } else {
                mapping.showConfirmDialog = true;
            }
        }
    }
    function cancelEdit(mapping, index){
        mapping.edit = false;
        vm.mappingsCache[index] = mapping;
        vm.decrementEditCount();
    }
    function executeEdit(mapping, index){
        mapping = vm.mappingsCache[index];
        mapping.edit = false;
        update();
        vm.decrementEditCount();
    }
    /*Adding new mapping logic*/
    function startAdd(){
        vm.addView = true;
        vm.incrementEditCount();
    }
    function confirmAdd(){
        if(validMapping(vm.newMapping)){
            if(angular.isDefined(vm.newMapping.conceptReferenceTerm.uuid)){
                executeAdd();
            } else {
                vm.newMapping.showConfirmDialog = true;
            }
        }
    }
    function executeAdd(){
        vm.mappings.push({conceptMapType: vm.newMapping.conceptMapType,
                        conceptReferenceTerm: vm.newMapping.conceptReferenceTerm});
        vm.update();
        resetAdd();
    }
    function cancelAdd(){
        resetAdd();
    }
    function resetAdd(){
        vm.addView = false;
        vm.newMapping = createNewMapping();
        vm.decrementEditCount();
    }
    function createNewMapping(){
        return {
            conceptMapType: {},
            conceptReferenceTerm: {
                conceptSource: vm.sources[0]
            },
            termQuery: ""
        }
    }
    /*adding and editing helper functions*/
    function validMapping(map){
        //is MapType defined? must already exist
        if(angular.isUndefined(map.conceptMapType.uuid)){
            openmrsNotification.error("Invalid mapping: relationship is not specified")
            return false;
        }
        //fake source "search all sources..." has uuid === ""
        if(map.conceptReferenceTerm.conceptSource.uuid === ""){
            openmrsNotification.error("Invalid mapping: source is not specified");
            return false;
        }
        //is already existing RefTerm defined?
        var defRefTerm = angular.isDefined(map.conceptReferenceTerm.uuid);
        //or else is new Term defined?
        var defNewRefTerm = angular.isDefined(map.conceptReferenceTerm.conceptSource.uuid)
                            &&angular.isDefined(map.conceptReferenceTerm.code);
        if (defRefTerm||defNewRefTerm){
            return (defRefTerm||defNewRefTerm);
        }
        else {
            openmrsNotification.error("Invalid Mapping: invalid reference term")
            return false;
        }
    }
    function search(mapping){
        if(angular.isDefined(mapping.termQuery)&& mapping.termQuery.length > 1){
            var query = {limit: 10};
            if(angular.isDefined(mapping.conceptReferenceTerm.conceptSource.uuid)){
                query.source = mapping.conceptReferenceTerm.conceptSource.display;
                query.code = mapping.termQuery;
            } else {
                query.q = mapping.termQuery;
            }
            openmrsRest.listFull('conceptreferenceterm', query)
            .then(function(response){
                var terms = response.results;
                mapping.suggestions = [];
                var source = mapping.conceptReferenceTerm.conceptSource;
                mapping.conceptReferenceTerm = {conceptSource: source};
                for(var i =0; i<terms.length;i++){
                    mapping.suggestions.push(terms[i]);
                    if(mapping.termQuery === terms[i].code){
                        mapping.conceptReferenceTerm = terms[i];
                        mapping.conceptReferenceTerm.conceptSource = terms[i].conceptSource;
                        break;
                    }
                }
                if(angular.isUndefined(mapping.conceptReferenceTerm.uuid)) {
                    mapping.conceptReferenceTerm.code = mapping.termQuery;
                }
            })
        }
    }
}