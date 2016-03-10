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
      $httpBackend.expectGET(Util.getOpenmrsContextPath()+'/ws/rest/v1/conceptclass/?v=full').
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
    
    it('should send delete request at uuid adress extracted from selection map', inject(function(Util) {
    	//handles delete request for specified class
        $httpBackend.whenDELETE(Util.getOpenmrsContextPath()+'/ws/rest/v1/conceptclass/ad491c7a-c2cc-11de-8d13-0010c6dffd0f?').respond("DELETE SUCCESS");
    	//deleteSelected function requests updated list.
        $httpBackend.whenGET(Util.getOpenmrsContextPath()+'/ws/rest/v1/conceptclass/?v=full')
    							.respond({results:[{name: 'Anatomy', description: 'Anatomic sites / descriptors', uuid: 'ad491c7a-c2cc-11de-8d13-0010c6dffd0f'},
    	                                           {name: 'Procedure', description: 'Describes a clinical procedure', uuid: 'bd490bf4-c2cc-11de-8d13-0010c6dffd0f'}]});
    	//$route.resfresh() requests page html
    	$httpBackend.whenGET(Util.getOpenmrsContextPath()+'partials/class-list.html').respond("class list partial page");
    	
    	scope.selected = {'ad491c7a-c2cc-11de-8d13-0010c6dffd0f' : true }
    	scope.deleteSelected();
        $httpBackend.flush();

    	//expect delete fails test if no request is made
      }));
  });

    describe('ClassAddCtrl', function() {
        var scope, ctrl, $httpBackend;

        beforeEach(inject(function(_$httpBackend_, $rootScope, $controller, Util, ClassesService) {
            $httpBackend = _$httpBackend_;
            $httpBackend.expectPOST(Util.getOpenmrsContextPath()+'/ws/rest/v1/conceptclass/?').
            respond({results:{name: 'Anatomy', description: 'Anatomic sites / descriptors'}});

            scope = $rootScope.$new();

            var newClass = {
                name:'Anatomy',
                description:'Anatomic sites / descriptors'
            };

            newClass = angular.toJson(newClass);

            ClassesService.addClass(newClass).then(function(success){
                scope.response = success;
            });

            $httpBackend.flush();

            ctrl = $controller('ClassAddCtrl', {$scope: scope, $location: location});
        }));

        it('should add new class ', function() {
            expect(scope.response.results).toEqualData(
                {name: 'Anatomy', description: 'Anatomic sites / descriptors'});
        });
    });

    describe('ClassesEditCtrl', function() {
        var scope, ctrl, $httpBackend;

        beforeEach(inject(function(_$httpBackend_, $rootScope, $controller, Util, ClassesService, $routeParams) {
            $httpBackend = _$httpBackend_;
            $httpBackend.whenGET(Util.getOpenmrsContextPath()+'/ws/rest/v1/conceptclass/8d490bf4-c2cc-11de-8d13-0010c6dffd0f?v=full').
            respond({results:{uuid: '8d490bf4-c2cc-11de-8d13-0010c6dffd0f',
                name: 'Question', description: 'Question (eg, patient history, SF36 items)'}});
            $httpBackend.whenPOST(Util.getOpenmrsContextPath()+'/ws/rest/v1/conceptclass/8d490bf4-c2cc-11de-8d13-0010c6dffd0f?').
            respond({results:{uuid: '8d490bf4-c2cc-11de-8d13-0010c6dffd0f',
                name: 'Question', description: 'Question (eg, patient history, SF36 items)'}});

            scope = $rootScope.$new();

            scope.getResponse;
            ClassesService.getClass({uuid : '8d490bf4-c2cc-11de-8d13-0010c6dffd0f'}).$promise.then(function(response){
                scope.getResponse = response;
            });


            $httpBackend.flush();

            scope.uuid = scope.getResponse.results.uuid;

            var editedClass = {
                name: scope.getResponse.results.name,
                description:scope.getResponse.results.description
            };

            editedClass = angular.toJson(editedClass);

            scope.postResponse;

            ClassesService.editClass(scope.uuid, editedClass).then(function(response){
                scope.postResponse = response;
            });

            $httpBackend.flush();

            ctrl = $controller('ClassesEditCtrl', {$scope: scope, $location: location});
        }));


        it('should edit existing class ', function() {
            expect(scope.postResponse.results).toEqualData(
                {uuid: '8d490bf4-c2cc-11de-8d13-0010c6dffd0f', name: 'Question', description: 'Question (eg, patient history, SF36 items)'});
        });

    });
    
    describe('DataTypesListCtrl', function(){
   	 var scope, ctrl, $httpBackend;
   	 
   	 beforeEach(inject(function(_$httpBackend_, $rootScope, $controller, Util, DataTypesService, $routeParams){
   		 $httpBackend = _$httpBackend_;
            $httpBackend.expectGET(Util.getOpenmrsContextPath()+'/ws/rest/v1/conceptdatatype/?v=full').
            respond({results:[{name: 'Date Datatype', description: 'Date Field Gen Datatype Handler'},
                              {name: 'Boolean Datatype', description: 'Boolean Field Gen Datatype Handler'}]});
            
            scope = $rootScope.$new();
            
            var loadDataTypes;
            DataTypesService.getAll().then(function(response){
            	loadDataTypes = response;
            });
            
            $httpBackend.flush();
            
            ctrl = $controller('DataTypesListCtrl', {$scope: scope, loadDataTypes: loadDataTypes});

   	 }));
   	 
   	 it('Should load all dataTypes', function(){ 
   		 
   		 expect(scope.dataTypes).toEqualData([{name: 'Date Datatype', description: 'Date Field Gen Datatype Handler'},
   		                                     {name: 'Boolean Datatype', description: 'Boolean Field Gen Datatype Handler'}]);
   		 
   	 });
   	
   });
    
   describe('DataTypesDetailsCtrl', function(){
	   var scope, ctrl, $httpBackend;
	   
	   beforeEach(inject(function(_$httpBackend_, $rootScope, $controller, Util, DataTypesService, $routeParams){
	   		 $httpBackend = _$httpBackend_;
	         $httpBackend.expectGET(Util.getOpenmrsContextPath()+'/ws/rest/v1/conceptdatatype/8d4a505e-c2cc-11de-8d13-0010c6dffd0f?v=full').
	         respond({name: 'Date Datatype', description: 'Date Field Gen Datatype Handler',
	        	 				uuid: '8d4a505e-c2cc-11de-8d13-0010c6dffd0f', hl7Abbreviation: 'DT'
	        	 				});
	            
	         $routeParams.dataTypeUUID = '8d4a505e-c2cc-11de-8d13-0010c6dffd0f'   
	         scope = $rootScope.$new();
	            
	         ctrl = $controller('DataTypesDetailsCtrl', {$scope: scope});

	   	 }));
	   	 
	   	 it('Should load details of dataType', function(){ 	   		
	   		 $httpBackend.flush();
	   		 expect(scope.singleDataType).toEqualData({name: 'Date Datatype', description: 'Date Field Gen Datatype Handler',
	 				uuid: '8d4a505e-c2cc-11de-8d13-0010c6dffd0f', hl7Abbreviation: 'DT'});
	   		 
	   	 });
   });
});