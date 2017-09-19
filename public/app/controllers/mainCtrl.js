'use strict';

angular.module('mainController', [])
    .controller('mainCtrl', ['$scope', function ($scope) {
        $scope.date = new Date();
        $scope.menu_class = ['nav-link', 'nav-link', 'nav-link', 'nav-link', 'nav-link', 'nav-link', 'nav-link', 'nav-link' ];
        $scope.item_click = function (item) {

            if (item < $scope.menu_class.length) {
                $scope.menu_class = ['nav-link', 'nav-link', 'nav-link', 'nav-link', 'nav-link', 'nav-link', 'nav-link', 'nav-link'];

                if(item => 0) {
                    $scope.menu_class[item] = 'nav-link active';
                    switch (item) {
                        case 0:
                            $scope.menu_class[2] = 'nav-link active';
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
    }]);

