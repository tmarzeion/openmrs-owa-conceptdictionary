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
    	  var component, scope, $componentController, $httpBackend, 
    	  	  name, onUpdate, response1, response2, response3, updateSpy;
    	  

    	  beforeEach(inject(function(_$httpBackend_, $rootScope, _$componentController_, openmrsRest) {
    		  response1 = {results: [
    		                         {
    		                             uuid: '80bd49d3-4a3b-4566-95be-8a4cf4b411f4',
    		                             display: '1concept1',
    		                         },
    		                         {
    		                             uuid: '3fc4d6bd-7206-4d7d-9ec3-b5fa7822e3df',
    		                             display: '2concept2',
    		                         },
    		                         {
    		                             uuid: 'd0a052f7-b6fd-4f3e-8385-7dc06d6f3806',
    		                             display: '3concept3',
    		                         } 
    		                     ]};
    		  response2 = {results: [
    		                         {
    		                             uuid: '80bd49d3-4a3b-4566-95be-8a4cf4b411f4',
    		                             display: 'some names',
    		                         },
    		                         {
    		                             uuid: '80bd49d3-4a3b-4566-95be-8a4cf4b411f4',
    		                             display: 'some name',
    		                         }]}
    		  response3 = {results: [
    		                         {
    		                             uuid: '80bd49d3-4a3b-4566-95be-8a4cf4b411f4',
    		                             display: 'concept name',
    		                         }]}
    		  $httpBackend = _$httpBackend_;
    		  $httpBackend.whenGET('manifest.webapp').respond(500, "");
			  $httpBackend.whenGET(/translation.*/).respond();
              $httpBackend.whenGET('components/indexMenu/indexMenu.html').respond();
              $httpBackend.whenGET('/ws/rest/v1/conceptclass?v=full').respond({});
    		  $httpBackend.whenGET('/ws/rest/v1/concept').respond(response1);
    		  $httpBackend.whenGET('/ws/rest/v1/concept?includeAll=true&q=some&v=full').respond(response2);
    		  $httpBackend.whenGET('/ws/rest/v1/concept?includeAll=true&q=some+name&v=full').respond(response2);
    		  $httpBackend.whenGET('/ws/rest/v1/concept?includeAll=true&q=concept+name&v=full').respond(response3);
    	    scope = $rootScope.$new();
    	    $componentController = _$componentController_;
    	    
    	  }));

    	  it('should update concept property when it is changed in outer scope', function(){
      	      name = {
      	    		  name:'init query'
      	      }
    		  component = $componentController('conceptUniqueName', {$scope: scope}, {name: name});
      	      expect(component.name.name).toEqualData("init query");
      	      name.name = "next query";
      	      expect(component.name.name).toEqualData("next query");
    	  });
    	  it('should send request with specific query and invoke onUpdate', function(){
      	      name = 'some';
      	      updateSpy = jasmine.createSpy('updateSpy');
    		  component = $componentController('conceptUniqueName', 
    				  {$scope: scope}, {name: name, onUpdate : updateSpy});
      	      component.search();
    		  $httpBackend.flush();
    		  expect(component.concepts).toEqualData(response2.results);
    		  expect(component.isDuplicate).toEqualData(false);
    		  expect(updateSpy).toHaveBeenCalled();
    	  });
    	  it('should send request with specific query and find out that name is duplicate', function(){
      	      name = 'some name';
      	      updateSpy = jasmine.createSpy('updateSpy');
    		  component = $componentController('conceptUniqueName', 
    				  {$scope: scope}, { name: name, onUpdate : updateSpy});
      	      component.search();
    		  $httpBackend.flush();
    		  expect(component.isDuplicate).toEqualData(true);
    	  });
});})