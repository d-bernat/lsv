'use strict';

angular.module('mainMenuController', ['authServices'])
    .controller('mainMenuCtrl', function ($scope, $location, $timeout, $element) {
        $scope.mainMenuClicked = false;


        $scope.linkClicked = function(link){

            if(link !== $scope.submenuItemLink) {
                closeMenuWithDelay(link);
                $location.path(link);
            }
        };

        let closeMenuWithDelay = function(link){
            $timeout(function(link) {
            $scope.mainMenuClicked = true;
            $scope.submenuItemLink = link;
            }, 200);
        };

    });
