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

    beforeEach(angular.mock.module('conceptDictionaryApp'));

    describe('SourceEditController', function() {
        var scope, ctrl, $httpBackend, $locationMock, notificationMock;
        $locationMock = testUtils.getLocationMock();
        notificationMock = testUtils.getNotificationMock();

        beforeEach(inject(function(_$httpBackend_, $rootScope, $controller, openmrsRest) {
            $httpBackend = _$httpBackend_;
            $httpBackend.whenGET('manifest.webapp').respond(500, "");
			$httpBackend.whenGET(/translation.*/).respond();
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

            ctrl = $controller('SourceEditController', {$scope: scope, sources: source, 
            	$location: $locationMock, openmrsNotification: notificationMock});
        }));

        it('should edit existing conceptSource ', function() {
            ctrl.save();
            $httpBackend.flush();
            expect($locationMock.path).toHaveBeenCalledWith('/source');
            expect($locationMock.search).toHaveBeenCalledWith({successToast: "Source has been saved"});
        });
        it('should  fail at edit existing conceptSource term ', function() {
            var errorMsg = "ERROR MSG"
            $httpBackend.expectPOST('/ws/rest/v1/conceptsource/42f9cdf3-b124-42d0-9b70-1a4020a0ee83').respond(500, {"error" : {"message" : errorMsg }});
            ctrl.save();
            $httpBackend.flush();
            expect(notificationMock.error).toHaveBeenCalledWith(errorMsg);
        });

    });
});