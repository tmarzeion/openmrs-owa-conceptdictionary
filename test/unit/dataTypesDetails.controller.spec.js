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

    describe('DataTypesDetails', function(){
        var scope, ctrl, $httpBackend;

        beforeEach(inject(function(_$httpBackend_, $rootScope, $controller, Util, DataTypesService, $routeParams){
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET(Util.getOpenmrsContextPath()+'/ws/rest/v1/conceptdatatype/8d4a505e-c2cc-11de-8d13-0010c6dffd0f?v=full').
            respond({name: 'Date Datatype', description: 'Date Field Gen Datatype Handler',
                uuid: '8d4a505e-c2cc-11de-8d13-0010c6dffd0f', hl7Abbreviation: 'DT'
            });

            $routeParams.dataTypeUUID = '8d4a505e-c2cc-11de-8d13-0010c6dffd0f'
            scope = $rootScope.$new();

            ctrl = $controller('DataTypesDetails', {$scope: scope});

        }));

        it('Should load details of dataType', function(){
            $httpBackend.flush();
            expect(scope.singleDataType).toEqualData({name: 'Date Datatype', description: 'Date Field Gen Datatype Handler',
                uuid: '8d4a505e-c2cc-11de-8d13-0010c6dffd0f', hl7Abbreviation: 'DT'});

        });
    });
});