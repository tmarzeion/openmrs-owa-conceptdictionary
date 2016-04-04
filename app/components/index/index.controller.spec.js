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

    describe('IndexController', function(){
        var ctrl, $httpBackend;

        beforeEach(inject(function(_$httpBackend_, $rootScope, $controller, $translate, $translatePartialLoader){
            $httpBackend = _$httpBackend_;

            $httpBackend.whenGET('components/indexMenu/indexMenu.html').respond();
            $httpBackend.whenGET('translation/messages_en.json').respond();
            $httpBackend.whenGET('translation/messages_es.json').respond();

            ctrl = $controller('IndexController',
                {
                    $translate: $translate,
                    $translatePartialLoader: $translatePartialLoader
                });

        }));

        it('Should get and switch languages', function(){

            var actualLanguage = 'No language present';

            ctrl.changeLanguage('en').then(function(response) {
                actualLanguage = response;
            });

            $httpBackend.flush();
            expect(actualLanguage).toEqualData("en");

            ctrl.changeLanguage('es').then(function(response) {
                actualLanguage = response;
            });

            $httpBackend.flush();
            expect(actualLanguage).toEqualData("es");
        });
    });
});