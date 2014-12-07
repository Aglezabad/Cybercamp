/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


app.provider("ListAccesos", ListAccesosProvider);

app.config(['baseUrl', 'ListAccesosProvider', function (baseUrl, ListAccesosProvider) {
        ListAccesosProvider.setBaseUrl(baseUrl);
    }]);

app.controller("ListAccesosController", ['$scope', 'ListAccesos', ListAccesosController]);


function ListAccesosProvider() {
    var _baseUrl = "";
    this.setBaseUrl = function (baseUrl) {
        _baseUrl = baseUrl;
    };
    this.$get = ['$http', function ($http) {
            return new ListAccesos($http, _baseUrl);
        }];
}

function ListAccesos($http, baseUrl) {
    this.get = function (fnOk, fnError) {
        $http({
            method: 'GET',
            url: baseUrl + '/logs/eslem'
        }).success(function (data, status, headers, config) {
            fnOk(data);
        }).error(function (data, status, headers, config) {
            fnError(data, status);
        });
    };

}

function ListAccesosController($scope, ListAccesos) {
  ListAccesos.get(
            function (data, status) {
                $scope.accesos = data.logs;
            },
            function (data, status) {
                alert(status + ": " + data);
            }
    );

}
