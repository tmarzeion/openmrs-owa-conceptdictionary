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

    describe('ConceptStopWordAddController', function () {
        var scope, ctrl, $httpBackend, location;

        beforeEach(inject(function (_$httpBackend_, $rootScope, $controller, _$location_) {
            $httpBackend = _$httpBackend_;
            $httpBackend.whenGET('/ws/rest/v1/conceptclass?v=full').respond({});
            $httpBackend.whenGET('partials/index-menu.html').respond();
            $httpBackend.whenGET('/ws/rest/v1/conceptstopword?v=full').respond();
            $httpBackend.whenGET('partials/conceptstopword-list.html').respond();
            $httpBackend.expectPOST('/ws/rest/v1/conceptstopword')
                .respond(
                    {
                        results: {
                            value: 'AND',
                            locale: 'en'
                        }
                    });

            scope = $rootScope.$new();

            location = _$location_;

            var newConceptStopWord = {
                value: 'AND',
                locale: 'en'
            };

            var serverLocales =["en","es","fr","it","pt"];

            ctrl = $controller('ConceptStopWordAddController', {$scope: scope, $location: _$location_, serverLocales : serverLocales});
            ctrl.conceptStopWord = newConceptStopWord;
        }));

        it('should add new concept stop word ', function () {
            ctrl.addConceptStopWord();
            $httpBackend.flush();
            expect(ctrl.success).toEqualData(true);
        });
    });
});