angular
    .module('conceptDictionaryApp')
    .controller('ClassesEdit', ['$scope', 'ClassesService', '$routeParams', '$location', 'openmrsRest',
    function($scope, ClassesService, $routeParams, $location, openmrsRest ) {
        openmrsRest.getFull('conceptclass', {uuid: $routeParams.classUUID}).then(function(respond){
            $scope.singleClass = respond;
        });

        $scope.class = {
            name : '',
            description : ''
        };

        $scope.responseMessage = '';

        $scope.redirectToList = function() {
            $location.path('/class-list').search({classAdded: $scope.class.name});
        };

        $scope.editClass = function() {
            $scope.class.name = $scope.singleClass.name;
            $scope.class.description = $scope.singleClass.description;
            $scope.json = angular.toJson($scope.class);

            openmrsRest.update('conceptclass', {uuid: $scope.singleClass.uuid}, $scope.json).then(function(success) {
                $scope.redirectToList();
            }, function(exception) {
                $scope.responseMessage = exception.data.error.fieldErrors.name[0].message;
            });
        };

        $scope.cancel = function () {
            $scope.class.name = '';
            $location.path('/class-list').search({classAdded: ''});
        }

    }]);