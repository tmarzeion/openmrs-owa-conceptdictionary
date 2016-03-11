angular
    .module('conceptDictionaryApp')
    .controller('ClassAdd', ['$scope', 'ClassesService', '$location', 'openmrsRest',
    function($scope, ClassesService, $location, openmrsRest){

        $scope.class = {
            name:'',
            description:''
        };

        $scope.responseMessage = '';

        $scope.redirectToList = function() {
            $location.path('/class-list').search({classAdded: $scope.class.name});
        };

        $scope.addClass = function() {
            $scope.json = angular.toJson($scope.class);

            openmrsRest.create('conceptclass', $scope.json).then(function(success) {
                $scope.redirectToList();
            }, function(exception) {
                $scope.responseMessage = exception.data.error.fieldErrors.name[0].message;
            });
        };

        $scope.cancel = function () {
            $scope.class.name = ' ';
            $location.path('/class-list').search({classAdded: ''});
        }
    }]);