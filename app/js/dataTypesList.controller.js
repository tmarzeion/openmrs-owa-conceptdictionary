angular
    .module('conceptDictionaryApp')
    .controller('DataTypesList', ['$scope', 'loadDataTypes', 'DataTypesService', '$routeParams', 'openmrsRest',
    function($scope, loadDataTypes, DataTypesService, $routeParams, openmrsRest){
        $scope.dataTypes = loadDataTypes;

    }]);