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

    describe('ConceptViewCtrl and Services', function(){
        //declare variables
        var concept1;
        var expectedNames1;
        var expectedDescr1;

        var concept2;
        var expectedNames2;
        var expectedDescr2;

        var serverLocales = ["en", "es", "pt", "it", "fr"];

        beforeEach(function(){
            //initialize variables and insert values
            concept1 = {datatype: { display : 'Numeric'},
                names: [{display: 'engName1', locale: 'en', conceptNameType: 'FULLY_SPECIFIED'},
                    {display: 'engName1', locale: 'en', conceptNameType: 'SHORT'},
                    {display: 'EspName1', locale: 'es', conceptNameType: 'FULLY_SPECIFIED'},
                    {display: 'EspName1', locale: 'es', conceptNameType: 'INDEX_TERM'}],
                descriptions: [{display: "engDescr", locale: "en"},
                    {display: "EspDescr", locale: "es"}]};
            expectedNames1={}
            expectedNames1.short = 'engName1';
            expectedNames1.full = 'engName1';
            expectedNames1.synonyms = [];
            expectedNames1.searchTerms = [];

            expectedDescr1 = 'engDescr';

            concept2 = {datatype: { display : "Numeric"},
                names: [{display: "engName2", locale: "en", conceptNameType: "FULLY_SPECIFIED"},
                    {display: "engName2", locale: "es", conceptNameType: "SHORT"},
                    {display: "EspName2", locale: "fr", conceptNameType: "FULLY_SPECIFIED"},
                    {display: "EspName2", locale: "it", conceptNameType: "INDEX_TERM"}],
                descriptions: [{display: "engDescr", locale: "en"},
                    {display: "EspDescr", locale: "es"}]}
            expectedNames2={};
            expectedNames2.full = "engName2";
            expectedNames2.synonyms = [];
            expectedNames2.searchTerms = [];
            expectedDescr2 = "engDescr";
        });

        it('should return array of locales', inject(function(ConceptLocaleService){
            expect(ConceptLocaleService.getLocales(concept1.names, concept1.descriptions, serverLocales))
                .toEqualData(["en", "es"]);
            expect(ConceptLocaleService.getLocales(concept2.names, concept2.descriptions, serverLocales))
                .toEqualData(["en", "es", "fr", "it"]);
        }));

        it('should return Object containing english names', inject(function(ConceptLocaleService){
            var obtained1 = ConceptLocaleService.getLocaleNames(concept1.names, "en");
            expect(obtained1).toEqualData(expectedNames1);
            var obtained2 = ConceptLocaleService.getLocaleNames(concept2.names, "en");
            expect(obtained2).toEqualData(expectedNames2);
        }));

        it('should return Object containing english descriptions', inject(function(ConceptLocaleService){
            var obtained1 = ConceptLocaleService.getLocaleDescr(concept1.descriptions, "en");
            expect(obtained1).toEqualData(expectedDescr1);
            var obtained2 = ConceptLocaleService.getLocaleDescr(concept2.descriptions, "en");
            expect(obtained2).toEqualData(expectedDescr2);
        }));
    })
});