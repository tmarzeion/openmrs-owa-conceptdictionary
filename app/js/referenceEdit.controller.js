angular
    .module('conceptDictionaryApp')
    .controller('ReferenceEditController', ReferenceEditController);

ReferenceEditController.$inject = ['reference', 'sources', 'openmrsRest', '$location'];

function ReferenceEditController (reference, sources, openmrsRest, $location ){

    var vm = this;

    vm.reference = reference;
    vm.sources = sources;
    vm.selectedConceptSource = vm.reference.conceptSource.name;

    vm.cancel = cancel;
    vm.save = save;
    vm.deleteForever = deleteForever;
    vm.retire = retire;
    vm.updateConceptSource = updateConceptSource;


    function updateConceptSource() {
        for (i = 0; i < vm.sources.length; i++) {
            if (vm.sources[i].name === vm.selectedConceptSource) {
                vm.reference.conceptSource = vm.sources[i];
                break;
            }
        }
    }



    function cancel () {
        $location.path('/reference-search');
    }

    function save() {
        vm.json = angular.toJson(vm.reference);
        openmrsRest.update('conceptreferenceterm', {uuid: vm.reference.uuid}, vm.json).then(function(success) {
            vm.success = true;
            $location.path('/reference-search').search({referenceSaved: vm.reference.name});
        });
    }

    function deleteForever() {
        openmrsRest.remove('conceptreferenceterm', {uuid : vm.reference.uuid, purge : true});
        $location.path('/reference-search').search({referenceDeleted: vm.reference.name});
    }

    function retire() {
        //wololo
        vm.reference.retired = !(vm.reference.retired);
        save();
    }
}