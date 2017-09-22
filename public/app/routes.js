'use strict';

let app = angular.module('appRoutes', ['ngRoute'])

    .config(function ($routeProvider, $locationProvider) {
        $routeProvider

            .when('/home', {
                templateUrl: 'app/views/pages/home.html'
            })

            .when('/fliegmituns', {
                templateUrl: 'app/views/pages/fliegmituns.html'
            })

            .when('/ausbildung', {
                templateUrl: 'app/views/pages/ausbildung.html'
            })

            .when('/segelflug', {
                templateUrl: 'app/views/pages/segelflug.html'
            })

            .when('/terminologie', {
                templateUrl: 'app/views/pages/terminologie.html',
                controller: 'terminologieScrollOffsetCtrl',
                controllerAs: 'scrollOffset'
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

            .when('/termine', {
                templateUrl: 'app/views/pages/termine.html'
            })

            .when('/pressespiegel', {
                templateUrl: 'app/views/pages/pressespiegel.html'
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

            .when('/streckenflug', {
                templateUrl: 'app/views/pages/streckenflug.html'
            })

            .when('/ueberlandflug', {
                templateUrl: 'app/views/pages/ueberlandflug.html'
            })

            .when('/flugplatz', {
                templateUrl: 'app/views/pages/flugplatz.html'
            })

            .when('/wegweiser', {
                templateUrl: 'app/views/pages/wegweiser.html'
            })

            .when('/kontakt', {
                templateUrl: 'app/views/pages/kontakt.html'
            })

            .when('/intern', {
                templateUrl: 'app/views/pages/lsv_intern.html',
                authenticated: true


            })


            .when('/register', {
                templateUrl: 'app/views/pages/users/register.html',
                controller: 'registerCtrl',
                controllerAs: 'register',
                authenticated: false
            })

            .when('/profile', {
                templateUrl: 'app/views/pages/users/profile.html',
                controller: 'updateCtrl',
                controllerAs: 'update',
                authenticated: true
            })

            .when('/signin', {
                templateUrl: 'app/views/pages/users/signin.html',
                controller: 'signInCtrl',
                controllerAs: 'signIn',
                authenticated: false
            })

            .when('/signout', {
                templateUrl: 'app/views/pages/users/signout.html',
                controller: 'signOutCtrl',
                controllerAs: 'signOut',
                authenticated: true
            })
            .otherwise({
               redirectTo: '/home'
            });

        $locationProvider.html5Mode({
                enabled: true,
                requireBase: false
            });
    });

app.run(['$rootScope', 'Auth', '$location', function($rootScope, Auth, $location, mainCtrl){
    $rootScope.$on('$routeChangeStart', function(event, next, current){
        if(next.$$route  != undefined && next.$$route.authenticated == true){
            if(!Auth.isSignedIn()){
                event.preventDefault();
                $location.path('signin');
            }
        }else if(next.$$route  != undefined && next.$$route.authenticated == false){
            if(Auth.isSignedIn()){
                event.preventDefault();
                $location.path('intern');
                alert('Du bist schon angemeldet');
            }
        }
    });
}]);