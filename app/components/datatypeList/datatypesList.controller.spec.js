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

    describe('DatatypeListController', function(){
        var scope, ctrl, $httpBackend;

        beforeEach(inject(function(_$httpBackend_, $rootScope, $controller, $routeParams, openmrsRest){
            $httpBackend = _$httpBackend_;
            $httpBackend.whenGET('/ws/rest/v1/conceptdatatype?limit=10&v=full').
            respond({results:[{name: 'Date Datatype', description: 'Date Field Gen Datatype Handler'},
                {name: 'Boolean Datatype', description: 'Boolean Field Gen Datatype Handler'}]});
            $httpBackend.whenGET('/ws/rest/v1/conceptclass?v=full').respond({});
            $httpBackend.whenGET('components/indexMenu/indexMenu.html').respond();

            scope = $rootScope.$new();


            $httpBackend.flush();

            ctrl = $controller('DatatypeListController', {$scope: scope});

        }));

        it('Should load all dataTypes', function(){

            ctrl.activate({limit: 10});
            $httpBackend.flush();
            expect(ctrl.dataTypeList).toEqualData([{name: 'Date Datatype', description: 'Date Field Gen Datatype Handler'},
                {name: 'Boolean Datatype', description: 'Boolean Field Gen Datatype Handler'}]);

        });

    });
});