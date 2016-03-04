var conceptDirServices = angular.module('conceptDirServices', ['ngResource']);

conceptDirServices.factory('Classes', ['$resource',
                                   function($resource){
                                     return $resource(
                                    		 'http://localhost:8080/openmrs/ws/rest/v1/conceptclass/8d4907b2-c2cc-11de-8d13-0010c6dffd0f', {}, {
                                       query: {method:'GET'}
                                     });
                                   }]);