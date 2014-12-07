var app = angular.module("app", ['ngRoute', 'ngAnimate']).run(function($rootScope){
    $rootScope.login=false;
});

app.constant("baseUrl", "/cc-api");

app.controller("panelController", function($scope, $location) {
    $scope.isActive = function (route) {
        return (route === $location.path());
    };

});

app.config(['$httpProvider',
function ($httpProvider) {
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
}
]);
