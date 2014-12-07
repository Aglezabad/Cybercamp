
app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/contactos/', {
            templateUrl: "contactos/list.html",
            controller: "ListContactosController"
        });
    }
]);