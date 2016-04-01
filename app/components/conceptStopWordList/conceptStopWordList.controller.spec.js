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

    describe('ConceptStopWordListController', function () {
        var ctrl, $httpBackend, loadConceptStopWords;

        beforeEach(inject(function (_$httpBackend_, $controller, openmrsRest, _$location_, _$routeParams_) {
            $httpBackend = _$httpBackend_;
            $httpBackend.whenGET('/ws/rest/v1/conceptclass?v=full').respond({});
            $httpBackend.whenGET('components/indexMenu/indexMenu.html').respond();
            $httpBackend.whenGET('components/conceptStopWordList/conceptStopWordList.html').respond();
            $httpBackend.whenGET('/ws/rest/v1/conceptstopword?v=full')
                .respond({
                        results: [
                            {
                                uuid: 'b63231b5-ca58-4bea-906c-87b2aa73eccf',
                                display: 'AND',
                                locale: 'en'
                            },
                            {
                                uuid: '45e2ff82-3d5e-419a-8ec0-aad37cd56177',
                                display: 'OR',
                                locale: 'en'
                            }
                        ]
                    }
                );
            $httpBackend.whenGET('partials/conceptstopword.html').respond("concept stop word list partial page");

            openmrsRest.listFull('conceptstopword').then(function (response) {
                loadConceptStopWords = response;
                ctrl = $controller('ConceptStopWordListController',
                    {
                        loadConceptStopWords: loadConceptStopWords,
                        $location: _$location_,
                        openmrsRest: openmrsRest,
                        $routeParams: _$routeParams_
                    });
            });
            $httpBackend.flush();
            //handles delete request for specified concept stop words
        }));


        it('should create "conceptStopWords" model with 2 concept stop words fetched', function () {
            expect(ctrl.conceptStopWords).toEqualData(
                [
                    {
                        uuid: 'b63231b5-ca58-4bea-906c-87b2aa73eccf',
                        display: 'AND',
                        locale: 'en'
                    },
                    {
                        uuid: '45e2ff82-3d5e-419a-8ec0-aad37cd56177',
                        display: 'OR',
                        locale: 'en'
                    }
                ]);
        });

        it('should send delete request at uuid address extracted from selection map', inject(function () {
            $httpBackend.whenDELETE('/ws/rest/v1/conceptstopword/45e2ff82-3d5e-419a-8ec0-aad37cd56177?purge=true').respond("DELETE SUCCESS");
            $httpBackend.whenGET('partials/conceptstopword.html').respond("conceptstopword list partial page");

            //deleteSelected function requests updated list.
            ctrl.selected = {'45e2ff82-3d5e-419a-8ec0-aad37cd56177': true};
            ctrl.deleteSelected();
            $httpBackend.flush();
        }));
    });
});