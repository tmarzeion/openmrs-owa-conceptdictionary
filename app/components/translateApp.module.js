var translationsPath = 'translation/messages_{lang}.json';
var prefferedLang = 'en';

angular
    .module('translateApp', ['pascalprecht.translate'])
    .config(['$translateProvider', '$translatePartialLoaderProvider', translateAppConfig]);

function translateAppConfig($translateProvider) {
        $translateProvider.useLoader('$translatePartialLoader', {
            urlTemplate: translationsPath
        });
        $translateProvider.fallbackLanguage('en');
        $translateProvider.preferredLanguage(prefferedLang);
}