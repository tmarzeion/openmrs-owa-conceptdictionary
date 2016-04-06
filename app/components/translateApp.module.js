angular
    .module('translateApp', ['pascalprecht.translate'])
    .config(['$translateProvider', translateAppConfig]);

function translateAppConfig($translateProvider) {
		$translateProvider.useStaticFilesLoader({
			prefix: 'translation/messages_',
			suffix: '.json'
		});
        $translateProvider.fallbackLanguage('en');
        $translateProvider.preferredLanguage('en');
}