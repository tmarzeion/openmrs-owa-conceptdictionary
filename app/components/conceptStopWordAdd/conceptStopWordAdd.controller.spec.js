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
describe('Concept dictionary controllers', function () {

    beforeEach(function () {
        jasmine.addMatchers({
            toEqualData: function (util, customEqualityTesters) {
                return {
                    compare: function (actual, expected) {
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

    describe('ConceptStopWordAddController', function () {
        var scope, ctrl, $httpBackend, location;

        beforeEach(inject(function (_$httpBackend_, $rootScope, $controller, _$location_) {
            $httpBackend = _$httpBackend_;
            $httpBackend.whenGET('/ws/rest/v1/conceptclass?v=full').respond({});
            $httpBackend.whenGET('components/indexMenu/indexMenu.html').respond();
            $httpBackend.whenGET('components/conceptStopWordList/conceptStopWordList.html').respond();
            $httpBackend.whenGET('/ws/rest/v1/conceptstopword?v=full').respond();
            $httpBackend.whenGET('partials/conceptstopword.html').respond();
            $httpBackend.expectPOST('/ws/rest/v1/conceptstopword')
                .respond(
                    {
                        results: {
                            value: 'AND',
                            locale: 'en'
                        }
                    });

            scope = $rootScope.$new();

            location = _$location_;

            var newConceptStopWord = {
                value: 'AND',
                locale: 'en'
            };

            var serverLocales =["en","es","fr","it","pt"];

            ctrl = $controller('ConceptStopWordAddController', {$scope: scope, $location: _$location_, serverLocales : serverLocales});
            ctrl.conceptStopWord = newConceptStopWord;
        }));

        it('should add new concept stop word ', function () {
            ctrl.addConceptStopWord();
            $httpBackend.flush();
            expect(ctrl.success).toEqualData(true);
        });
    });
});