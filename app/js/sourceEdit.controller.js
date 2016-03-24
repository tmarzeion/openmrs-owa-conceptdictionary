angular
    .module('conceptDictionaryApp')
    .controller('SourceEditController', SourceEditController);

SourceEditController.$inject = ['sources','openmrsRest', '$location'];

function SourceEditController (sources ,openmrsRest, $location ){

    var vm = this;

    vm.source = sources;


    vm.responseMessage = '';

    vm.cancel = cancel;
    vm.save = save;
    vm.isSavePossible = isSavePossible;
    vm.retire = retire;
    vm.deleteForever = deleteForever;

    function cancel () {
        $location.path('/source-list');
    }

    function isSavePossible () {
        return vm.source.name.length > 0 && vm.source.description.length > 0;
    }

    //Method used to add class with current class params
    function save() {
        vm.json = angular.toJson(vm.source);
        openmrsRest.update('conceptsource', {uuid: vm.source.uuid}, vm.json).then(function(success) {
            vm.success = true;
            $location.path('/source-list').search({sourceSaved: vm.source.name});
        });
    }


    function deleteForever() {
        openmrsRest.remove('conceptsource', {uuid : vm.source.uuid, purge : true});
        $location.path('/source-list').search({sourceDeleted: vm.source.name});
    }

    function retire() {
        vm.source.retired = !(vm.source.retired);
        save();
    }
}