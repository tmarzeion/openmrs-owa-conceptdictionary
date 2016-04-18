/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
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

beforeEach(angular.mock.module('conceptDictionaryApp'));

    describe('controller: ConceptViewController', function() {
    	  var ctrl, scope, $controller, serverLocales, serviceSpy,concept;    	  

    	  beforeEach(inject(function($rootScope, $controller) {

    		  concept = {datatype : {display : "Numeric"},
    				  	 name : {locale : "en"},
    				  	 names : {},
    				  	 descriptions : {}};
    		  serverLocales = ["en", "es"];
    		    serviceSpy = {
    		    	      getLocales: function() {},
    		    	      getLocaleDescr: function() {},
    		    	      getLocaleNames: function() {}
    		    	    };    		  
    		    
    	  }));
    	  
    	  it('should invoke activate, check datatype and locales', inject(function($rootScope, $controller){
    		  spyOn(serviceSpy, "getLocales")
	  		  spyOn(serviceSpy, "getLocaleNames")
	  		  spyOn(serviceSpy, "getLocaleDescr")
      		  scope = $rootScope.$new();
    		  ctrl = $controller('ConceptViewController', {$scope: scope, 
											    			  concept : concept, 
											    			  serverLocales : serverLocales,
											    			  conceptsService : serviceSpy});
    		  expect(serviceSpy.getLocales).toHaveBeenCalled();
    		  expect(serviceSpy.getLocaleNames).toHaveBeenCalled();
    		  expect(serviceSpy.getLocaleDescr).toHaveBeenCalled();
    		  expect(ctrl.isNumeric).toEqualData(true);
    		  expect(ctrl.isCoded).toEqualData(false);
    	  }));

});})