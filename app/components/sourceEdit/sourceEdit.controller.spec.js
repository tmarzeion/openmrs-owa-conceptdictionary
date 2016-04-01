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

    describe('SourceEditController', function() {
        var scope, ctrl, $httpBackend;

        beforeEach(inject(function(_$httpBackend_, $rootScope, $controller, openmrsRest) {
            $httpBackend = _$httpBackend_;
            $httpBackend.whenGET('/ws/rest/v1/conceptclass?v=full').respond({});
            $httpBackend.whenGET('components/sourceList/sourceList.html').respond();
            $httpBackend.whenGET('components/indexMenu/indexMenu.html').respond();
            $httpBackend.whenGET('/ws/rest/v1/conceptsource?includeAll=true&v=full').respond();
            $httpBackend.whenGET('/ws/rest/v1/conceptsource/42f9cdf3-b124-42d0-9b70-1a4020a0ee83?v=full').
            respond(
                {
                    results:
                    {
                        uuid: '42f9cdf3-b124-42d0-9b70-1a4020a0ee83',
                        display: 'Source',
                        name: 'Source',
                        description: 'Source description',
                        hl7Code:'SOURCE',
                        retired: false
                    }
                }
            );
            $httpBackend.whenPOST('/ws/rest/v1/conceptsource/42f9cdf3-b124-42d0-9b70-1a4020a0ee83').
            respond(
                {
                    results:
                    {
                        uuid: '42f9cdf3-b124-42d0-9b70-1a4020a0ee83',
                        display: 'Source',
                        name: 'Source',
                        description: 'Source description',
                        hl7Code:'SOURCE',
                        retired: false
                    }
                }
            );

            scope = $rootScope.$new();

            var source;
            openmrsRest.getFull('conceptsource', {uuid : '42f9cdf3-b124-42d0-9b70-1a4020a0ee83'}).then(function(response){
                source = response.results;
            });

            $httpBackend.flush();

            ctrl = $controller('SourceEditController', {$scope: scope, sources: source});
        }));

        it('should edit existing conceptSource ', function() {
            ctrl.save();
            $httpBackend.flush();
            expect(ctrl.success).toEqualData(true);
        });

    });
});