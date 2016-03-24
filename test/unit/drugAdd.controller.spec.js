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

    describe('DrugAddController', function(){
        var scope, ctrl, $httpBackend;

        beforeEach(inject(function(_$httpBackend_, $rootScope, $controller, openmrsRest){
            $httpBackend = _$httpBackend_;
            $httpBackend.whenPOST('/ws/rest/v1/drug').
            respond({ name: 'Morphine', 
            		strength: 'high', 
            		uuid: "2b22dc27-72ec-4ab5-9fa8-d98be91adc1c"});            
            $httpBackend.whenGET('/ws/rest/v1/conceptclass?v=full').respond({});      
            $httpBackend.whenGET('/ws/rest/v1/drug?v=full').respond({});
            $httpBackend.whenGET('partials/index-menu.html').respond();
            $httpBackend.whenGET('partials/drugs-list.html').respond();

            scope = $rootScope.$new();


            $httpBackend.flush();

            ctrl = $controller('DrugAddController', {$scope: scope});

        }));

        it('Should add new drug', function(){
        	
        	ctrl.name = "Morphine";
			ctrl.concept = "3g65dc27-72ec-4ab5-9fa8-d98be91adb5b";
			ctrl.strength = "high";
			ctrl.retired = "false";
			ctrl.saveDrug();
			$httpBackend.flush();
            expect(ctrl.responseMessage).toEqualData({ name: 'Morphine',
													strength: 'high', 
													uuid: "2b22dc27-72ec-4ab5-9fa8-d98be91adc1c"});
        });

    });
});