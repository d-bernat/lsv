'use strict';

angular.module('mainMenuController', ['authServices'])
    .controller('mainMenuCtrl', function ($scope, $location, $timeout) {
        $scope.mainMenuClicked = false;


        $scope.linkClicked = function(link){
            closeMenuWithDelay();
            $location.path(link);

        };

        let closeMenuWithDelay = function(){
            $timeout(function() {
            $scope.mainMenuClicked = true;
            }, 300);
        };

    });
