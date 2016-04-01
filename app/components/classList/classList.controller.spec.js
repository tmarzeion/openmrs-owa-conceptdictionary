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

    describe('ClassListController', function(){
        var ctrl, $httpBackend, loadClasses;

        beforeEach(inject(function(_$httpBackend_, $controller, openmrsRest, _$route_ ,_$location_, _$routeParams_) {
            $httpBackend = _$httpBackend_;         
            $httpBackend.whenGET('/ws/rest/v1/conceptclass?v=full')
    		.respond({results:[{name: 'Anatomy', description: 'Anatomic sites / descriptors', uuid: 'ad491c7a-c2cc-11de-8d13-0010c6dffd0f'},
    		                   {name: 'Procedure', description: 'Describes a clinical procedure', uuid: 'bd490bf4-c2cc-11de-8d13-0010c6dffd0f'}]});
            $httpBackend.whenGET('components/classList/classList.html').respond();
            $httpBackend.whenGET('components/indexMenu/indexMenu.html').respond();

            openmrsRest.listFull('conceptclass').then(function(response){
                loadClasses = response;
                ctrl = $controller('ClassListController', {loadClasses: loadClasses,
                									$location: _$location_, 
                									openmrsRest : openmrsRest,
                									$route : _$route_,
                									$routeParams : _$routeParams_});
            });
            $httpBackend.flush();
          //handles delete request for specified class
        }));


        it('should create "classes" model with 2 classes fetched', function() {

            expect(ctrl.classes).toEqualData(
                [{name: 'Anatomy', description: 'Anatomic sites / descriptors', uuid: 'ad491c7a-c2cc-11de-8d13-0010c6dffd0f'},
                 {name: 'Procedure', description: 'Describes a clinical procedure', uuid: 'bd490bf4-c2cc-11de-8d13-0010c6dffd0f'}]);
        });

        it('should send delete request at uuid adress extracted from selection map', inject(function() {
            $httpBackend.whenDELETE('/ws/rest/v1/conceptclass/ad491c7a-c2cc-11de-8d13-0010c6dffd0f').respond("DELETE SUCCESS");
            $httpBackend.whenGET('js/classList/classList.html').respond();
            $httpBackend.whenGET('components/indexMenu/indexMenu.html').respond();

            //deleteSelected function requests updated list.
            ctrl.selected = {'ad491c7a-c2cc-11de-8d13-0010c6dffd0f' : true }
            ctrl.deleteSelected();
            $httpBackend.flush();
        }));
    });
});