angular
    .module('conceptDictionaryApp')
    .controller('ConceptStopWordListController', ConceptStopWordListController);

ConceptStopWordListController.$inject =
    ['loadConceptStopWords','$location', '$routeParams', 'openmrsRest'];

function ConceptStopWordListController (loadConceptStopWords, $location, $routeParams, openmrsRest) {

    var vm = this;
    //array of concept stop words0
    vm.conceptStopWords = loadConceptStopWords.results;
    //map of selected concept stop words
    vm.selected = {};
    //checks if any is selected
    vm.isSelected = false;
    //determines whether concept stop word has been added in previous view
    vm.conceptStopWordAdded = $routeParams.conceptStopWordAdded;

    vm.goTo = goTo;
    vm.deleteSelected = deleteSelected;
    vm.refreshButtonState = refreshButtonState;

    function refreshButtonState () {

        var foundSolution = false;
        var counter = 0;
        angular.forEach(vm.selected, function(key) {
            if (key) {
                vm.isSelected = true;
                foundSolution = true;
                //TODO: Add break; here
            }
            counter++;
        });
        if (!foundSolution && counter == Object.keys(vm.selected).length) {
            vm.isSelected = false;
        }
    }

    function deleteSelected (){
        //deletes selected concept stop words
        angular.forEach(vm.selected, function(key,value){
            if(key){
                openmrsRest.remove('conceptstopword', {uuid : value, purge: true});
            }
        });
        //then updates concept stop words list in scope after deletion

        openmrsRest.listFull('conceptstopword').then(function(data) {
            vm.conceptStopWords = data;
            $location.path("/conceptstopword/").search({});
        });
    }
    //redirects to another location
    function goTo (hash){
        $location.path(hash);
    }
}