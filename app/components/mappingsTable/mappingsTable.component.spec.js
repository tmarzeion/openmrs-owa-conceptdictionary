'use strict';
import testUtils from '../testUtils/testUtils.js';

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

    beforeEach(angular.mock.module('conceptDictionaryApp'));

    describe('component: mapppingsTable', function() {
        var $componentController, component, scope, $httpBackend;


        beforeEach(inject(function(_$httpBackend_, $rootScope, _$componentController_, openmrsRest) {

            $httpBackend = _$httpBackend_;
            $componentController = _$componentController_;
            scope = $rootScope.$new();
        }));

        it('should fetch ConceptMappings, ConceptMapTypes and ConceptSources at initialization', function(){
            $httpBackend.whenGET('manifest.webapp').respond(500, "");
            $httpBackend.whenGET(/translation.*/).respond();
            $httpBackend.whenGET('components/indexMenu/indexMenu.html').respond();

            $httpBackend.whenGET('/ws/rest/v1/conceptmaptype').respond({results: []});
            $httpBackend.whenGET('/ws/rest/v1/conceptsource').respond({results: []});
            $httpBackend.whenGET('/ws/rest/v1/concept/uuid/mapping?v=full').respond({results: []});


            component = $componentController('mappingsTable', {scope: scope}, {conceptUuid: "uuid"});
            $httpBackend.flush();
            expect(component.mapTypes).toEqualData([]);
            //only one default source to search all
            expect(component.sources.length).toEqualData(1);
            expect(component.mappings).toEqualData([]);
        });

        describe('component: mappingsTable, test functions', function(){
            var mockMapping1, mockMapping2, mockMapping3, mockMappings, notificationMock;
            notificationMock = testUtils.getNotificationMock();

            beforeEach(function(){
                mockMapping1 = {
                    conceptReferenceTerm: {conceptSource: {uuid: "uuid"}, code: "code"},
                    conceptMapType: {uuid: "uuid"},
                    uuid: "uuid11" };
                mockMapping2 = {
                    conceptReferenceTerm: {uuid: "uuid", conceptSource: {uuid: "uuid"}},
                    conceptMapType: {uuid: "uuid"},
                    uuid: "uuid22" };
                mockMapping3 = {
                    conceptReferenceTerm: {uuid: "uuid", conceptSource: {}},
                    conceptMapType: {uuid: "uuid"},
                    uuid: "uuid33" };
                mockMappings = [mockMapping1, mockMapping2, mockMapping3];


                $httpBackend.whenGET('manifest.webapp').respond(500, "");
                $httpBackend.whenGET(/translation.*/).respond();
                $httpBackend.whenGET('components/indexMenu/indexMenu.html').respond();

                $httpBackend.whenGET('/ws/rest/v1/conceptmaptype').respond({results: []});
                $httpBackend.whenGET('/ws/rest/v1/conceptsource').respond({results: []});
                $httpBackend.whenGET('/ws/rest/v1/concept/uuid/mapping?v=full').respond({results: []});


                component = $componentController('mappingsTable',
                    {scope: scope},
                    {conceptUuid: "uuid"},
                    {openmrsNotification: notificationMock});
                $httpBackend.flush();
            })


            it("should divide mappings and store mappings to new reference terms at the end of array", function(){
                component.mappings = mockMappings;
                expect(component.mappings.indexOf(mockMapping1)).toEqualData(0);
                component.divideMappings();
                expect(component.mappings.indexOf(mockMapping1)).toEqualData(component.mappings.length-1);
            })

            it("validation should return false if conceptSource uuid is not defined", function(){
                var mock  = {
                    conceptReferenceTerm: {conceptSource: {}},
                    conceptMapType: {uuid: "uuid"},
                    uuid: "uuid33" };
                var valid = component.validMapping(mock);
                expect(valid).toEqualData(false)
            })
            it("validation should return true if referenceTerm's and mappingType's uuids are defined", function(){
                var valid = component.validMapping(mockMapping2);
                expect(valid).toEqualData(true)
            })
            it("validation should return true if reference term code is specified instead of uuid", function(){
                var valid = component.validMapping(mockMapping1);
                expect(valid).toEqualData(true)
            })
            it("mapping search should overwrite mapping", function(){
                var mock ={conceptReferenceTerm: {
                    uuid: "uuid",
                    conceptSource: {uuid: "uuid"}},
                    conceptMapType: {uuid: "uuid"},
                    uuid: "uuid22",
                    termQuery: "query"};
                $httpBackend.whenGET('/ws/rest/v1/conceptreferenceterm?code=query&limit=10&v=full')
                    .respond({results: [{code: "query", conceptSource: {uuid: "uuid"}}]});
                component.search(mock)
                $httpBackend.flush();
                expect(mock.conceptReferenceTerm.code).toEqualData("query");
            })
            it("mapping search should do nothing when termQuery too short", function(){
                var mock ={conceptReferenceTerm: {
                    uuid: "uuid",
                    conceptSource: {uuid: "uuid"}},
                    conceptMapType: {uuid: "uuid"},
                    uuid: "uuid22",
                    termQuery: "q"};
                component.search(mock);

                $httpBackend.whenGET('/ws/rest/v1/conceptreferenceterm?code=query&limit=10&v=full')
                    .respond({results: [{code: "query", conceptSource: {uuid: "uuid"}}]});
                mock.termQuery="query";
                component.search(mock)
                //would throw error if there was request with termQuery=q, because it would be unexpected
                $httpBackend.flush();
            })
        })
    });})
