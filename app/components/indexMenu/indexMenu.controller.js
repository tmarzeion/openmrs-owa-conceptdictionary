angular
    .module('conceptDictionaryApp')
    .controller('IndexMenuController', IndexController);


function IndexController() {
    var vm = this;
    vm.links = {};
    vm.links["Concept Dictionary"] = "";
}