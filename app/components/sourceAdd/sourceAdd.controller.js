angular
    .module('conceptDictionaryApp')
    .controller('SourceAddController', SourceAddController);

SourceAddController.$inject = ['openmrsRest', '$location'];

function SourceAddController (openmrsRest, $location ){

    var vm = this;

    vm.source = {
        name:'',
        description:'',
        hl7Code:''
    };


    vm.responseMessage = '';

    vm.cancel = cancel;
    vm.save = save;
    vm.isSavePossible = isSavePossible;

    function cancel () {
        $location.path('/source');
    }

    function isSavePossible () {
        return vm.source.name.length > 0 && vm.source.description.length > 0;
    }

    //Method used to add class with current class params
    function save() {
        vm.json = angular.toJson(vm.source);
        openmrsRest.create('conceptsource', vm.json).then(function(success) {
            vm.success = true;
            $location.path('/source').search({sourceSaved: vm.source.name});
        }, function(exception) {
            //TODO Check exception response
            vm.responseMessage = exception.data.error.fieldErrors.code[0].message;
        });
    }
}