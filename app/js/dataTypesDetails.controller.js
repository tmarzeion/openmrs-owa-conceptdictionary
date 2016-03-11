angular
    .module('conceptDictionaryApp')
    .controller('DataTypesDetails', ['$scope', 'DataTypesService', '$routeParams', 'openmrsRest',
    function($scope, DataTypesService, $routeParams, openmrsRest){

        openmrsRest.getFull('conceptdatatype', {uuid: $routeParams.dataTypeUUID}).then(function(respond){
            $scope.singleDataType = respond;
        });


    }]);