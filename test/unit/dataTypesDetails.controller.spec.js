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

    describe('DataTypesDetailsController', function(){
        var scope, ctrl, $httpBackend;

        beforeEach(inject(function(_$httpBackend_, $rootScope, $controller, Util, $routeParams, openmrsRest){
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET(Util.getOpenmrsContextPath()+'/ws/rest/v1/conceptdatatype/8d4a505e-c2cc-11de-8d13-0010c6dffd0f?v=full').
            respond({name: 'Date Datatype', description: 'Date Field Gen Datatype Handler',
                uuid: '8d4a505e-c2cc-11de-8d13-0010c6dffd0f', hl7Abbreviation: 'DT'
            });

            scope = $rootScope.$new();
            
            loadDataType = openmrsRest.getFull('conceptdatatype', {uuid: "8d4a505e-c2cc-11de-8d13-0010c6dffd0f"}).then(function(response){
            	return response;	
            });
            $httpBackend.flush();

            ctrl = $controller('DataTypesDetailsController', {$scope: scope, loadDataType: loadDataType});

        }));

        it('Should load details of dataType', function(){
            expect(ctrl.singleDataType.$$state.value).toEqualData({name: 'Date Datatype', description: 'Date Field Gen Datatype Handler',
                uuid: '8d4a505e-c2cc-11de-8d13-0010c6dffd0f', hl7Abbreviation: 'DT'});

        });
    });
});