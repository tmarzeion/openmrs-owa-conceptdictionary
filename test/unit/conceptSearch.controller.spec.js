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

    describe('ConceptSearch', function() {
        var scope, ctrl, $httpBackend;

        beforeEach(inject(function(_$httpBackend_, $rootScope, $controller, Util, ConceptsService) {
            var testQuery = 'Ana';
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET(Util.getOpenmrsContextPath()+'/ws/rest/v1/concept/?v=full&includeAll=true&q=' + testQuery).
            respond(
                {results: [
                    {
                        uuid: '80bd49d3-4a3b-4566-95be-8a4cf4b411f4',
                        display: 'Anaphylaxis',
                        datatype: {description: 'An acute hypersensitivity reaction due to exposure to a previously encountered antigen.' +
                        ' The reaction may include rapidly progressing urticaria, respiratory distress, vascular collapse, systemic shock, and death.'}
                    },
                    {
                        uuid: '3fc4d6bd-7206-4d7d-9ec3-b5fa7822e3df',
                        display: 'Anaemia',
                        datatype: {description: 'A reduction in the number of circulating erythrocytes or in the quantity of hemoglobin.'}
                    },
                    {
                        uuid: 'd0a052f7-b6fd-4f3e-8385-7dc06d6f3806',
                        display: 'Anacin Aspirin Regimen',
                        datatype: {description: 'Name of a drug which is used as anti inflammatory and analgesic.'}
                    }
                ]});

            scope = $rootScope.$new();

            scope.concepts = '';

            ConceptsService.getQueryConcepts(testQuery).then(function (response) {
                scope.concepts = response;
            });

            ctrl = $controller('ConceptSearch', {$scope: scope, $location: location});
        }));

        it('should get data with specified query', function() {
            $httpBackend.flush();
            expect(scope.concepts).toEqualData(
                {results: [
                    {
                        uuid: '80bd49d3-4a3b-4566-95be-8a4cf4b411f4',
                        display: 'Anaphylaxis',
                        datatype: {description: 'An acute hypersensitivity reaction due to exposure to a previously encountered antigen.' +
                        ' The reaction may include rapidly progressing urticaria, respiratory distress, vascular collapse, systemic shock, and death.'}
                    },
                    {
                        uuid: '3fc4d6bd-7206-4d7d-9ec3-b5fa7822e3df',
                        display: 'Anaemia',
                        datatype: {description: 'A reduction in the number of circulating erythrocytes or in the quantity of hemoglobin.'}
                    },
                    {
                        uuid: 'd0a052f7-b6fd-4f3e-8385-7dc06d6f3806',
                        display: 'Anacin Aspirin Regimen',
                        datatype: {description: 'Name of a drug which is used as anti inflammatory and analgesic.'}
                    }
                ]});
        });
    });
});