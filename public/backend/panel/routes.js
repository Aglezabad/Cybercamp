
app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/accesos/', {
            templateUrl: "administrador/list.html",
            controller: "ListAdministradoresController"
        });
    }
]);