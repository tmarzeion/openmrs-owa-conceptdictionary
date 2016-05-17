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

import testUtils from '../testUtils/testUtils.js';
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

    beforeEach(angular.mock.module('conceptDictionaryApp'));

    describe('ConceptStopWordAddController', function () {
        var scope, ctrl, $httpBackend, $locationMock, notificationMock;
        $locationMock = testUtils.getLocationMock();
        notificationMock = testUtils.getNotificationMock();

        beforeEach(inject(function (_$httpBackend_, $rootScope, $controller) {
            $httpBackend = _$httpBackend_;
            $httpBackend.whenGET('manifest.webapp').respond(500, "");
			$httpBackend.whenGET(/translation.*/).respond();

            var newConceptStopWord = {
                value: 'AND',
                locale: 'en'
            };

            var serverLocales =["en","es","fr","it","pt"];
            scope = $rootScope.$new();
            
            ctrl = $controller('ConceptStopWordAddController', 
            		{$scope: scope, $location: $locationMock, serverLocales : serverLocales, 
            		openmrsNotification: notificationMock});
            ctrl.conceptStopWord = newConceptStopWord;
        }));

        it('should add new concept stop word ', function () {
            $httpBackend.expectPOST('/ws/rest/v1/conceptstopword')
            .respond({results: {value: 'AND',locale: 'en'}});


            ctrl.addConceptStopWord();
            $httpBackend.flush();
            expect($locationMock.path).toHaveBeenCalledWith('/conceptstopword');
            expect($locationMock.search).toHaveBeenCalledWith({successToast: "AND has been saved"});
        });
        it('should fail at adding new concept stop word ', function () {
            var errorMsg = "ERROR MSG"
            $httpBackend.expectPOST('/ws/rest/v1/conceptstopword').respond(500, {"error" : {"message" : errorMsg }});
            ctrl.addConceptStopWord();
            $httpBackend.flush();
            expect(notificationMock.error).toHaveBeenCalledWith(errorMsg, '');
        });
    });
});