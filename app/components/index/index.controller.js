angular
    .module('conceptDictionaryApp')
    .controller('IndexController', IndexController);

IndexController.$inject = ['$translate', '$translatePartialLoader'];

function IndexController($translate, $translatePartialLoader) {

    var vm = this;

    $translatePartialLoader.addPart('messages.json');
    $translate.refresh();

    vm.changeLanguage = function (langKey) {
       $translate.use(langKey);
    };

}