'use strict';

angular.module('appRoutes', ['ngRoute'])

    .config(function ($routeProvider, $locationProvider) {
        $routeProvider

            .when('/home', {
                templateUrl: 'app/views/pages/home.html',
            })

            .when('/verein', {
                templateUrl: 'app/views/pages/verein.html'
            })

            .when('/mitgliedwerden', {
                templateUrl: 'app/views/pages/mitgliedwerden.html'
            })

            .when('/jugendgruppe', {
                templateUrl: 'app/views/pages/jugendgruppe.html'
            })

            .when('/ausbildung', {
                templateUrl: 'app/views/pages/ausbildung.html'
            })

            .when('/segelflugzeuge', {
                templateUrl: 'app/views/pages/segelflugzeuge.html'
            })

            .when('/tmg', {
                templateUrl: 'app/views/pages/tmg.html'
            })

            .when('/winde', {
                templateUrl: 'app/views/pages/winde.html'
            })

            .when('/register', {
                templateUrl: 'app/views/pages/users/register.html',
                controller: 'registerCtrl',
                controllerAs: 'register'
            })

            .when('/signin', {
                templateUrl: 'app/views/pages/users/signin.html',
                controller: 'signInCtrl',
                controllerAs: 'signIn'
            })

            .otherwise({
               redirectTo: '/home'
            });

        $locationProvider.html5Mode({
                enabled: true,
                requireBase: false
            });
    });