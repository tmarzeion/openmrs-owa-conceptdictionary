angular
    .module('conceptDictionaryApp')
    .controller('SourcesListController', SourcesListController);

SourcesListController.$inject =
    ['sources', '$location', '$route', '$routeParams', 'openmrsRest']

function SourcesListController (sources, $location, $route, $routeParams, openmrsRest) {

    var vm = this;
    //array of concept classes
    vm.sources = sources;
    //map of selected classes
    //determines whether class has been saved or deleted in previous view
    vm.sourceSaved = $routeParams.sourceSaved;
    vm.sourceDeleted = $routeParams.sourceDeleted;


    vm.goTo = goTo;

    //redirects to another location
    function goTo (hash){
        $location.path(hash);
    }


}