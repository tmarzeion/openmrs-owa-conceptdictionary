angular
    .module('conceptDictionaryApp')
    .controller('IndexController', IndexController);

IndexController.$inject = ['$translate', '$translatePartialLoader'];

function IndexController($translate, $translatePartialLoader) {

    var vm = this;
    
    vm.appTitle = "Concept Dictionary";

    $translatePartialLoader.addPart('messages.json');
    $translate.refresh();

    vm.changeLanguage = function (langKey) {
       return $translate.use(langKey);
    };

}