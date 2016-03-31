angular
    .module('conceptDictionaryApp')
    .controller('ReferenceAddController', ReferenceAddController);

ReferenceAddController.$inject = ['sources', 'openmrsRest', '$location'];

function ReferenceAddController (sources, openmrsRest, $location ){

    var vm = this;


    vm.reference = {
        code:'',
        name:'',
        conceptSource: {},
        description:'',
        version:''
    };


    vm.sources = sources.results;
    vm.responseMessage = '';

    vm.cancel = cancel;
    vm.save = save;
    vm.isSavePossible = isSavePossible;

    function cancel () {
        $location.path('/reference-search');
    }

    function isSavePossible () {
        return vm.reference.code.length > 0 && angular.isDefined(vm.reference.conceptSource.uuid);
    }

    //Method used to add class with current class params
    function save() {
        vm.json = angular.toJson(vm.reference);
        openmrsRest.create('conceptreferenceterm', vm.json).then(function(success) {
            vm.success = true;
            $location.path('/reference-search').search({referenceSaved: vm.reference.name});
        }, function(exception) {
            vm.responseMessage = exception.data.error.fieldErrors.code[0].message;
        });
    }
}