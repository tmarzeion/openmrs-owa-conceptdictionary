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

    describe('component: conceptUniqueName', function() {
    	  var component, scope, $componentController, $httpBackend, 
    	  	  concept, onUpdate, response1, response2, response3, updateSpy;
    	  

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
              $httpBackend.whenGET('components/indexMenu/indexMenu.html').respond();
              $httpBackend.whenGET('/ws/rest/v1/conceptclass?v=full').respond({});
    		  $httpBackend.whenGET('/ws/rest/v1/concept').respond(response1);
    		  $httpBackend.whenGET('/ws/rest/v1/concept?includeAll=true&q=some&v=full').respond(response2);
    		  $httpBackend.whenGET('/ws/rest/v1/concept?includeAll=true&q=concept+name&v=full').respond(response3);
    	    scope = $rootScope.$new();
    	    $componentController = _$componentController_;
    	    
    	  }));

    	  it('should update concept property when it is changed in outer scope', function(){
      	      concept = {
      	    		  display:'init query'
      	      }
    		  component = $componentController('conceptUniqueName', {$scope: scope}, {concept: concept});
      	      expect(component.concept.display).toEqualData("init query");
      	      concept.display = "next query";
      	      expect(component.concept.display).toEqualData("next query");
    	  });
    	  it('should send request with specific query and invoke onUpdate', function(){
      	      concept = {
      	    		  display:'some'
      	      }
      	      updateSpy = jasmine.createSpy('updateSpy');
    		  component = $componentController('conceptUniqueName', {$scope: scope}, {concept: concept, onUpdate : updateSpy});
      	      component.search();
    		  $httpBackend.flush();
    		  expect(component.concepts).toEqualData(response2.results);
    		  expect(component.isDuplicate).toEqualData(false);
    		  expect(updateSpy).toHaveBeenCalled();
    	  });
    	  it('should send request with specific query and find out that name is duplicate', function(){
      	      concept = {
      	    		  display:'concept name'
      	      }
      	      updateSpy = jasmine.createSpy('updateSpy');
    		  component = $componentController('conceptUniqueName', {$scope: scope}, {concept: concept, onUpdate : updateSpy});
      	      component.search();
    		  $httpBackend.flush();
    		  expect(component.isDuplicate).toEqualData(true);
    	  });
});})