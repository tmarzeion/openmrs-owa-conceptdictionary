angular
    .module('conceptDictionaryApp')
    .controller('ConceptStopWordAddController', ['$location', 'openmrsRest', 'serverLocales',
        function ($location, openmrsRest, serverLocales) {

            var vm = this;

            vm.serverLocales = serverLocales;

            //Default values for concept stop word and response message
            vm.conceptStopWord = {
                value: '',
                locale: ''
            };
            vm.responseMessage = '';

            vm.selectedLocale = '';

            //Method used to add concept stop word with current concept stop word params
            vm.addConceptStopWord = addConceptStopWord;

            //Method used to cancel concept stop word making
            vm.cancel = cancel;

            //Method used to add concept stop word with current class params
            function addConceptStopWord() {
                vm.json = angular.toJson(vm.conceptStopWord);
                openmrsRest.create('conceptstopword', vm.json).then(function (success) {
                    //Fix this
                    vm.success = true;
                    $location.path('/conceptstopword-list').search({conceptStopWordAdded: vm.conceptStopWord.value});
                }, function (error) {
                    vm.responseMessage = error.message;
                });
            }

            //Method used to cancel class making
            function cancel() {
                $location.path('/conceptstopword-list').search({conceptStopWordAdded: ''});
            }
        }]);
