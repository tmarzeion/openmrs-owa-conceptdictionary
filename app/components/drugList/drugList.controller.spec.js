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

    describe('DrugsListController', function(){
        var scope, ctrl, $httpBackend;

        beforeEach(inject(function(_$httpBackend_, $rootScope, $controller, openmrsRest){
            $httpBackend = _$httpBackend_;
            $httpBackend.whenGET('/ws/rest/v1/drug?v=full').
            respond({results:[{ name: 'Morphine', 
            					strength: 'high', 
            					uuid: "2b22dc27-72ec-4ab5-9fa8-d98be91adc1c"},
            				  { name: 'Drug', 
            					strength: 'low',
            					uuid: "3g65dc27-72ec-4ab5-9fa8-d98be91adb5b"}
            				]});
            $httpBackend.whenGET('/ws/rest/v1/drug?includeAll=true&v=full').
            respond({results:[{ name: 'Morphine', 
            					strength: 'high', 
            					uuid: "2b22dc27-72ec-4ab5-9fa8-d98be91adc1c"},
            				  { name: 'Drug', 
            					strength: 'low',
            					uuid: "3g65dc27-72ec-4ab5-9fa8-d98be91adb5b"},
            					{ name: 'Coca', 
                				strength: 'mid',
                				uuid: "6g65dc56-72ec-4ab5-9fa8-d98be91adb5b"}
            				]});
            $httpBackend.whenPOST('/ws/rest/v1/drug').
            respond({ name: 'Morphine', 
            		strength: 'high', 
            		uuid: "2b22dc27-72ec-4ab5-9fa8-d98be91adc1c"});
            
            $httpBackend.whenGET('/ws/rest/v1/conceptclass?v=full').respond({});
            $httpBackend.whenGET('components/indexMenu/indexMenu.html').respond();
            $httpBackend.whenGET('components/drugList/drugList.html').respond();

            scope = $rootScope.$new();

            var loadDrugs;
            openmrsRest.listFull('drug').then(function(response){
                loadDrugs = response;
            });
            var loadRetiredDrugs;
            openmrsRest.listFull('drug', {includeAll: true}).then(function(response){
            	loadRetiredDrugs = response;
            });

            $httpBackend.flush();

            ctrl = $controller('DrugsListController', {$scope: scope, loadDrugs: loadDrugs, loadRetiredDrugs: loadRetiredDrugs});

        }));

        it('Should load non-retired drugs', function(){
            ctrl.activate();       
            expect(ctrl.drugsList).toEqualData([{ name: 'Morphine', 
													strength: 'high', 
													uuid: "2b22dc27-72ec-4ab5-9fa8-d98be91adc1c"},
												  { name: 'Drug', 
													strength: 'low',
													uuid: "3g65dc27-72ec-4ab5-9fa8-d98be91adb5b"}
												]);
        });
        
        it('Should load all drugs', function(){
        	ctrl.toggleRetire();
            expect(ctrl.drugsList).toEqualData([{ name: 'Morphine', 
													strength: 'high', 
													uuid: "2b22dc27-72ec-4ab5-9fa8-d98be91adc1c"},
												  { name: 'Drug', 
													strength: 'low',
													uuid: "3g65dc27-72ec-4ab5-9fa8-d98be91adb5b"},
													{ name: 'Coca', 
													strength: 'mid',
													uuid: "6g65dc56-72ec-4ab5-9fa8-d98be91adb5b"}
												]);
        });

    });
});