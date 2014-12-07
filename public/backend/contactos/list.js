/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


app.provider("ListContactos", ListContactosProvider);

app.config(['baseUrl', 'ListContactosProvider', function (baseUrl, ListContactosProvider) {
        ListContactosProvider.setBaseUrl(baseUrl);
    }]);

app.controller("ListContactosController", ['$scope', 'ListContactos', ListContactosController]);


function ListContactosProvider() {
    var _baseUrl = "";
    this.setBaseUrl = function (baseUrl) {
        _baseUrl = baseUrl;
    };
    this.$get = ['$http', function ($http) {
            return new ListContactos($http, _baseUrl);
        }];
}

function ListContactos($http, baseUrl) {
    this.get = function (fnOk, fnError) {
        $http({
            method: 'GET',
            url: baseUrl + '/contacts/eslem',
            processData: false
        }).success(function (data, status, headers, config) {
            fnOk(data);
        }).error(function (data, status, headers, config) {
            fnError(data, status);
        });
    };

}

function ListContactosController($scope, ListContactos) {
    ListContactos.get(
            function (data, status) {
                $scope.contactos = data.contacts;
            },
            function (data, status) {
                alert(status + ": " + data);
            }
    );
    $scope.search = function(){
      alert();
    };

}
