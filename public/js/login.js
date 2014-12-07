'use strict';
var app = angular.module("app", []);

app.config(['$httpProvider',
    function ($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
]);

app.controller("loginController", function ($scope, $location, $http, $templateCache, $rootScope) {

        var method = 'POST';
        var inserturl = '/cc-api/login';

        var jdata = 'mydata=' + JSON.stringify($scope.user);

        $scope.login = function () {
           var posting = $http({
                    method: 'POST',
                    /*posting to /post */
                    url: inserturl,
                    data: $scope.user,
                    processData: false
                });
                posting.success(function (response) {
                  if(response.ok){
                    $rootScope.logued = response.user;
                    window.location.href = 'http://localhost:5555/backend';
                  }else{
                    $scope.error = response.message;
                  }

                });

                posting.error(function(response){
                  $scope.error = response.message;
                });
    };
});
