angular
		.module('conceptDictionaryApp')
		.factory('conceptsService', conceptsService);				

		conceptsService.$inject = ['openmrsRest']
		function conceptsService(openmrsRest){

			var service = {
					getEmptyConceptObject: getEmptyConceptObject,
					getEmptyLocaleConceptObject: getEmptyLocaleConceptObject,
					parseNames: parseNames,
					parseDescriptions : parseDescriptions,
					postConcept: postConcept,
					getLocales: getLocales,
					getLocaleNames: getLocaleNames,
					getLocaleDescr: getLocaleDescr
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
			function getEmptyLocaleConceptObject(locale){
				var empty = {};
				empty.locale = locale;
				empty.fullname = {};
				empty.fullname.display;
				empty.preferredName = "";
				empty.shortname;
				empty.searchTerms = [];
				empty.synonyms = [];
				empty.description;
				return empty;
			}
			function postConcept(concept, localizedConcepts){
				var conceptRequest = {};
				var result= {};
				try{
					conceptRequest.names = parseNames(localizedConcepts);
				}catch(err){
					result.success = false;
					result.message = err;
					return result;
				}

				conceptRequest.descriptions = parseDescriptions(localizedConcepts);
				conceptRequest.datatype = concept.datatype;
				conceptRequest.conceptClass = concept.conceptClass;
				if(concept.version !== "")conceptRequest.version = concept.version;
				if(concept.set){
					conceptRequest.set = concept.set;
					conceptRequest.setMembers = concept.setMembers;
				}
				//if coded
				if(concept.datatype === "8d4a48b6-c2cc-11de-8d13-0010c6dffd0f"){
					conceptRequest.answers = concept.answers;
				}
				//if complex TODO implement
				if(concept.datatype === "8d4a6242-c2cc-11de-8d13-0010c6dffd0f"){
					
				}
				//if numeric
				if(concept.datatype === "8d4a4488-c2cc-11de-8d13-0010c6dffd0f"){
					if(concept.hiAbsolute)conceptRequest.hiAbsolute = concept.hiAbsolute ;
					if(concept.hiCritical)conceptRequest.hiCritical = concept.hiCritical;
					if(concept.hiNormal)conceptRequest.hiNormal = concept.hiNormal;
					if(concept.lowAbsolute)conceptRequest.lowAbsolute = concept.lowAbsolute;
					if(concept.lowCritical)conceptRequest.lowCritical = concept.lowCritical;
					if(concept.lowNormal)conceptRequest.lowNormal = concept.lowNormal;
					if(concept.displayPrecision)conceptRequest.displayPrecision = concept.displayPrecision;
					if(concept.units)conceptRequest.units = concept.units;
					if(concept.allowDecimal !== null)conceptRequest.allowDecimal = concept.allowDecimal;
				}
				
				var conceptJson = angular.toJson(conceptRequest);
	            openmrsRest.create('concept', conceptJson).then(
			               function(success) {
			            	   
			                result.success = true;
			                result.message = success.display + " had been saved";
			                
			            }, function(exception) {
		
		                	result.success = false;
		                	result.message = exception.statusText;
		
			            });
	            return result;
			}
			function parseNames(localizedNames){
				var isFullnamePresent = false;
				var names = [];
				angular.forEach(localizedNames, function(key, value){
					var locale = localizedNames[value].locale;
					//add fullname 
					if(angular.isDefined(localizedNames[value].fullname.display) 
						&&localizedNames[value].fullname.display != ""){
						
						var isPreferred = 
							(localizedNames[value].preferredName.display === localizedNames[value].fullname.display);
						
						names.push({"name" : localizedNames[value].fullname.display,
									"locale" : locale,
									"conceptNameType" : "FULLY_SPECIFIED",
									"localePreferred" : isPreferred});
						isFullnamePresent = true;						
					}
					if(angular.isDefined(localizedNames[value].shortname)
						&&localizedNames[value].shortname.display != ""){

							names.push({"name" : localizedNames[value].shortname.display,
								"locale" : locale,
								"conceptNameType" : "SHORT"});	

					}
					if(localizedNames[value].searchTerms.length > 0){
						for(var j=0; j<localizedNames[value].searchTerms.length;j++){
							if(localizedNames[value].searchTerms[j].display != "")
								
								names.push({"name" : localizedNames[value].searchTerms[j].display,
											"locale" : locale,
											"conceptNameType" : "INDEX_TERM"});
						}
					}
					if(localizedNames[value].synonyms.length > 0){
						for(var j=0; j<localizedNames[value].synonyms.length;j++){
							if(localizedNames[value].synonyms[j].display != ""){
								
								var isPreferred = 
									(localizedNames[value].preferredName.display === localizedNames[value].synonyms[j].display);

								names.push({"name" : localizedNames[value].synonyms[j].display,
											"locale" : locale,
											"localePreferred" : isPreferred});
							}
						}
					}					
				});
				if(isFullnamePresent) return names;
				else throw "No fully specified name is present!"
			}
			function parseDescriptions(localizedConcepts){
				var descriptions = [];
				angular.forEach(localizedConcepts, function(key, value){
					//add fullname 
					if(angular.isDefined(localizedConcepts[value].description)){
						descriptions.push({"description" : localizedConcepts[value].description,
											"locale" : localizedConcepts[value].locale});						
					}			
				})
				return descriptions
			}
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
				return Object.keys(locales);
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
					var localNames = {};
					localNames.synonyms = [];
					localNames.searchTerms = [];

					for (var index=0;index<names.length;index++){
						if(names[index].locale === locale){
							if(names[index].conceptNameType === shortFlag) localNames.short = names[index].display;
							else if(names[index].conceptNameType === fullFlag) localNames.full = names[index].display;
							else if(names[index].conceptNameType === searchFlag) localNames.searchTerms.push(names[index].display);
							else localNames.synonyms.push(names[index].display);
						}
					}
				return localNames;
			};
			/**
			 * @descriptions array of descriptions objects of concept
			 * @locale string of locale abbreviation
			 * @returns string - description of concept for specified locale
			 */
			function getLocaleDescr(descriptions, locale){
				for (var index=0;index<descriptions.length;index++){
					if(descriptions[index].locale === locale){
						return descriptions[index].display;
					}
				}
			};
		}
		