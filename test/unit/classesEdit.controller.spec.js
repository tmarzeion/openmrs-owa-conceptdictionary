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

    describe('ClassesEditController', function() {
        var scope, ctrl, $httpBackend;

        beforeEach(inject(function(_$httpBackend_, $rootScope, $controller, openmrsRest, $routeParams) {
            $httpBackend = _$httpBackend_;
            $httpBackend.whenGET('/ws/rest/v1/conceptclass/8d490bf4-c2cc-11de-8d13-0010c6dffd0f?v=full').
            respond({results:{uuid: '8d490bf4-c2cc-11de-8d13-0010c6dffd0f',
                name: 'Question', description: 'Question (eg, patient history, SF36 items)'}});
            $httpBackend.whenPOST('/ws/rest/v1/conceptclass/8d490bf4-c2cc-11de-8d13-0010c6dffd0f').
            respond({results:{uuid: '8d490bf4-c2cc-11de-8d13-0010c6dffd0f',
                name: 'Question', description: 'Question (eg, patient history, SF36 items)'}});
            $httpBackend.whenGET('/ws/rest/v1/conceptclass?v=full').respond({});
            $httpBackend.whenGET('partials/class-list.html').respond();
            
            scope = $rootScope.$new();

            var singleClass;
            openmrsRest.getFull('conceptclass', {uuid : '8d490bf4-c2cc-11de-8d13-0010c6dffd0f'}).then(function(response){
            	singleClass = response.results;
            });
            
            $httpBackend.flush();

            ctrl = $controller('ClassesEditController', {singleClass: singleClass, });
            ctrl.editClass();
        }));


        it('should edit existing class ', function() {
            expect(ctrl.responseMessage).toEqualData('');
        });

    });
});