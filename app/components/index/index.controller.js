angular
    .module('conceptDictionaryApp')
    .controller('IndexController', IndexController);

IndexController.$inject = ['$translate'];

function IndexController($translate) {

    var vm = this;

    vm.appTitle = "Concept Dictionary";

    vm.changeLanguage = function (langKey) {
       return $translate.use(langKey);
    };

}