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

    describe('ReferenceSearchController', function() {
        var scope, ctrl, $httpBackend;

        beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
            var testQuery = 'TE';
            $httpBackend = _$httpBackend_;
            $httpBackend.whenGET('/ws/rest/v1/conceptreferenceterm?includeAll=true&limit=5&q=' + testQuery + '&v=full').
            respond(
                {results: [
                    {
                        uuid: '83f9cdf3-b374-42d0-9b70-1a4020a0ee42',
                        display: 'org.openmrs.module.mdrtb: Weight (WEIGHT)',
                        name: 'Weight',
                        conceptSource:
                        {
                            uuid: '17318d62-4237-4d68-86d4-f9d176872859',
                            display: 'org.openmrs.module.mdrtb'
                        },
                        description: 'Weight description',
                        code:'WEIGHT',
                        version: '1',
                        retired: false
                    },
                    {
                        uuid: '15f9c4f3-b344-42d0-9b70-1a4130a0e514',
                        display: 'org.openmrs.module.mdrtb: Temperature (TEMPERATURE)',
                        name: 'Temperature',
                        conceptSource:
                        {
                            uuid: '17128d62-4237-4d68-86d4-f9d176872813',
                            display: 'org.openmrs.module.mdrtb'
                        },
                        description: 'Temperature description',
                        code:'TEMPERATURE',
                        version: '2',
                        retired: true
                    }
                ]});

            $httpBackend.whenGET('/ws/rest/v1/conceptreferenceterm?includeAll=true&q=' + testQuery + '&v=full').
            respond(
                {results: [
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
                    },
                    {
                        uuid: '15f9c4f3-b344-42d0-9b70-1a4130a0e514',
                        display: 'org.openmrs.module.mdrtb: Temperature (TEMPERATURE)',
                        name: 'Temperature',
                        conceptSource:
                        {
                            uuid: '17128d62-4237-4d68-86d4-f9d176872813',
                            display: 'org.openmrs.module.mdrtb'
                        },
                        description: 'Temperature description',
                        code:'TEMPERATURE',
                        version: '2',
                        retired: true
                    }
                ]}
            );

            scope = $rootScope.$new();

            ctrl = $controller('ReferenceSearchController', {$scope: scope, $location: location});

        }));

        it('should get concept reference term data with specified query', function() {
            ctrl.query = "TE";
            ctrl.refreshResponse();
            $httpBackend.flush();

            expect(ctrl.references).toEqualData(
                [
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
                    },
                    {
                        uuid: '15f9c4f3-b344-42d0-9b70-1a4130a0e514',
                        display: 'org.openmrs.module.mdrtb: Temperature (TEMPERATURE)',
                        name: 'Temperature',
                        conceptSource:
                        {
                            uuid: '17128d62-4237-4d68-86d4-f9d176872813',
                            display: 'org.openmrs.module.mdrtb'
                        },
                        description: 'Temperature description',
                        code:'TEMPERATURE',
                        version: '2',
                        retired: true
                    }
                ]);
        });
    });
});