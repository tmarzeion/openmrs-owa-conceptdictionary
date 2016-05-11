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

    beforeEach(angular.mock.module('conceptDictionaryApp'));

    describe('ClassEditController', function() {
        var scope, ctrl, $httpBackend;

        beforeEach(inject(function(_$httpBackend_, $rootScope, $controller, openmrsRest, $routeParams) {
            $httpBackend = _$httpBackend_;
            $httpBackend.whenGET('manifest.webapp').respond(500, "");
			$httpBackend.whenGET(/translation.*/).respond();
            $httpBackend.whenGET('/ws/rest/v1/conceptclass/8d490bf4-c2cc-11de-8d13-0010c6dffd0f?v=full').
            respond({results:{uuid: '8d490bf4-c2cc-11de-8d13-0010c6dffd0f',
                name: 'Question', description: 'Question (eg, patient history, SF36 items)'}});
            $httpBackend.whenPOST('/ws/rest/v1/conceptclass/8d490bf4-c2cc-11de-8d13-0010c6dffd0f').
            respond({results:{uuid: '8d490bf4-c2cc-11de-8d13-0010c6dffd0f',
                name: 'Question', description: 'Question (eg, patient history, SF36 items)'}});
            $httpBackend.whenGET('/ws/rest/v1/conceptclass?v=full').respond({});
            $httpBackend.whenGET('components/indexMenu/indexMenu.html').respond();
            
            scope = $rootScope.$new();

            var singleClass;
            openmrsRest.getFull('conceptclass', {uuid : '8d490bf4-c2cc-11de-8d13-0010c6dffd0f'}).then(function(response){
            	singleClass = response.results;
            });
            
            $httpBackend.flush();

            ctrl = $controller('ClassEditController', {singleClass: singleClass});
            ctrl.editClass();
        }));


        it('should edit existing class ', function() {
            ctrl.editClass();
            $httpBackend.flush();
            //just test if all "whenGET"s are satisfied
        });

    });
});