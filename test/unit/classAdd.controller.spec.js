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

    describe('ClassAdd', function() {
        var scope, ctrl, $httpBackend;

        beforeEach(inject(function(_$httpBackend_, $rootScope, $controller, Util, ClassesService) {
            $httpBackend = _$httpBackend_;
            $httpBackend.expectPOST(Util.getOpenmrsContextPath()+'/ws/rest/v1/conceptclass/?').
            respond({results:{name: 'Anatomy', description: 'Anatomic sites / descriptors'}});

            scope = $rootScope.$new();

            var newClass = {
                name:'Anatomy',
                description:'Anatomic sites / descriptors'
            };

            newClass = angular.toJson(newClass);

            ClassesService.addClass(newClass).then(function(success){
                scope.response = success;
            });

            $httpBackend.flush();

            ctrl = $controller('ClassAdd', {$scope: scope, $location: location});
        }));

        it('should add new class ', function() {
            expect(scope.response.results).toEqualData(
                {name: 'Anatomy', description: 'Anatomic sites / descriptors'});
        });
    });
});