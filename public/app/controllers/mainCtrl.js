'use strict';

angular.module('mainController', ['authServices'])
    .controller('mainCtrl', function (Auth, $scope, $rootScope, $location, $timeout) {
        $scope.loadme = false;
        $scope.mainMenuClicked = false;

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
                        $scope.welcomeMessage = data.data.username;
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

        $scope.linkClicked = function(link){
            closeMenuWithDelay();
            $location.path(link);

        }

        let closeMenuWithDelay = function(){
            $timeout(function() {
            $scope.mainMenuClicked = true;
            }, 300);
        }


    });
