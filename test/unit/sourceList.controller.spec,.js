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

    describe('SourcesListController', function(){
        var ctrl, $httpBackend, sources;

        beforeEach(inject(function(_$httpBackend_, $controller ,openmrsRest) {
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET('/ws/rest/v1/conceptsource?includeAll=true&v=full')
                .respond(
                    {
                        results:
                            [
                                {
                                    uuid: '42f9cdf3-b124-42d0-9b70-1a4020a0ee83',
                                    display: 'First source',
                                    name: 'First source',
                                    description: 'First source description',
                                    hl7Code:'FIRSTSOURCE',
                                    retired: false
                                },
                                {
                                    uuid: '42f9cdf3-b124-42d0-9b70-1a4020a0ee83',
                                    display: 'Second source',
                                    name: 'Second source',
                                    description: 'Second source description',
                                    hl7Code:'SECONDSOURCE',
                                    retired: false
                                }
                            ]
                    }
                );

            openmrsRest.listFull('conceptsource', {includeAll : true}).then(function(response){
                sources = response;
            });

            $httpBackend.flush();



            ctrl = $controller('SourcesListController', {
                sources: sources
            });
        }));

        it('should create concept sources model with 2 sources fetched', function() {

            expect(ctrl.sources).toEqualData(
                [
                    {
                        uuid: '42f9cdf3-b124-42d0-9b70-1a4020a0ee83',
                        display: 'First source',
                        name: 'First source',
                        description: 'First source description',
                        hl7Code:'FIRSTSOURCE',
                        retired: false
                    },
                    {
                        uuid: '42f9cdf3-b124-42d0-9b70-1a4020a0ee83',
                        display: 'Second source',
                        name: 'Second source',
                        description: 'Second source description',
                        hl7Code:'SECONDSOURCE',
                        retired: false
                    }
                ]
            );
        });
    });
});