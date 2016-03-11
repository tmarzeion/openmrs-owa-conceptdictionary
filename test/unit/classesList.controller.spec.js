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

    describe('ClassesList', function(){
        var scope, ctrl, $httpBackend;

        beforeEach(inject(function(_$httpBackend_, $rootScope, $controller, Util, ClassesService) {
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET(Util.getOpenmrsContextPath()+'/ws/rest/v1/conceptclass/?v=full').
            respond({results:[{name: 'Anatomy', description: 'Anatomic sites / descriptors', uuid: 'ad491c7a-c2cc-11de-8d13-0010c6dffd0f'},
                {name: 'Procedure', description: 'Describes a clinical procedure', uuid: 'bd490bf4-c2cc-11de-8d13-0010c6dffd0f'}]});


            scope = $rootScope.$new();

            var loadClasses;
            ClassesService.getAll().then(function(response){
                loadClasses = response;
            });

            $httpBackend.flush();

            ctrl = $controller('ClassesList', {$scope: scope, loadClasses: loadClasses, $location: location});
        }));


        it('should create "classes" model with 2 classes fetched', function() {
            expect(scope.classes).toEqualData(
                [{name: 'Anatomy', description: 'Anatomic sites / descriptors', uuid: 'ad491c7a-c2cc-11de-8d13-0010c6dffd0f'},
                    {name: 'Procedure', description: 'Describes a clinical procedure', uuid: 'bd490bf4-c2cc-11de-8d13-0010c6dffd0f'}]);
        });

        it('should send delete request at uuid adress extracted from selection map', inject(function(Util) {
            //handles delete request for specified class
            $httpBackend.whenDELETE(Util.getOpenmrsContextPath()+'/ws/rest/v1/conceptclass/ad491c7a-c2cc-11de-8d13-0010c6dffd0f').respond("DELETE SUCCESS");
            //deleteSelected function requests updated list.
            $httpBackend.whenGET(Util.getOpenmrsContextPath()+'/ws/rest/v1/conceptclass?v=full')
                .respond({results:[{name: 'Anatomy', description: 'Anatomic sites / descriptors', uuid: 'ad491c7a-c2cc-11de-8d13-0010c6dffd0f'},
                    {name: 'Procedure', description: 'Describes a clinical procedure', uuid: 'bd490bf4-c2cc-11de-8d13-0010c6dffd0f'}]});
            //$route.resfresh() requests page html
            $httpBackend.whenGET(Util.getOpenmrsContextPath()+'/ws/rest/v1/conceptclass/?v=full')
                .respond({results:[{name: 'Anatomy', description: 'Anatomic sites / descriptors', uuid: 'ad491c7a-c2cc-11de-8d13-0010c6dffd0f'},
                    {name: 'Procedure', description: 'Describes a clinical procedure', uuid: 'bd490bf4-c2cc-11de-8d13-0010c6dffd0f'}]});

            $httpBackend.whenGET(Util.getOpenmrsContextPath()+'partials/class-list.html').respond("class list partial page");

            scope.selected = {'ad491c7a-c2cc-11de-8d13-0010c6dffd0f' : true }
            scope.deleteSelected();
            $httpBackend.flush();

            //expect delete fails test if no request is made
        }));
    });
});