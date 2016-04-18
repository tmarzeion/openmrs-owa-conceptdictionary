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

    describe('DatatypeDetailsController', function(){
        var scope, ctrl, $httpBackend;

        beforeEach(inject(function(_$httpBackend_, $rootScope, $controller, $routeParams, openmrsRest){
            $httpBackend = _$httpBackend_;
			$httpBackend.whenGET(/translation.*/).respond();
            $httpBackend.whenGET('/ws/rest/v1/conceptdatatype/8d4a505e-c2cc-11de-8d13-0010c6dffd0f?v=full').
            respond({name: 'Date Datatype', description: 'Date Field Gen Datatype Handler',
                uuid: '8d4a505e-c2cc-11de-8d13-0010c6dffd0f', hl7Abbreviation: 'DT'
            });
            $httpBackend.whenGET('/ws/rest/v1/conceptclass?v=full').respond({});
            $httpBackend.whenGET('components/indexMenu/indexMenu.html').respond();

            scope = $rootScope.$new();
            
            var loadDataType;
            
            openmrsRest.getFull('conceptdatatype', {uuid: "8d4a505e-c2cc-11de-8d13-0010c6dffd0f"}).then(function(response){
            	loadDataType = response;	
            });
            $httpBackend.flush();

            ctrl = $controller('DatatypeDetailsController', {$scope: scope, loadDataType: loadDataType});

        }));

        it('Should load details of dataType', function(){
            expect(ctrl.singleDataType).toEqualData({name: 'Date Datatype', description: 'Date Field Gen Datatype Handler',
                uuid: '8d4a505e-c2cc-11de-8d13-0010c6dffd0f', hl7Abbreviation: 'DT'});

        });
    });
});