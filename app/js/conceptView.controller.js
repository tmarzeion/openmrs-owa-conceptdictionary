angular
    .module('conceptDictionaryApp')
    .controller('ConceptView', ['$scope', 'loadConcept', 'loadLocales', '$q', 'ConceptLocaleService', '$location',
    function($scope, loadConcept, loadLocales, $q, ConceptLocaleService, $location ){

        //resolves promise of fetching concept from server
        $q.all(loadConcept, loadLocales).then(function(response){
            $scope.concept = loadConcept;
            $scope.locales = ConceptLocaleService.getLocales($scope.concept.names,
                $scope.concept.descriptions,
                loadLocales);
            $scope.checkType();
            $scope.goLocale($scope.concept.name.locale);
        });

        //conceptLocale holds names and description of Concept within selected locale
        $scope.conceptLocale = {};
        //inserts descriptions and names for specified locale into conceptLocale, parsed from concept tables,
        $scope.goLocale = function (locale) {
            $scope.conceptLocale.description = ConceptLocaleService.getLocaleDescr($scope.concept.descriptions, locale);
            $scope.conceptLocale.names = ConceptLocaleService.getLocaleNames($scope.concept.names, locale);
        }
        //checks datatype of concept to determine
        $scope.checkType = function(){
            $scope.isNumeric = ($scope.concept.datatype.display == "Numeric");
            $scope.isCoded = ($scope.concept.datatype.display == "Coded");
        }
        //
        $scope.goToConcept = function(hash){
            $location.path("/concept/"+hash);
        }
    }]);