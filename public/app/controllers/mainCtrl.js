'use strict';

angular.module('mainController', ['authServices'])
    .controller('mainCtrl', function (Auth, $scope, $rootScope, $location) {
        $rootScope.$on('$routeChangeStart', function () {
            if (Auth.isSignedIn()) {
                Auth.getUser().then(function (data) {
                    console.log(data);
                    if (data.data.success == false) {
                        $scope.welcomeMessage = '';
                        $rootScope.userData = false;
                        Auth.logout();
                        $location.path('signin');
                    } else {
                        $scope.welcomeMessage = 'Willkommen ' + data.data.username;
                        $rootScope.userData = data.data;
                    }
                })
            } else {
                $scope.welcomeMessage = '';
                $rootScope.userData = false;
            }
        });


        $scope.date = new Date();
        $scope.menu_class = ['nav-item', 'nav-item', 'nav-item', 'nav-item', 'nav-item', 'nav-item', 'nav-item', 'nav-item', 'nav_item'];
        $scope.item_click = function (item) {

            if (item < $scope.menu_class.length) {
                $scope.menu_class = ['nav-item', 'nav-item', 'nav-item', 'nav-item', 'nav-item', 'nav-item', 'nav-item', 'nav-item', 'nav_item'];

                if (item => 0) {
                    $scope.menu_class[item] = 'nav-item active';
                    switch (item) {
                        case 0:
                            $scope.menu_class[2] = 'nav-item active';
                            break;
                        case 1:
                            $scope.intern_menu_class = ['nav-item', 'nav-item'];
                            break;
                        case 2:
                        case 3:
                        case 4:
                        case 5:
                        case 6:
                        case 7:
                            $scope.menu_class[0] = 'nav-item active';
                            break;
                    }
                }
            }

        };

        $scope.intern_menu_class = ['nav-item', 'nav-item'];
        $scope.intern_item_click = function (item) {
            if (item < $scope.intern_menu_class.length) {
                $scope.intern_menu_class = ['nav-item', 'nav-item'];
                $scope.intern_menu_class[item] = 'nav-item active';

                if (item => 0) {
                    switch (item) {
                        case 0:
                            break;
                        case 1:
                            Auth.logout();
                            break;
                    }
                }
                $scope.menu_class = ['nav-item', 'nav-item active', 'nav-item', 'nav-item', 'nav-item', 'nav-item', 'nav-item', 'nav-item'];
            }
        };

    });
