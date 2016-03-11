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

    describe('ClassesEdit', function() {
        var scope, ctrl, $httpBackend;

        beforeEach(inject(function(_$httpBackend_, $rootScope, $controller, Util, ClassesService, $routeParams) {
            $httpBackend = _$httpBackend_;
            $httpBackend.whenGET(Util.getOpenmrsContextPath()+'/ws/rest/v1/conceptclass/8d490bf4-c2cc-11de-8d13-0010c6dffd0f?v=full').
            respond({results:{uuid: '8d490bf4-c2cc-11de-8d13-0010c6dffd0f',
                name: 'Question', description: 'Question (eg, patient history, SF36 items)'}});
            $httpBackend.whenPOST(Util.getOpenmrsContextPath()+'/ws/rest/v1/conceptclass/8d490bf4-c2cc-11de-8d13-0010c6dffd0f?').
            respond({results:{uuid: '8d490bf4-c2cc-11de-8d13-0010c6dffd0f',
                name: 'Question', description: 'Question (eg, patient history, SF36 items)'}});

            scope = $rootScope.$new();

            scope.getResponse;
            ClassesService.getClass({uuid : '8d490bf4-c2cc-11de-8d13-0010c6dffd0f'}).$promise.then(function(response){
                scope.getResponse = response;
            });


            $httpBackend.flush();

            scope.uuid = scope.getResponse.results.uuid;

            var editedClass = {
                name: scope.getResponse.results.name,
                description:scope.getResponse.results.description
            };

            editedClass = angular.toJson(editedClass);

            scope.postResponse;

            ClassesService.editClass(scope.uuid, editedClass).then(function(response){
                scope.postResponse = response;
            });

            $httpBackend.flush();

            ctrl = $controller('ClassesEdit', {$scope: scope, $location: location});
        }));


        it('should edit existing class ', function() {
            expect(scope.postResponse.results).toEqualData(
                {uuid: '8d490bf4-c2cc-11de-8d13-0010c6dffd0f', name: 'Question', description: 'Question (eg, patient history, SF36 items)'});
        });

    });
});