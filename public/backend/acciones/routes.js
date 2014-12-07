
app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/acciones/', {
            templateUrl: "acciones/list.html",
            controller: "ListAccionesController"
        });
    }
]);