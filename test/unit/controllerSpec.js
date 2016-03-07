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

  beforeEach(module('conceptDictionary'));

  describe('ClassesListCtrl', function(){
    var scope, ctrl, $httpBackend;

    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller, Util, ClassesService) {
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET(Util.getOpenmrsUrl()+'/ws/rest/v1/conceptclass/?v=full').
          respond({results:[{name: 'Anatomy', description: 'Anatomic sites / descriptors', uuid: 'ad491c7a-c2cc-11de-8d13-0010c6dffd0f'},
                   {name: 'Procedure', description: 'Describes a clinical procedure', uuid: 'bd490bf4-c2cc-11de-8d13-0010c6dffd0f'}]});

      scope = $rootScope.$new();

      var loadClasses;
      ClassesService.getAll().then(function(response){
    	  loadClasses = response;
      });
      
      $httpBackend.flush();
      
      ctrl = $controller('ClassesListCtrl', {$scope: scope, loadClasses: loadClasses, $location: location});
    }));


    it('should create "classes" model with 2 classes fetched', function() {
      expect(scope.classes).toEqualData(
    		  [{name: 'Anatomy', description: 'Anatomic sites / descriptors', uuid: 'ad491c7a-c2cc-11de-8d13-0010c6dffd0f'},
               {name: 'Procedure', description: 'Describes a clinical procedure', uuid: 'bd490bf4-c2cc-11de-8d13-0010c6dffd0f'}]);
    });
  });  
});