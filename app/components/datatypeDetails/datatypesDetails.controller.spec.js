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

    describe('DatatypeDetailsController', function(){
        var scope, ctrl, $httpBackend;

        beforeEach(inject(function(_$httpBackend_, $rootScope, $controller, $routeParams, openmrsRest){
            $httpBackend = _$httpBackend_;
            $httpBackend.whenGET('/ws/rest/v1/conceptdatatype/8d4a505e-c2cc-11de-8d13-0010c6dffd0f?v=full').
            respond({name: 'Date Datatype', description: 'Date Field Gen Datatype Handler',
                uuid: '8d4a505e-c2cc-11de-8d13-0010c6dffd0f', hl7Abbreviation: 'DT'
            });
            $httpBackend.whenGET('/ws/rest/v1/conceptclass?v=full').respond({});
            $httpBackend.whenGET('components/indexMenu/indexMenu.html').respond();

            scope = $rootScope.$new();
            
            var loadDataType;
            
            openmrsRest.getFull('conceptdatatype', {uuid: "8d4a505e-c2cc-11de-8d13-0010c6dffd0f"}).then(function(response){
            	loadDataType = response;	
            });
            $httpBackend.flush();

            ctrl = $controller('DatatypeDetailsController', {$scope: scope, loadDataType: loadDataType});

        }));

        it('Should load details of dataType', function(){
            expect(ctrl.singleDataType).toEqualData({name: 'Date Datatype', description: 'Date Field Gen Datatype Handler',
                uuid: '8d4a505e-c2cc-11de-8d13-0010c6dffd0f', hl7Abbreviation: 'DT'});

        });
    });
});