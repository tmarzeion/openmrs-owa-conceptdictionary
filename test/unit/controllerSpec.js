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
        $httpBackend.whenDELETE(Util.getOpenmrsContextPath()+'/ws/rest/v1/conceptclass/ad491c7a-c2cc-11de-8d13-0010c6dffd0f').respond("DELETE SUCCESS");
    	//deleteSelected function requests updated list.
        $httpBackend.whenGET(Util.getOpenmrsContextPath()+'/ws/rest/v1/conceptclass?v=full')
    							.respond({results:[{name: 'Anatomy', description: 'Anatomic sites / descriptors', uuid: 'ad491c7a-c2cc-11de-8d13-0010c6dffd0f'},
    	                                           {name: 'Procedure', description: 'Describes a clinical procedure', uuid: 'bd490bf4-c2cc-11de-8d13-0010c6dffd0f'}]});
    	//$route.resfresh() requests page html
        $httpBackend.whenGET(Util.getOpenmrsContextPath()+'/ws/rest/v1/conceptclass/?v=full')
		.respond({results:[{name: 'Anatomy', description: 'Anatomic sites / descriptors', uuid: 'ad491c7a-c2cc-11de-8d13-0010c6dffd0f'},
                           {name: 'Procedure', description: 'Describes a clinical procedure', uuid: 'bd490bf4-c2cc-11de-8d13-0010c6dffd0f'}]});

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

    describe('ConceptSearchCtrl', function() {
        var scope, ctrl, $httpBackend;

        beforeEach(inject(function(_$httpBackend_, $rootScope, $controller, Util, ConceptsService) {
            var testQuery = 'Ana';
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET(Util.getOpenmrsContextPath()+'/ws/rest/v1/concept/?v=full&includeAll=true&q=' + testQuery).
            respond(
                {results: [
                    {
                        uuid: '80bd49d3-4a3b-4566-95be-8a4cf4b411f4',
                        display: 'Anaphylaxis',
                        datatype: {description: 'An acute hypersensitivity reaction due to exposure to a previously encountered antigen.' +
                        ' The reaction may include rapidly progressing urticaria, respiratory distress, vascular collapse, systemic shock, and death.'}
                    },
                    {
                        uuid: '3fc4d6bd-7206-4d7d-9ec3-b5fa7822e3df',
                        display: 'Anaemia',
                        datatype: {description: 'A reduction in the number of circulating erythrocytes or in the quantity of hemoglobin.'}
                    },
                    {
                        uuid: 'd0a052f7-b6fd-4f3e-8385-7dc06d6f3806',
                        display: 'Anacin Aspirin Regimen',
                        datatype: {description: 'Name of a drug which is used as anti inflammatory and analgesic.'}
                    }
                ]});

            scope = $rootScope.$new();

            scope.concepts = '';

            ConceptsService.getQueryConcepts(testQuery).then(function (response) {
                scope.concepts = response;
            });

            ctrl = $controller('ConceptSearchCtrl', {$scope: scope, $location: location});
        }));

        it('should get data with specified query', function() {
            $httpBackend.flush();
            expect(scope.concepts).toEqualData(
                {results: [
                    {
                        uuid: '80bd49d3-4a3b-4566-95be-8a4cf4b411f4',
                        display: 'Anaphylaxis',
                        datatype: {description: 'An acute hypersensitivity reaction due to exposure to a previously encountered antigen.' +
                        ' The reaction may include rapidly progressing urticaria, respiratory distress, vascular collapse, systemic shock, and death.'}
                    },
                    {
                        uuid: '3fc4d6bd-7206-4d7d-9ec3-b5fa7822e3df',
                        display: 'Anaemia',
                        datatype: {description: 'A reduction in the number of circulating erythrocytes or in the quantity of hemoglobin.'}
                    },
                    {
                        uuid: 'd0a052f7-b6fd-4f3e-8385-7dc06d6f3806',
                        display: 'Anacin Aspirin Regimen',
                        datatype: {description: 'Name of a drug which is used as anti inflammatory and analgesic.'}
                    }
                ]});
        });
    });
    
    describe('ConceptViewCtrl and Services', function(){
    	//declare variables    	
    	var concept1;
    	var expectedNames1;
    	var expectedDescr1;
    	
    	var concept2;
    	var expectedNames2;
    	var expectedDescr2;
    	
    	var serverLocales = ["en", "es", "pt", "it", "fr"];
    	
    	beforeEach(function(){
    		//initialize variables and insert values
    		concept1 = {datatype: { display : 'Numeric'}, 
    						names: [{display: 'engName1', locale: 'en', conceptNameType: 'FULLY_SPECIFIED'},
    								{display: 'engName1', locale: 'en', conceptNameType: 'SHORT'},
    								{display: 'EspName1', locale: 'es', conceptNameType: 'FULLY_SPECIFIED'},
    								{display: 'EspName1', locale: 'es', conceptNameType: 'INDEX_TERM'}],
    						descriptions: [{display: "engDescr", locale: "en"},
    										{display: "EspDescr", locale: "es"}]};
    		expectedNames1={}
    		expectedNames1.short = 'engName1';
    		expectedNames1.full = 'engName1';
    		expectedNames1.synonyms = [];
    		expectedNames1.searchTerms = [];
    		
    		expectedDescr1 = 'engDescr';
    		
    		concept2 = {datatype: { display : "Numeric"}, 
					names: [{display: "engName2", locale: "en", conceptNameType: "FULLY_SPECIFIED"},
							{display: "engName2", locale: "es", conceptNameType: "SHORT"},
							{display: "EspName2", locale: "fr", conceptNameType: "FULLY_SPECIFIED"},
							{display: "EspName2", locale: "it", conceptNameType: "INDEX_TERM"}],
					descriptions: [{display: "engDescr", locale: "en"},
									{display: "EspDescr", locale: "es"}]}
    		expectedNames2={};
    		expectedNames2.full = "engName2";
    		expectedNames2.synonyms = [];
    		expectedNames2.searchTerms = [];
    		expectedDescr2 = "engDescr";
    	});
    	
    	it('should return array of locales', inject(function(ConceptLocaleService){
    		expect(ConceptLocaleService.getLocales(concept1.names, concept1.descriptions, serverLocales))
    														.toEqualData(["en", "es"]);
    		expect(ConceptLocaleService.getLocales(concept2.names, concept2.descriptions, serverLocales))
    														.toEqualData(["en", "es", "fr", "it"]);
    	}));
    	
    	it('should return Object containing english names', inject(function(ConceptLocaleService){
    		var obtained1 = ConceptLocaleService.getLocaleNames(concept1.names, "en");
    		expect(obtained1).toEqualData(expectedNames1);
    		var obtained2 = ConceptLocaleService.getLocaleNames(concept2.names, "en");
    		expect(obtained2).toEqualData(expectedNames2);
    	}));
    	
    	it('should return Object containing english descriptions', inject(function(ConceptLocaleService){
    		var obtained1 = ConceptLocaleService.getLocaleDescr(concept1.descriptions, "en");
    		expect(obtained1).toEqualData(expectedDescr1);
    		var obtained2 = ConceptLocaleService.getLocaleDescr(concept2.descriptions, "en");
    		expect(obtained2).toEqualData(expectedDescr2);
    	}));
    	
    	describe('ConceptViewCtrl', function(){
        	var scope, $httpBackend, $q, createController;
        	
    		beforeEach(inject(function(_$httpBackend_,_$q_, _$rootScope_, $controller, Util, ConceptsService, ConceptLocaleService){
        		$httpBackend = _$httpBackend_;
        		$httpBackend.whenGET(Util.getOpenmrsContextPath()+'/ws/rest/v1/concept/d2f5af2c-0d30-4a29-b489-5a6e5a277b9d?v=full')
        		.respond(concept1);
        		//$httpBackend.whenGET(Util.getOpenmrsContextPath()+'/ws/rest/v1/concept/d2f5af2c-0d30-4a29-b489-5a6e5a277b9d?v=full')
        		//.respond(concept2);
        		$q = _$q_;
        		scope = _$rootScope_.$new();
        	      
        	    //$httpBackend.flush();
        	      
        		createController = function() {
                    return $controller('ConceptViewCtrl', 
          	    		  {$scope: scope, loadConcept: concept1, ConceptLocaleService : ConceptLocaleService, $q : $q});
                };
        		
        	}));
    		
    		it('should initialize the ConceptViewCtrl', function(){
    			
    		})
    	})
    })
});