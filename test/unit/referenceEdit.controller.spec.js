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

    describe('ReferenceEditController', function() {
        var scope, ctrl, $httpBackend;

        beforeEach(inject(function(_$httpBackend_, $rootScope, $controller, openmrsRest) {
            $httpBackend = _$httpBackend_;
            $httpBackend.whenGET('/ws/rest/v1/conceptreferenceterm/83f9cdf3-b374-42d0-9b70-1a4020a0ee42?v=full').
            respond(
                {
                    results:
                    {
                        uuid: '83f9cdf3-b374-42d0-9b70-1a4020a0ee42',
                        display: 'org.openmrs.module.mdrtb: Respiratory rate (RESPIRATORY RATE)',
                        name: 'Respiratory rate',
                        conceptSource:
                        {
                            uuid: '17318d62-4237-4d68-86d4-f9d176872859',
                            display: 'org.openmrs.module.mdrtb'
                        },
                        description: 'Respiratory rate description',
                        code:'RESPIRATORY RATE',
                        version: '1',
                        retired: false
                    }
                }
            );
            $httpBackend.whenPOST('/ws/rest/v1/conceptreferenceterm/83f9cdf3-b374-42d0-9b70-1a4020a0ee42').
            respond(
                {
                    results:
                    {
                        uuid: '83f9cdf3-b374-42d0-9b70-1a4020a0ee42',
                        display: 'org.openmrs.module.mdrtb: Respiratory rate (RESPIRATORY RATE)',
                        name: 'Respiratory rate',
                        conceptSource:
                        {
                            uuid: '17318d62-4237-4d68-86d4-f9d176872859',
                            display: 'org.openmrs.module.mdrtb'
                        },
                        description: 'Respiratory rate description',
                        code:'RESPIRATORY RATE',
                        version: '1',
                        retired: false
                    }
                }
            );

            scope = $rootScope.$new();

            var reference;
            openmrsRest.getFull('conceptreferenceterm', {uuid : '83f9cdf3-b374-42d0-9b70-1a4020a0ee42'}).then(function(response){
                reference = response.results;
            });

            $httpBackend.flush();

            var sources = {
                uuid: '17318d62-4237-4d68-86d4-f9d176872859',
                display: 'org.openmrs.module.mdrtb'
            };

            ctrl = $controller('ReferenceEditController', {$scope: scope, reference: reference, sources: sources});
        }));

        it('should edit existing class ', function() {
            ctrl.save();
            $httpBackend.flush();
            expect(ctrl.success).toEqualData(true);
        });

    });
});