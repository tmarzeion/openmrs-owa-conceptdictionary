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

    describe('DataTypesListController', function(){
        var scope, ctrl, $httpBackend;

        beforeEach(inject(function(_$httpBackend_, $rootScope, $controller, Util, $routeParams, openmrsRest){
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET(Util.getOpenmrsContextPath()+'/ws/rest/v1/conceptdatatype?v=full').
            respond({results:[{name: 'Date Datatype', description: 'Date Field Gen Datatype Handler'},
                {name: 'Boolean Datatype', description: 'Boolean Field Gen Datatype Handler'}]});

            scope = $rootScope.$new();

            var loadDataTypes;
            openmrsRest.listFull('conceptdatatype').then(function(response){
                loadDataTypes = response;
            });

            $httpBackend.flush();

            ctrl = $controller('DataTypesListController', {$scope: scope, loadDataTypes: loadDataTypes});

        }));

        it('Should load all dataTypes', function(){

            expect(ctrl.dataTypes).toEqualData([{name: 'Date Datatype', description: 'Date Field Gen Datatype Handler'},
                {name: 'Boolean Datatype', description: 'Boolean Field Gen Datatype Handler'}]);

        });

    });
});