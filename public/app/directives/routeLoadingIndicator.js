'use strict';

angular.module('routeLoadingIndicator', [])
    .directive('routeLoadingIndicator', ['$rootScope', function ($rootScope) {
        return {
            restrict: 'E',
            template:"<div ng-if='isRouteLoading' id='escapingBallG'><div id='escapingBall_1' class='escapingBallG'></div></div>",
            link:function(scope, elem, attrs) {
                scope.isRouteLoading = false;

                $rootScope.$on('$routeChangeStart', function () {
                    scope.isRouteLoading = true;
                });

                $rootScope.$on('$routeChangeSuccess', function () {
                    scope.isRouteLoading = false;
                });
            }
        }
    }]);