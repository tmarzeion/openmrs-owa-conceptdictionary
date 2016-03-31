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

    describe('DrugEditController', function(){
        var scope, ctrl, $httpBackend;

        beforeEach(inject(function(_$httpBackend_, $rootScope, $controller, openmrsRest){
            $httpBackend = _$httpBackend_;
            $httpBackend.whenGET('/ws/rest/v1/drug/2b22dc27-72ec-4ab5-9fa8-d98be91adc1c?v=full').
            respond({ name: 'Morphine', 
            		strength: 'high', 
            		uuid: "2b22dc27-72ec-4ab5-9fa8-d98be91adc1c"});   
            $httpBackend.whenPOST('/ws/rest/v1/drug/2b22dc27-72ec-4ab5-9fa8-d98be91adc1c').
            respond({ name: 'Morphine', 
            		strength: 'high', 
            		uuid: "2b22dc27-72ec-4ab5-9fa8-d98be91adc1c"});   
            $httpBackend.whenGET('/ws/rest/v1/drug?includeAll=true&v=full').respond();         
            $httpBackend.whenGET('/ws/rest/v1/conceptclass?v=full').respond({});      
            $httpBackend.whenGET('/ws/rest/v1/drug?v=full').respond({});
            $httpBackend.whenGET('components/indexMenu/indexMenu.html').respond();
            $httpBackend.whenGET('components/drugList/drugList.html').respond();

            scope = $rootScope.$new();
            
            var loadDrug;
            openmrsRest.getFull('drug', {uuid: "2b22dc27-72ec-4ab5-9fa8-d98be91adc1c"}).then(function(response){
            	loadDrug = response;
            });


            $httpBackend.flush();

            ctrl = $controller('DrugEditController', {$scope: scope, loadDrug: loadDrug});

        }));

        it('Should load one drug', function(){
            expect(ctrl.drug).toEqualData({ name: 'Morphine',
													strength: 'high', 
													uuid: "2b22dc27-72ec-4ab5-9fa8-d98be91adc1c"});
        });
        it('Should save edited drug', function(){
        	
        	ctrl.drug.name = "Morphine";
			ctrl.drug.concept = "3g65dc27-72ec-4ab5-9fa8-d98be91adb5b";
			ctrl.drug.strength = "high";
			ctrl.drug.combination = true;
			ctrl.drug.retired = "false";
			ctrl.drug.route = "123";
			ctrl.drug.dosageForm = "234";
			ctrl.saveDrug();
			$httpBackend.flush();
            expect(ctrl.responseMessage).toEqualData({ name: 'Morphine',
													strength: 'high', 
													uuid: "2b22dc27-72ec-4ab5-9fa8-d98be91adc1c"});
        });

    });
});