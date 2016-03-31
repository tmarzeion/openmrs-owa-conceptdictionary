angular
    .module('conceptDictionaryApp')
    .controller('SourcesListController', SourcesListController);

SourcesListController.$inject =
    ['sources', '$location', '$routeParams'];

function SourcesListController (sources, $location, $routeParams) {

    var vm = this;
    //array of concept sources
    vm.sources = sources.results;
    //determines whether source class has been saved or deleted in previous view
    vm.sourceSaved = $routeParams.sourceSaved;
    vm.sourceDeleted = $routeParams.sourceDeleted;

    vm.goTo = goTo;

    //redirects to another location
    function goTo (hash){
        $location.path(hash);
    }
}