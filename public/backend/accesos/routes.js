
app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/accesos/', {
            templateUrl: "accesos/list.html",
            controller: "ListAccesosController"
        });
    }
]);
