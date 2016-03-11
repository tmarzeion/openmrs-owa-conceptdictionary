angular
    .module('conceptDictionaryApp')
    .controller('ConceptSearch', ['$scope', 'ConceptsService', function($scope, ConceptsService) {
    $scope.query='';
    $scope.enableDescription = false;
    $scope.concepts='';
    $scope.isUserTyping = false;
    $scope.searchNotification = 'Searching...';
    $scope.noSearchInputNotification = 'Type query to search panel to find concepts';

    //Default values
    $scope.entriesPerPage = 5;
    $scope.pageNumber = 1;
    $scope.resultNotification = '';

    $scope.loadingMorePages = false;

    $scope.sliceFrom = function () {
        return $scope.entriesPerPage*$scope.pageNumber-$scope.entriesPerPage;
    };

    $scope.sliceTo = function () {
        return $scope.entriesPerPage*$scope.pageNumber;
    };

    $scope.viewRangeStart = function () {
        return $scope.sliceFrom()+1;
    };

    $scope.viewRangeEnd = function () {
        return $scope.sliceTo();
    };

    //Page changing
    $scope.nextPage = function () {
        $scope.pageNumber++;
    };
    $scope.prevPage = function () {
        $scope.pageNumber--;
    };
    $scope.firstPage = function () {
        $scope.pageNumber = 1;
    };
    $scope.lastPage = function () {
        $scope.pageNumber = Math.floor($scope.concepts.length/$scope.entriesPerPage)+1;
    };


    $scope.updateResultNotification = function () {
        if ($scope.isUserTyping) {
            $scope.resultNotification = '';
        }
        else {
            $scope.resultNotification = 'There is no concept named ' + $scope.query;
        }
    };

    // Method used to prevent app from querying server with every letter input into search query panel
    var timeout = null;
    $scope.timeoutRefresh = function() {
        clearTimeout(timeout);
        $scope.isUserTyping = true;
        timeout = setTimeout(function () {
            $scope.refreshResponse();
        }, 250);
    };

    $scope.refreshResponse = function() {
        $scope.firstPage();
        $scope.isUserTyping = false;

        if ($scope.query.length>0) {
            ConceptsService.getFirstPageQueryConcepts($scope.query, $scope.entriesPerPage).then(function (firstResponse) {
                $scope.loadingMorePages = true;
                $scope.concepts = firstResponse.results;
                $scope.updateResultNotification();

                ConceptsService.getQueryConcepts($scope.query).then(function (response) {
                    $scope.concepts = response.results;
                    $scope.updateResultNotification();
                    $scope.loadingMorePages = false;
                });
            });
        }
        else {
            $scope.$apply(function () {
                $scope.concepts='';
            });
        }
    };
}]);
