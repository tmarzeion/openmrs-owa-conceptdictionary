/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
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
			$httpBackend.whenGET(/translation.*/).respond();
            $httpBackend.whenGET('/ws/rest/v1/conceptclass?v=full').respond({});
            $httpBackend.whenGET('components/indexMenu/indexMenu.html').respond();
            $httpBackend.whenGET('/ws/rest/v1/conceptsource?includeAll=true&v=full').respond();
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