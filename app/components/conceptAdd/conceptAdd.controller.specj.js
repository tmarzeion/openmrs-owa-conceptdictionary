'use strict';

/* jasmine specs for controllers go here */
describe('Concept dictionary controllers', function() {

    beforeEach(function(){
        jasmine.addMatchers({
            toEqualData: function(util, customEqualityTesters) {
                return {
                    compare: function(actual, expected) {
                        var passed = angular.equals(actual, expected);
                        return {
                            pass: passed,
                            message: 'Expected ' + actual + (passed ? '' : ' not') + ' to equal ' + expected
                        }
                    }
                }
            }
        });
    });

beforeEach(module('conceptDictionaryApp'));

    describe('controller: ConceptAddController', function() {
    	  var ctrl, scope, $controller, serverLocales, serviceSpy, classes, datatypes, location;    	  

    	  beforeEach(inject(function($rootScope, $controller) {
    		  location = {path: function(){}};
    		  datatypes = {};
    		  datatypes.results = [{uuid : "8d4a6242-c2cc-11de-8d13-0010c6dffd0f"},
    		                       {uuid : "8d4a4488-c2cc-11de-8d13-0010c6dffd0f"}]
    		  
    		  classes = {};
    		  classes.results = [{uuid : "8d4a4488-c2cc-11de-8d13-0010c6dffd0f"}]
    		  
    		  serverLocales = ["en", "es"];
    		  serviceSpy = {
    		    		getEmptyLocaleConceptObject: function() {},
    		    		getEmptyConceptObject: function() {},
    		    	    postConcept: function() {}
    		    	    };    
    		  
      		  spyOn(serviceSpy, "getEmptyLocaleConceptObject").and.returnValue({synonyms : [], searchTerms : [], fullname : {}})
	  		  spyOn(serviceSpy, "getEmptyConceptObject").and.returnValue({conceptClass : "", datatype : "", answers : []})
	  		  spyOn(serviceSpy, "postConcept")
    		    
    	  }));
    	  
    	  it('should invoke activate', inject(function($rootScope, $controller){
      		  scope = $rootScope.$new();
    		  ctrl = $controller('ConceptAddController', {$scope: scope, 
											    			  loadClasses : classes,
											    			  loadDataTypes : datatypes,
											    			  serverLocales : serverLocales,
											    			  conceptsService : serviceSpy,
											    			  $location : location});
    		  
    		  expect(serviceSpy.getEmptyLocaleConceptObject).toHaveBeenCalledTimes(serverLocales.length);
    		  expect(serviceSpy.getEmptyConceptObject).toHaveBeenCalled();
    		  expect(ctrl.isNumeric).toEqualData(true)
    		  expect(ctrl.isCoded).toEqualData(false)   
    	  }));
    	  
		  describe('controller: ConceptAddController', function(){
			  
			  beforeEach(inject(function($rootScope, $controller) {
				  scope = $rootScope.$new();
	    		  ctrl = $controller('ConceptAddController', {$scope: scope, 
												    			  loadClasses : classes,
												    			  loadDataTypes : datatypes,
												    			  serverLocales : serverLocales,
												    			  conceptsService : serviceSpy,
												    			  $location : location}); 
	    	  }));  
			  			  
	    	  it('should invoke post service', inject(function($rootScope, $controller){
	    		  ctrl.postConcept();
	    		  expect(serviceSpy.postConcept).toHaveBeenCalled();
	    	  }));
	    	  it('should add/delete synonyms', inject(function($rootScope, $controller){
	    		  ctrl.pushSynonyms();
	    		  expect(ctrl.selectedLocaleData.synonyms.length).toEqualData(1);
	    		  ctrl.deleteSynonym("");
	    		  expect(ctrl.selectedLocaleData.synonyms.length).toEqualData(0);    		  
	    	  }));
	    	  it('should update answers', inject(function($rootScope, $controller){
	    		  
	    		  expect(ctrl.concept.answers.length).toEqualData(0);
	    		  var answerUpdate = [{uuid : "5"}, {uuid : "6"}]
	    		  ctrl.onAnswerTableUpdate(answerUpdate);
	    		  expect(ctrl.concept.answers.length).toEqualData(answerUpdate.length);
	    	  }));
	    	  it('should update fullname', inject(function($rootScope, $controller){
	    		  var name = "concept name";
	    		  var isValid = true;
	    		  ctrl.onFullnameUpdate(isValid, name)
	    		  expect(ctrl.isFormValid).toEqualData(isValid);
	    		  expect(ctrl.selectedLocaleData.fullname.display).toEqualData(name);
	    	  }));
		  })

    });
})