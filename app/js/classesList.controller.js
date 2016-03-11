angular
    .module('conceptDictionaryApp')
    .controller('ClassesList',
    ['$scope', 'loadClasses', 'ClassesService', '$location', '$route', '$routeParams', 'openmrsRest',
        function($scope, loadClasses, ClassesService, $location, $route, $routeParams, openmrsRest) {


            $scope.classes = loadClasses;
            //loadClasses is resolve function, it returns array of concept class objects using ClassesService service

            $scope.redirectAddClass = function (hash) {
                $location.path( hash );
            };

            //holds objects of selected checkboxes
            $scope.selected = {};

            //deletes selected classes
            $scope.deleteSelected = function(){
                angular.forEach($scope.selected, function(key,value){
                    if(key){
                        openmrsRest.remove('conceptclass', {uuid : value});
                    }

                });
                //updates classes list in scope after deletion
                ClassesService.getAll().then(function(data) {
                    $scope.classes = data;
                    $route.reload();});
            };

            $scope.classAdded = $routeParams.classAdded;
        }]);