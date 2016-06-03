/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
conceptsService.$inject = ['openmrsRest' ,'$q']

export default function conceptsService(openmrsRest, $q){

	var service = {
			getEmptyConceptObject: getEmptyConceptObject,
			getEmptyLocaleConceptObject: getEmptyLocaleConceptObject,
			postConcept: postConcept,
			deleteConcept: deleteConcept,
			getLocales: getLocales,
			getLocaleNames: getLocaleNames,
			getLocaleDescr: getLocaleDescr,
			getEmptyLocalizedConcepts : getEmptyLocalizedConcepts,
			getLocalizedConcepts : getLocalizedConcepts,
			parseNames : parseNames,
			parseDescriptions : parseDescriptions,
			deleteConcept: deleteConcept
	}
	return service
	
	/**
	 * @returns empty concept object with defined non-localized fields
	 */
	function getEmptyConceptObject(){
		return {
				version : "",
				conceptClass : "",
				datatype : "",
				set : false,
				//numeric data
				hiAbsolute : "",
				hiCritical : "",
				hiNormal : "",
				lowAbsolute : "",
				lowCritical : "",
				lowNormal : "",
				units : "",
				allowDecimal : false,
				displayPrecision : "",
				//arrays of concept data
				answers : [],
				setMembers: [],
				handler : ""
		};	
	}
	/**
	 * sends proper POST request to create concept
	 * @concept - concept object, it must contain datatype and conceptClass properties
	 * @localizedConcepts = array of concept localized data objects
	 * @returns result object, contains boolean property success and proper message
	 */
	function postConcept(concept, localizedConcepts){
		//will be serialized to JSON request body
		var conceptRequest = {};
		conceptRequest.uuid = concept.uuid;
		//contain data about result of postConcept operation
		var result= {};
		var deferred = $q.defer();
		//parse names to array, return error message if no fully specified name
		try{
			conceptRequest.names = parseNames(localizedConcepts);
			conceptRequest.descriptions = parseDescriptions(localizedConcepts);
		}catch(err){
			result.success = false;
			result.message = err;
			deferred.resolve(result);
			return deferred.promise;
		}
		//return error message if conceptClass or datatype is undefined
		if(angular.isDefined(concept.datatype)&&angular.isDefined(concept.conceptClass)){
			conceptRequest.datatype = concept.datatype.uuid;
			conceptRequest.conceptClass = concept.conceptClass.uuid;
		}
		else{
			result.success = false;
			result.message = "concept's datatype and class must be defined!";
			deferred.resolve(result);
			return deferred.promise;
		}

		
		if(concept.version !== ""){
			conceptRequest.version = concept.version;
		}
		if(concept.set){
			conceptRequest.set = concept.set;
			conceptRequest.setMembers = []
			for(var i =0; i<concept.setMembers.length;i++){
				conceptRequest.setMembers.push(concept.setMembers[i].uuid);
			}
		}
		//if coded
		if(concept.datatype.uuid === "8d4a48b6-c2cc-11de-8d13-0010c6dffd0f"){
			conceptRequest.answers = [];
			for(var i =0; i<concept.answers.length;i++){
				conceptRequest.answers.push(concept.answers[i].uuid);
			}
		}
		//if complex TODO implement
		if(concept.datatype.uuid === "8d4a6242-c2cc-11de-8d13-0010c6dffd0f"){
			
		}
		//if numeric, add numeric data fields if they are defined
		if(concept.datatype.uuid === "8d4a4488-c2cc-11de-8d13-0010c6dffd0f"){
			if(concept.hiAbsolute)conceptRequest.hiAbsolute = concept.hiAbsolute;
			if(concept.hiCritical)conceptRequest.hiCritical = concept.hiCritical;
			if(concept.hiNormal)conceptRequest.hiNormal = concept.hiNormal;
			if(concept.lowAbsolute)conceptRequest.lowAbsolute = concept.lowAbsolute;
			if(concept.lowCritical)conceptRequest.lowCritical = concept.lowCritical;
			if(concept.lowNormal)conceptRequest.lowNormal = concept.lowNormal;
			if(concept.displayPrecision)conceptRequest.displayPrecision = concept.displayPrecision;
			if(concept.units)conceptRequest.units = concept.units;
			if(concept.allowDecimal !== null)conceptRequest.allowDecimal = concept.allowDecimal;
		}
		//return in then clause to avoid returning undefined
		var conceptJson = angular.toJson(conceptRequest);
		
        function handleSuccess(success){
        	if(angular.isDefined(success)){
            	result.requestBody = conceptJson;
                result.success = true;
                result.message = success.display + " had been saved";
        	}
        	else{
        		result.success = false;
        		result.message = "Server Error"
        	}
        	deferred.resolve(result);
        };
        function handleException(exception){
        	result.requestBody = conceptJson;
        	result.success = false;
        	result.message = exception.statusText;
            deferred.resolve(result);
        }
		
		if(angular.isDefined(concept.uuid)){
	        openmrsRest.update('concept', conceptRequest)
				        .then(function(success){handleSuccess(success)}, 
			  				  function(exception){handleException(exception)});
		}
		else{
	        openmrsRest.create('concept', conceptRequest)
	        			.then(function(success){handleSuccess(success)}, 
	        				  function(exception){handleException(exception)});
		}
        return deferred.promise;        

	}
	/**parse names to array of objects, which can be easily serialized to json to make request
	 * @localizedNames array of concept localized data objects
	 * @returns array of names
	 */
	function parseNames(localizedNames){
		var isFullnamePresent = false;
		var names = [];
		angular.forEach(localizedNames, function(key, value){
			var locale = localizedNames[value].locale;
			//add fullname 
			if(angular.isDefined(localizedNames[value].fullname)
				&&angular.isDefined(localizedNames[value].fullname.name) 
				&&localizedNames[value].fullname.name != ""){
				
				var isPreferred = 
					(localizedNames[value].preferredName.name === localizedNames[value].fullname.name);
				
				var name = {"name" : localizedNames[value].fullname.name,
							"locale" : locale,
							"conceptNameType" : "FULLY_SPECIFIED",
							"localePreferred" : isPreferred};
				setUuidIfDefined(name, localizedNames[value].fullname);				
				names.push(name);
				isFullnamePresent = true;						
			}
			if(angular.isDefined(localizedNames[value].shortname)
				&&localizedNames[value].shortname.name != ""){

					var name = {"name" : localizedNames[value].shortname.name,
						"locale" : locale,
						"conceptNameType" : "SHORT"};	
					
					setUuidIfDefined(name, localizedNames[value].shortname);
					
					names.push(name);

			}
			if(angular.isDefined(localizedNames[value].searchTerms)
					&&localizedNames[value].searchTerms.length > 0){
				
				for(var j=0; j<localizedNames[value].searchTerms.length;j++){
					if(localizedNames[value].searchTerms[j].name != ""){
						var name = {"name" : localizedNames[value].searchTerms[j].name,
								"locale" : locale,
								"conceptNameType" : "INDEX_TERM"};
						setUuidIfDefined(name, localizedNames[value].searchTerms[j]);
						names.push(name);
					}
				}
			}
			if(angular.isDefined(localizedNames[value].synonyms)
					&&localizedNames[value].synonyms.length > 0){
				
				for(var j=0; j<localizedNames[value].synonyms.length;j++){
					if(localizedNames[value].synonyms[j].name != ""){
						
						var isPreferred = 
							(localizedNames[value].preferredName.name === localizedNames[value].synonyms[j].name);

						var name = {"name" : localizedNames[value].synonyms[j].name,
									"locale" : locale,
									"localePreferred" : isPreferred};
						
						setUuidIfDefined(name, localizedNames[value].synonyms[j]);
						names.push(name);						
					}
				}
			}					
		});
		if(isFullnamePresent) return names;
		else throw "No fully specified name is present!"
	}
	function setUuidIfDefined(requestObj, formObj){
		if(angular.isDefined(formObj.uuid)){
			requestObj.uuid = formObj.uuid;
		}
	}
	/**parse descriptions to array of objects, which can be easily serialized to json to make request
	 * @localizedNames array of concept localized data objects
	 * @returns array of descriptions
	 */
	function parseDescriptions(localizedConcepts){
		var descriptions = [];
		angular.forEach(localizedConcepts, function(key, value){
			//add fullname 
			if(angular.isDefined(localizedConcepts[value].description)
					&&localizedConcepts[value].description.description != ""){
				var description = {"description" : localizedConcepts[value].description.description,
									"locale" : localizedConcepts[value].locale};	
				setUuidIfDefined(description, localizedConcepts[value].description)
				descriptions.push(description);
			}			
		})
		return descriptions
	}
	/**
	 * @names array of names objects of concept
	 * @descriptions array of descriptions objects of concept
	 * @serverLocales array of avalaible locales
	 * @returns array of locales which are contained in any name or description
	 */
	function getLocales (names, descriptions, serverLocales){
		var locales = {};
		//check names
		for(var index=0;index<names.length;index++){
			checkLocale(names[index]);
		}
		//check descriptions
		for(var index=0;index<descriptions.length;index++){
			checkLocale(descriptions[index]);
		}
		//check if input locale is contained by serverLocales
		function checkLocale (input){
			for(var index=0; index<serverLocales.length; index++){
				if(input.locale === serverLocales[index]) locales[serverLocales[index]] = true;
			}
		}
		return Object.keys(locales).sort();
	}

		/**
		 * @names array of names objects of concept
		 * @locale string of locale abbreviation, e.g. "en"
		 * @returns object, which holds full, short name and synonyms for specified locale
		 */
		function getLocaleNames (names, locale){
			//flags for types of locale prefered names
			var shortFlag = "SHORT";
			var fullFlag = "FULLY_SPECIFIED";
			var searchFlag = "INDEX_TERM";
			//holds full, short names and synonyms array
			var localeNames = {};
			localeNames.synonyms = [];
			localeNames.searchTerms = [];
			localeNames.locale = locale;

			for (var index=0;index<names.length;index++){
				if(names[index].locale === locale){
					if(names[index].localePreferred === true) localeNames.preferredName = names[index].name;
					if(names[index].conceptNameType === shortFlag) localeNames.shortname = names[index];
					else if(names[index].conceptNameType === fullFlag){
						localeNames.fullname = names[index];
						localeNames.fullname.valid = true;
					}
					else if(names[index].conceptNameType === searchFlag) localeNames.searchTerms.push(names[index]);
					else localeNames.synonyms.push(names[index]);
				}
			}
		return localeNames;
	};
	/**
	 * @descriptions array of descriptions objects of concept
	 * @locale string of locale abbreviation
	 * @returns string - description of concept for specified locale
	 */
	function getLocaleDescr(descriptions, locale){
		for (var index=0;index<descriptions.length;index++){
			if(descriptions[index].locale === locale){
				return descriptions[index];
			}
		}
	};
	
	function getLocalizedConcepts(names, descriptions, serverLocales){
		var locales = getLocales(names, descriptions, serverLocales);
		var localizedConcepts = {};
		for (var index=0; index < locales.length; index++){
			localizedConcepts[locales[index]] = getLocaleNames(names, locales[index]);
			localizedConcepts[locales[index]].description = getLocaleDescr(descriptions, locales[index]);
			localizedConcepts[locales[index]].locale = locales[index];
			if(angular.isUndefined(localizedConcepts[locales[index]].fullname)){
				localizedConcepts[locales[index]].fullname = { name : "" };
			}
		}
		//if there's no data for given locale, create empty locale concept object
		for (var index=0; index < serverLocales.length; index++){
			if(angular.isUndefined(localizedConcepts[serverLocales[index]])){
				localizedConcepts[serverLocales[index]] = getEmptyLocaleConceptObject(serverLocales[index]);
			}
		}
		return localizedConcepts;
	}
	
	function getEmptyLocalizedConcepts(serverLocales){
		var localizedConcepts = {};
		for (var index=0; index < serverLocales.length; index++){
			localizedConcepts[serverLocales[index]] = getEmptyLocaleConceptObject(serverLocales[index]);
		}
		return localizedConcepts;
	}

	/**
	 * function used to delete concept
	 * @param concept to delete
     */
	function deleteConcept(concept) {
		openmrsRest.purge('concept', concept);
	}
	/**
	 * @returns empty localized concept data object for one locale
	 */
	function getEmptyLocaleConceptObject(locale){
		var empty = {};
		empty.locale = locale;
		empty.fullname = {};
		empty.fullname.name = "";
		empty.preferredName = "";
		empty.shortname;
		empty.searchTerms = [];
		empty.synonyms = [];
		empty.description = {};
		empty.description.description = ""
		return empty;
	}
}
		