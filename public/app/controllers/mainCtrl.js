'use strict';

angular.module('mainController', ['authServices'])
    .controller('mainCtrl', function (Auth, $scope, $rootScope, $location) {
        $scope.loadme = false;
        $rootScope.$on('$routeChangeStart', function () {
            if (Auth.isSignedIn()) {
                Auth.getUser().then(function (data) {
                    if (data.data.success == false) {
                        $scope.welcomeMessage = '';
                        $rootScope.userData = false;
                        Auth.logout();
                        $location.path('signin');
                        $scope.loadme = true;
                    } else {
                        $scope.welcomeMessage = 'Willkommen ' + data.data.username;
                        console.log()
                        $rootScope.userData = data.data;
                        $scope.loadme = true;
                    }
                });
            } else {
                $scope.welcomeMessage = '';
                $rootScope.userData = false;
                $scope.loadme = true;
            }
        });
        $scope.date = new Date();

        $scope.hasPermission = function(requiredPermission){
                if(Auth.isSignedIn() && $rootScope.userData.permission !== undefined){
                    return $rootScope.userData.permission.split(',').indexOf(requiredPermission) >= 0;
                }else
                    return false;

        }

        $scope.isSignedIn = function(){
            return Auth.isSignedIn();
        }

    });
