/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


app.provider("ListAcciones", ListAccionesProvider);

app.config(['baseUrl', 'ListAccionesProvider', function (baseUrl, ListAccionesProvider) {
        ListAccionesProvider.setBaseUrl(baseUrl);
    }]);

app.controller("ListAccionesController", ['$scope', 'ListAcciones', ListAccionesController]);


function ListAccionesProvider() {
    var _baseUrl = "";
    this.setBaseUrl = function (baseUrl) {
        _baseUrl = baseUrl;
    };
    this.$get = ['$http', function ($http) {
            return new ListAcciones($http, _baseUrl);
        }];
}

function ListAcciones($http, baseUrl) {
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

function ListAccionesController($scope, ListAcciones) {
  
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