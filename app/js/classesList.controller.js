(function() {
    'use strict';

	angular
	    .module('conceptDictionaryApp')
	    .controller('ClassesList', ClassesList)
	    
	ClassesList.$inject = 
	    ['$scope', 'loadClasses', '$location', '$route', '$routeParams', 'openmrsRest']
	
	function ClassesList ($scope, loadClasses, $location, $route, $routeParams, openmrsRest) {
	
		var vm = this;
		//array of concept classes
        vm.classes = loadClasses;
        //map of selected classes
        vm.selected = {};
        //determines whether class has been added in previous view
        vm.classAdded = $routeParams.classAdded;

        vm.goTo = goTo;
        vm.deleteSelected = deleteSelected;

       
        function deleteSelected (){
        	//deletes selected classes
            angular.forEach(vm.selected, function(key,value){
                if(key){
                    openmrsRest.remove('conceptclass', {uuid : value});
                }

            });
            //then updates classes list in scope after deletion
            openmrsRest.listFull('conceptdatatype').then(function(data) {
                vm.classes = data;
                $route.reload();});
        };
        //redirects to another location
		function goTo (hash){
			$location.path(hash);
		}


    };
})();