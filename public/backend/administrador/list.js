/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


app.provider("ListAdministradores", ListAdministradoresProvider);

app.config(['baseUrl', 'ListAdministradoresProvider', function (baseUrl, ListAdministradoresProvider) {
        ListAdministradoresProvider.setBaseUrl(baseUrl);
    }]);

app.controller("ListAdministradoresController", ['$scope', 'ListAdministradores', ListAdministradoresController]);


function ListAdministradoresProvider() {
    var _baseUrl = "";
    this.setBaseUrl = function (baseUrl) {
        _baseUrl = baseUrl;
    };
    this.$get = ['$http', function ($http) {
            return new ListAdministradores($http, _baseUrl);
        }];
}

function ListAdministradores($http, baseUrl) {
    this.get = function (fnOk, fnError) {
        NProgress.start();
        $http({
            method: 'GET',
            url: baseUrl + '/api/administrador'
        }).success(function (data, status, headers, config) {
            fnOk(data);
            NProgress.done();
        }).error(function (data, status, headers, config) {
            fnError(data, status);
            NProgress.done();
        });
    };

    this.delete = function (id, fnOk, fnError) {
        NProgress.start();
        $http({
            method: 'DELETE',
            url: baseUrl + '/api/administrador/' + id
        }).success(function (data, status, headers, config) {
            fnOk(data);
            NProgress.done();
        }).error(function (data, status, headers, config) {
            fnError(data, status);
            Progress.done();
        });
    }
}

function ListAdministradoresController($scope, ListAdministradores) {
    ListAdministradores.get(
            function (data, status) {
                $scope.administradores = data;
            },
            function (data, status) {
                alert(status + ": " + data);
            }
    );

    $scope.borrar = function (administrador) {
        $scope.administradorBorrar = administrador;
    };

    $scope.confirmBorrar = function () {
        ListAdministradores.delete($scope.administradorBorrar.id,
                function (data, status) {
                    var id = getUserScoperId($scope, $scope.administradorBorrar.id);
                    $scope.administradores.splice(id, 1);
                },
                function (data, status) {
                    alert(status + ": " + data);
                });
    };
    $scope.editar = function (userId) {
        location.replace('#/administrador/update/' + userId.id);
    };
     $scope.crear = function () {
        location.replace('#/administrador/insert/');
    };
}


function getUserScoperId($scope, userId) {
    index = -1;
    var array = eval($scope.usuarios);
    for (var i = 0; i < array.length; i++) {
        if (array[i].id === userId) {
            index = i;
            break;
        }
    }
    return index;
}