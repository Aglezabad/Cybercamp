/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


app.provider("ListFiltros", ListFiltrosProvider);

app.config(['baseUrl', 'ListFiltrosProvider', function (baseUrl, ListFiltrosProvider) {
        ListFiltrosProvider.setBaseUrl(baseUrl);
    }]);

app.controller("ListFiltrosController", ['$scope', 'ListFiltros', ListFiltrosController]);


function ListFiltrosProvider() {
    var _baseUrl = "";
    this.setBaseUrl = function (baseUrl) {
        _baseUrl = baseUrl;
    };
    this.$get = ['$http', function ($http) {
            return new ListFiltros($http, _baseUrl);
        }];
}

function ListFiltros($http, baseUrl) {
    this.get = function (fnOk, fnError) {
        $http({
            method: 'GET',
            url: baseUrl + '/filters/eslem'
        }).success(function (data, status, headers, config) {
            fnOk(data);
        }).error(function (data, status, headers, config) {
            fnError(data, status);
        });
    };

}

function ListFiltrosController($scope, ListFiltros) {
  ListFiltros.get(
            function (data, status) {
                $scope.Filtros = data;
            },
            function (data, status) {
                alert(status + ": " + data);
            }
    );

    $scope.create = function(){/*
      $http({
        method: 'POST',
        url: baseUrl + '/filters/eslem'
      }).success(function (data, status, headers, config) {
        $("#myModal").slideUp();
      }).error(function (data, status, headers, config) {
        $("#myModal").slideUp();
      });*/
      alert();
    };

}
