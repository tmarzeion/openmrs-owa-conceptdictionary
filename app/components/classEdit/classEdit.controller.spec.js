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
import testUtils from '../testUtils/testUtils.js';

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

    describe('ClassEditController', function() {
        var scope, ctrl, $httpBackend, className, $locationMock, notificationMock, errorMsg;
        errorMsg = "ERROR MESSAGE";
        className = 'Question';
        $locationMock = testUtils.getLocationMock();
        notificationMock = testUtils.getNotificationMock();


        beforeEach(inject(function(_$httpBackend_, $rootScope, $controller, openmrsRest, $routeParams) {
            $httpBackend = _$httpBackend_;
            $httpBackend.whenGET('manifest.webapp').respond(500, "");
            $httpBackend.whenGET('/ws/rest/v1/conceptclass/8d490bf4-c2cc-11de-8d13-0010c6dffd0f?v=full').
            respond({results:{uuid: '8d490bf4-c2cc-11de-8d13-0010c6dffd0f',
                name: className, description: 'Question (eg, patient history, SF36 items)'}});
            $httpBackend.whenPOST('/ws/rest/v1/conceptclass/8d490bf4-c2cc-11de-8d13-0010c6dffd0f').
            respond({results:{uuid: '8d490bf4-c2cc-11de-8d13-0010c6dffd0f',
                name: className, description: 'Question (eg, patient history, SF36 items)'}});
            $httpBackend.whenPOST('/ws/rest/v1/conceptclass/'+className)
            .respond(500, {"error":{"fieldErrors":{"name" : [{"message" : errorMsg}]}}});
            
            scope = $rootScope.$new();

            var singleClass;
            openmrsRest.getFull('conceptclass', {uuid : '8d490bf4-c2cc-11de-8d13-0010c6dffd0f'}).then(function(response){
            	singleClass = response.results;
            });
            
            $httpBackend.flush();


            ctrl = $controller('ClassEditController', {singleClass: singleClass, $location: $locationMock, openmrsNotification : notificationMock});
        }));


        it('should edit existing class ', function() {
        	//success
            ctrl.editClass();
            $httpBackend.flush();
            expect($locationMock.path).toHaveBeenCalledWith('/class');
            expect($locationMock.search).toHaveBeenCalledWith({successToast: className+" has been saved"});
        });
        
        it('should fail at editing existing class ', function() {
            //fail - call error notification
            ctrl.singleClass.uuid = className;
            ctrl.editClass();
            $httpBackend.flush();
            expect(notificationMock.error).toHaveBeenCalledWith(errorMsg);
        });

    });
});