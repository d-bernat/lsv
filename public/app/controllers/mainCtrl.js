'use strict';

angular.module('mainController', ['authServices'])
    .controller('mainCtrl', function (Auth, $scope, $rootScope) {

        $rootScope.$on('$routeChangeStart', function () {
            if (Auth.isSignedIn()) {
                Auth.getUser().then(function (data) {
                    $scope.welcomeMessage = 'Willkommen ' + data.data.username;
                    $rootScope.userData = data.data;
                })
            }else{
                $scope.welcomeMessage = '';
                $rootScope.userData = false;
            }
        });


        $scope.date = new Date();
        $scope.menu_class = ['nav-link', 'nav-link', 'nav-link', 'nav-link', 'nav-link', 'nav-link', 'nav-link', 'nav-link'];
        $scope.item_click = function (item) {

            if (item < $scope.menu_class.length) {
                $scope.menu_class = ['nav-link', 'nav-link', 'nav-link', 'nav-link', 'nav-link', 'nav-link', 'nav-link', 'nav-link'];

                if (item => 0) {
                    $scope.menu_class[item] = 'nav-link active';
                    switch (item) {
                        case 0:
                            $scope.menu_class[2] = 'nav-link active';
                            break;
                        case 1:
                            $scope.intern_menu_class = ['nav-link', 'nav-link'];
                            break;
                        case 2:
                        case 3:
                        case 4:
                        case 5:
                        case 6:
                        case 7:
                            $scope.menu_class[0] = 'nav-link active';
                            break;
                    }
                }
            }

        };

        $scope.intern_menu_class = ['nav-link', 'nav-link'];
        $scope.intern_item_click = function (item) {
            if (item < $scope.intern_menu_class.length) {
                $scope.intern_menu_class = ['nav-link', 'nav-link'];
                $scope.intern_menu_class[item] = 'nav-link active';

                if(item => 0){
                    switch(item){
                        case 0:
                            break;
                        case 1:
                            Auth.logout();
                            break;
                    }
                }
                $scope.menu_class = ['nav-link', 'nav-link active', 'nav-link', 'nav-link', 'nav-link', 'nav-link', 'nav-link', 'nav-link'];
            }
        };

    });

