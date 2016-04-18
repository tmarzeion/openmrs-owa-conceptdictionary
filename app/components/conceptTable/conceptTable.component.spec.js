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

    describe('component: conceptUniqueName', function() {
    	  var component, scope, $componentController, updateSpy, testMembers;    	  

    	  beforeEach(inject(function($rootScope, _$componentController_) {
    	    scope = $rootScope.$new();
    	    $componentController = _$componentController_;
  		  	updateSpy = jasmine.createSpy('updateSpy');
  		  	component = $componentController('conceptTable', {$scope: scope}, {onUpdate : updateSpy});
  		  	component.members = ["member1", "member2", "member3", "member4", "member5"];
    	  }));

    	  it('should push member and call update', function(){
    		  component.cachedMember = "newMember";
    		  component.pushMembers();
    		  expect(component.members.length).toEqualData(6);
    		  expect(component.cachedMember.display).toEqualData("");
    		  expect(updateSpy).toHaveBeenCalled();
    	  });
    	  it('should push member and call update', function(){
    		  component.selectedMember = "member3";
    		  component.deleteMember();
    		  expect(component.members.length).toEqualData(4);
    		  expect(component.members.indexOf("member3")).toEqualData(-1);
    	  });
    	  it('should push member and call update', function(){
    		  component.selectedMember = "member3";
    		  component.deleteMember();
    		  expect(component.members.length).toEqualData(4);
    		  expect(component.members.indexOf("member3")).toEqualData(-1);
    	  });
    	  it('should push member and call update', function(){
    		  component.selectedMember = "member3";
    		  expect(component.members.indexOf("member3")).toEqualData(2);
    		  component.swapMembers("up");
    		  expect(component.members.indexOf("member3")).toEqualData(1);
    		  component.swapMembers("down");
    		  expect(component.members.indexOf("member3")).toEqualData(2);
    	  });
    	  
});})